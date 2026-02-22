import requests

class JobRadar:
    def __init__(self):
        # Using Remotive API for better global remote coverage
        self.api_url = "https://remotive.com/api/remote-jobs"
        self.keywords = [
            "Sales", "Business Development", "Fintech", "B2B", "Payments", 
            "Partnerships", "Account Manager", "Consulting", "Acquiring",
            "Digital Payments", "SaaS", "Strategic Sales"
        ]
        self.preferred_locations = ["LATAM", "Mexico", "Remote", "Worldwide", "North America", "Everywhere"]

    def search_jobs(self, query=None):
        """
        Fetches remote jobs and filters for relevancy to Antonio's profile and location.
        """
        search_term = query or "Sales"
        print(f"Fetching real remote jobs for: {search_term}...")
        
        try:
            # Remotive allows filtering by category or search term
            # For simplicity and coverage, we fetch recent and filter internally
            response = requests.get(f"{self.api_url}?limit=50", timeout=12)
            response.raise_for_status()
            data = response.json()
            
            raw_jobs = data.get('jobs', [])
            mapped_jobs = []
            
            for i, job in enumerate(raw_jobs):
                title = job.get('title', '')
                description = job.get('description', '')
                location = job.get('candidate_required_location', 'Remote')
                
                # Check for profile keywords
                profile_match = any(kw.lower() in (title + description).lower() for kw in self.keywords)
                if query:
                    profile_match = query.lower() in (title + description).lower()
                
                # Check for geographic fit (Mexico/LATAM/Remote)
                # We prioritize jobs that are Worldwide or mention LATAM/Mexico
                geo_match = any(loc.lower() in location.lower() for loc in self.preferred_locations)
                
                # Don't show jobs explicitly restricted to regions Antonio cannot work in (e.g., USA Only, UK Only, EMEA)
                is_restricted = any(forbidden in location.upper() for forbidden in ["UK ONLY", "USA ONLY", "EUROPE", "EMEA"]) and "LATAM" not in location.upper()

                if profile_match and geo_match and not is_restricted:
                    mapped_jobs.append({
                        "id": job.get('id', i + 1),
                        "title": title,
                        "company": job.get('company_name', 'N/A'),
                        "location": location,
                        "salary": job.get('salary', 'N/A'),
                        "posted": "Recently",
                        "description": description,
                        "tags": job.get('tags', [])[:3],
                        "url": job.get('url', '#')
                    })

            return mapped_jobs[:20] # Return top 20 matches
            
        except Exception as e:
            print(f"Error fetching remote jobs: {e}")
            return []
            
        except Exception as e:
            print(f"Error fetching real jobs: {e}")
            return []

if __name__ == "__main__":
    radar = JobRadar()
    jobs = radar.search_jobs()
    for job in jobs:
        print(f"- {job['title']} at {job['company']}")
