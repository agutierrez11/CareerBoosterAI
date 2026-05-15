import re
import requests
import os
import json
import sys
from typing import Any

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from config import settings

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
        if os.path.exists(self.data_path):
            try:
                with open(self.data_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except: return []
        return []

    def search_jobs(self, query=None, location=None):
        raw_jobs = self._fetch_all_sources(query, location)
        
        # Emergency Seed Data
        if not raw_jobs:
            raw_jobs = [
                {"company": "Bitso", "title": "General Manager (Bitso Business)", "url": "https://bitso.com/careers", "description": "Liderazgo GTM en México."},
                {"company": "OKX", "title": "Principal Product Manager (Growth)", "url": "https://www.okx.com/careers", "description": "Escalado de mercado en LATAM."},
                {"company": "Binance", "title": "Institutional Sales Manager", "url": "https://www.binance.com/es/careers", "description": "Ventas institucionales Fintech."},
                {"company": "EBANX", "title": "Regional Lead (North Cone)", "url": "https://www.ebanx.com/en/careers", "description": "Expansión comercial México."},
            ]

        analyzed_jobs = []
        try:
            from optimizer import ApplicationOptimizer
            optimizer = ApplicationOptimizer(self.settings)
            for job in raw_jobs[:10]:
                analysis = optimizer.analyze_match("Antonio Jiménez - Expert in Fintech GTM", job.get('description', ''))
                job['score'] = analysis.get('score', 8.5)
                job['rationale'] = analysis
                analyzed_jobs.append(job)
        except Exception as e:
            print(f"AI Analysis failed, returning raw: {e}")
            for job in raw_jobs:
                job['score'] = 8.0
                job['rationale'] = {"pros": ["Manual review required"], "cons": [], "strategy": "Analyze manually."}
                analyzed_jobs.append(job)
            
        return analyzed_jobs

    def _fetch_all_sources(self, query=None, location=None):
        live_jobs = []
        live_jobs.extend(self._search_remotive(query, location))
        live_jobs.extend(self._search_jobleads(query, location))
        live_jobs.extend(self._search_google_jobs(query, location))
        return live_jobs

    def _search_jobleads(self, query=None, location=None):
        url = f"https://www.jobleads.com/search/jobs?q={query or 'Fintech'}&l={location or 'Mexico'}"
        try:
            res = requests.get(f"http://api.scrape.do?token={self.settings.scrape_do_token}&url={url}", timeout=15)
            if res.status_code == 200:
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(res.text, 'html.parser')
                found = []
                # JobLeads usually has a simple list of links for non-logged users
                for link in soup.find_all('a', href=re.compile(r'/job/')):
                    found.append({
                        "company": "JobLeads Elite",
                        "title": link.text.strip() or "Executive Opportunity",
                        "url": "https://www.jobleads.com" + link['href'],
                        "description": "Strategic high-level role identified on JobLeads."
                    })
                return found[:10]
        except: pass
        return []

    def _search_remotive(self, query=None, location=None):
        try:
            res = requests.get(self.remotive_url, timeout=10)
            data = res.json().get("jobs", [])
            return [{"company": j['company_name'], "title": j['title'], "url": j['url'], "description": j['description'], "source": "Remotive"} for j in data[:10]]
        except: return []

    def _search_google_jobs(self, query=None, location=None):
        jobs = []
        # Buscar en Google para LinkedIn, Glassdoor, Indeed, etc.
        search_terms = [
            f'site:linkedin.com/jobs "{query or "fintech sales"}" "{location or "Mexico"}"',
            f'site:glassdoor.com "{query or "payments director"}" "{location or "LATAM"}"',
            f'site:indeed.com "{query or "business development"}" "{location or "remote"}"',
        ]
        
        for term in search_terms:
            try:
                # Usar el servicio de scraping para Google
                google_url = f"https://www.google.com/search?q={requests.utils.requote_uri(term)}&num=10"
                scrape_url = f"http://api.scrape.do?token={self.settings.scrape_do_token}&url={google_url}"
                res = requests.get(scrape_url, timeout=15)
                if res.status_code == 200:
                    from bs4 import BeautifulSoup
                    soup = BeautifulSoup(res.text, 'html.parser')
                    for link in soup.find_all('a', href=True):
                        href = link['href']
                        if 'linkedin.com/jobs' in href or 'glassdoor.com' in href or 'indeed.com' in href:
                            title = link.get_text().strip() or "Vacante encontrada"
                            jobs.append({
                                "company": "Empresa externa",
                                "title": title[:100],
                                "url": href if href.startswith('http') else f"https://www.google.com{href}",
                                "description": f"Vacante encontrada en búsqueda de {term.split('site:')[1].split()[0]}",
                                "source": term.split('site:')[1].split()[0].replace('.com', '').title()
                            })
            except Exception as e:
                print(f"Google search failed for {term}: {e}")
        
        return jobs[:15]

    def save_results(self, jobs):
        with open(self.data_path, 'w', encoding='utf-8') as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    from api.config import settings
    radar = JobRadar(settings)
    jobs = radar.search_jobs()
    radar.save_results(jobs)
    print(f"Found {len(jobs)} jobs and saved to {radar.data_path}")
