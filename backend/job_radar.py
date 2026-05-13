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
        self.data_path = os.path.join(os.path.dirname(__file__), "data", "active_vacancies.json")

    def load_local_jobs(self):
        """Loads verified jobs from the local database."""
        import json
        if os.path.exists(self.data_path):
            with open(self.data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def search_jobs(self, query=None):
        """
        Fetches jobs, prioritizing local verified data for Antonio.
        """
        local_jobs = self.load_local_jobs()
        
        # If no query, return local verified jobs as top priority
        if not query:
            return local_jobs

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

    def save_results(self, jobs):
        """Saves findings to the local database."""
        import json
        with open(self.data_path, 'w', encoding='utf-8') as f:
            json.dump(jobs, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved {len(jobs)} active vacancies to {self.data_path}")

if __name__ == "__main__":
    # This block runs during the Daily GitHub Action scan
    radar = JobRadar()
    print("🚀 Starting Daily Strategic Scan...")
    
    # 1. Fetch from Remotive (as baseline)
    new_jobs = radar.search_jobs(query="Fintech Sales Mexico")
    
    # 2. In a real scenario, we would add more scrapers here
    # For now, we ensure the local database is updated
    if new_jobs:
        radar.save_results(new_jobs)
    else:
        print("⚠️ No new jobs found today. Keeping existing data.")
