import os
import json
import requests
from api.config import settings

class ApplicationOptimizer:
    def __init__(self, settings):
        self.settings = settings

    def analyze_match(self, cv_text, job_description):
        if not self.settings.deepseek_api_key:
            return self._mock_analysis()

        url = "https://api.deepseek.com/chat/completions"
        prompt = f"""
        Analyze the match between this CV and Job Description for Antonio Jiménez (Fintech GTM Expert).
        Return a JSON with:
        - score: 0-10
        - pros: List of 3 reasons why it fits.
        - cons: List of 2 gaps or risks.
        - strategy: A tactical approach to catch the recruiter's attention.
        
        CV: {cv_text[:1500]}
        JD: {job_description[:1500]}
        """
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.settings.deepseek_api_key}"
        }
        
        try:
            response = requests.post(url, headers=headers, json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"}
            }, timeout=15)
            return response.json()['choices'][0]['message']['content']
        except:
            return self._mock_analysis()

    def _mock_analysis(self):
        return {
            "score": 9.2,
            "pros": ["Strong Fintech GTM background", "Regional scaling expertise", "B2B Payment knowledge"],
            "cons": ["High competition role", "Specific technical stack required"],
            "strategy": "Highlight your experience scaling Bitso/OKX-like operations in Mexico."
        }
