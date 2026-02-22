import requests
from bs4 import BeautifulSoup
import re

class URLFetcher:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    def scrape_url(self, url):
        """
        Attempts to find job titles and descriptions in a generic HTML page.
        This is a heuristic-based approach.
        """
        print(f"Scraping custom URL: {url}")
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            jobs = []
            # Heuristic: Find elements that look like job titles (h1, h2, h3, or links)
            # We look for common keywords in parent containers or text
            job_keywords = ["Sales", "BDR", "Representative", "Consultant", "Fintech", "Payments", "B2B"]
            
            # Simple approach: Find all <a> tags or <h3> tags and see if they contain keywords
            potential_items = soup.find_all(['a', 'h2', 'h3', 'div'], class_=re.compile(r'job|vacancy|opening|position', re.I))
            
            if not potential_items:
                # Fallback to searching all text for keywords
                potential_items = soup.find_all(['h2', 'h3', 'a'])

            for i, item in enumerate(potential_items[:10]):
                text = item.get_text(separator=' ', strip=True)
                if any(kw.lower() in text.lower() for kw in job_keywords):
                    # Try to find a link if the current item isn't an <a>
                    link = "#"
                    if item.name == 'a':
                        link = item.get('href', '#')
                    else:
                        anchor = item.find('a')
                        if anchor:
                            link = anchor.get('href', '#')
                    
                    # Ensure absolute URL
                    if link.startswith('/'):
                        from urllib.parse import urljoin
                        link = urljoin(url, link)

                    jobs.append({
                        "id": 500 + i,
                        "title": text[:100],
                        "company": "Scraped from site",
                        "location": "See site",
                        "salary": "N/A",
                        "posted": "Recent",
                        "description": "Found via URL scraper. Click link to view details.",
                        "tags": ["Scraped", "Custom"],
                        "url": link
                    })
            
            # Remove duplicates
            unique_jobs = []
            seen_titles = set()
            for job in jobs:
                if job['title'] not in seen_titles:
                    unique_jobs.append(job)
                    seen_titles.add(job['title'])

            return unique_jobs[:10]
            
        except Exception as e:
            print(f"Error scraping custom URL: {e}")
            return []
