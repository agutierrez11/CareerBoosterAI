import re
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup

class URLFetcher:
    def __init__(self):
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
        }
        self.job_keywords = [
            "Sales", "Business Development", "BDR", "Account Executive",
            "Fintech", "Payments", "B2B", "Onboarding", "Fraud", "KYC", "AML"
        ]

    def scrape_url(self, url):
        try:
            response = requests.get(url, headers=self.headers, timeout=12)
            response.raise_for_status()
        except Exception as exc:
            print(f"URLFetcher error: {exc}")
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        jobs = []
        potential_items = soup.select("a, h2, h3, .job, .vacancy, .position, [role='link']")

        seen = set()
        for item in potential_items:
            text = item.get_text(" ", strip=True)
            if not text:
                continue
            if any(kw.lower() in text.lower() for kw in self.job_keywords):
                link = self._extract_link(item, url)
                title = self._clean_text(text)
                if title in seen:
                    continue
                seen.add(title)
                jobs.append({
                    "id": hash(title + link),
                    "title": title[:120],
                    "company": "External Page",
                    "location": "Ver URL",
                    "salary": "N/A",
                    "posted": "Reciente",
                    "description": text,
                    "tags": ["Scraped", "Custom"],
                    "url": link,
                })

        return jobs[:15]

    def _extract_link(self, item, base_url):
        if item.name == "a" and item.has_attr("href"):
            href = item["href"]
        else:
            anchor = item.find("a", href=True)
            href = anchor["href"] if anchor else "#"
        if href.startswith("/"):
            href = urljoin(base_url, href)
        if href.startswith("//"):
            href = f"{urlparse(base_url).scheme}:{href}"
        return href

    def _clean_text(self, value):
        return re.sub(r"\s+", " ", value).strip()
