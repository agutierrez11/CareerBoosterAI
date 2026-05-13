import re
import requests
import os
import json
from typing import Any
from backend.config import settings

class JobRadar:
    def __init__(self, settings):
        self.settings = settings
        self.remotive_url = "https://remotive.com/api/remote-jobs"
        self.scrape_url = "https://api.scrape.do/plugin/google/search"
        self.profile_keywords = [
            "sales manager", "business development", "account executive",
            "fintech", "payments", "antifraud", "acquiring", "b2b",
            "kyc", "aml", "risk", "digital payments", "market intelligence"
        ]
        self.location_keywords = ["mexico", "latam", "remote", "latinoamerica", "cancun"]
        self.data_path = os.path.join(os.path.dirname(__file__), "data", "active_vacancies.json")

    def load_local_jobs(self):
        """Loads verified jobs from the local database."""
        if os.path.exists(self.data_path):
            with open(self.data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def search_jobs(self, query=None, location=None):
        # 1. Start with local verified jobs as baseline
        local_jobs = self.load_local_jobs()
        
        # 2. Fetch live data
        if self.settings.scrape_do_token:
            live_jobs = self._search_scrape_do(query=query, location=location)
        else:
            live_jobs = self._search_remotive(query=query, location=location)

        # 3. Score and merge
        all_jobs = local_jobs + live_jobs
        scored = [self._score_job(job) for job in all_jobs]
        
        # Remove duplicates by URL
        seen_urls = set()
        unique_jobs = []
        for job in scored:
            if job["url"] not in seen_urls:
                unique_jobs.append(job)
                seen_urls.add(job["url"])

        unique_jobs.sort(key=lambda item: item.get("score", item.get("match_score", 0)), reverse=True)
        return unique_jobs[:30]

    def _search_remotive(self, query=None, location=None):
        try:
            response = requests.get(self.remotive_url, timeout=12)
            response.raise_for_status()
            raw_jobs = response.json().get("jobs", [])
        except Exception:
            return []

        result = []
        for job in raw_jobs:
            title = job.get("title", "")
            description = job.get("description", "")
            candidate_location = job.get("candidate_required_location", "")
            if self._location_match(candidate_location, location):
                result.append({
                    "id": job.get("id"),
                    "title": title,
                    "company": job.get("company_name", "N/A"),
                    "location": candidate_location or "Remote",
                    "salary": job.get("salary", "N/A"),
                    "posted": job.get("publication_date", "N/A"),
                    "description": description,
                    "tags": job.get("tags", [])[:3],
                    "url": job.get("url", "#"),
                })
        return self._filter_profile(result, query)

    def _search_scrape_do(self, query=None, location=None):
        q = query or "fintech sales manager latam"
        if location:
            q = f"{q} {location}"
        elif "mexico" not in q.lower() and "latam" not in q.lower():
            q = f"{q} mexico latam remote"

        params = {
            "token": self.settings.scrape_do_token,
            "q": q,
            "gl": "mx",
            "hl": "es",
        }

        try:
            response = requests.get(self.scrape_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
        except Exception:
            return []

        candidates = []
        for item in data.get("organic", []) + data.get("knowledge_graph", []):
            title = item.get("title") or item.get("snippet") or ""
            link = item.get("link") or item.get("url") or ""
            snippet = item.get("snippet") or item.get("description") or ""
            if not title:
                continue
            if self._looks_like_job(title, snippet):
                candidates.append({
                    "id": hash(link),
                    "title": title,
                    "company": item.get("displayed_link", "") or item.get("source", "") or "N/A",
                    "location": location or "LATAM / Remote",
                    "salary": "N/A",
                    "posted": "Reciente",
                    "description": snippet,
                    "tags": ["Scrape.do", "Fintech"],
                    "url": link,
                })
        return self._filter_profile(candidates, query)

    def _filter_profile(self, jobs, query=None):
        filtered = []
        for job in jobs:
            text = f"{job['title']} {job['description']}".lower()
            profile_match = bool(query and query.lower() in text) or any(kw in text for kw in self.profile_keywords)
            if profile_match:
                filtered.append(job)
        return filtered

    def _location_match(self, location_text, location=None):
        text = (location_text or "").lower()
        if location:
            return location.lower() in text
        return any(loc in text for loc in self.location_keywords) or "remote" in text

    def _looks_like_job(self, title, snippet):
        text = f"{title} {snippet}".lower()
        return any(kw in text for kw in ["manager", "sales", "business development", "account", "fintech", "payments", "fraud"])
    
    def _score_job(self, job):
        # Support both local score (match_score) and calculated score
        base_score = job.get("match_score", 0)
        if base_score > 0:
            job["score"] = base_score
            return job

        text = f"{job['title']} {job['description']} {job['company']}".lower()
        score = 0
        for kw in self.profile_keywords:
            if kw in text:
                score += 2
        if "mexico" in text or "latam" in text or "remote" in text:
            score += 3
        if job["location"] and any(loc in job["location"].lower() for loc in self.location_keywords):
            score += 2
        score += 1 if "fintech" in text else 0
        
        # Scale to match local score format (0-10 or 0-100)
        # Assuming local uses 0-10 based on our previous interaction
        job["score"] = min(score / 2, 10.0) 
        return job

    def save_results(self, jobs):
        """Saves findings to the local database."""
        with open(self.data_path, 'w', encoding='utf-8') as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    from backend.config import settings
    radar = JobRadar(settings)
    print("🚀 Starting Daily Strategic Scan...")
    new_jobs = radar.search_jobs(query="Fintech Sales Mexico")
    if new_jobs:
        radar.save_results(new_jobs)
