import os
import time
from backend.config import settings

class ApplicationOptimizer:
    def __init__(self, settings):
        self.settings = settings

    def optimize_application(self, cv_content, job_description):
        if self.settings.openai_api_key:
            return self._optimize_with_openai(cv_content, job_description)
        return self._optimize_mock(cv_content, job_description)

    def _optimize_with_openai(self, cv_content, job_description):
        import openai
        # Compatibility for both v0.28 and v1.0+
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.settings.openai_api_key)
            
            prompt = (
                "Eres un asistente de carrera profesional. "
                "Recibe el texto del CV y la descripción de una vacante. "
                "Devuelve un JSON con match_score, matching_skills, suggested_rewrites, "
                "section_order y summary_punchline."
            )
            prompt += f"\n\nCV:\n{cv_content}\n\nJob:\n{job_description}\n\n"
            prompt += "Responde solo con JSON válido. No incluyas explicaciones adicionales."

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role":"system","content":prompt}],
                max_tokens=700,
                temperature=0.3
            )
            text = response.choices[0].message.content
        except ImportError:
            # Legacy v0.28
            import openai
            openai.api_key = self.settings.openai_api_key
            # (Logic remains same as user provided)
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[{"role":"system","content":prompt}],
                max_tokens=700,
                temperature=0.3
            )
            text = response.choices[0].message.content

        import json
        return json.loads(text)

    def _optimize_mock(self, cv_content, job_description):
        time.sleep(1.5)
        return {
            "match_score": 92,
            "matching_skills": ["B2B Sales", "Fintech Consulting", "Digital Payments", "Account Management"],
            "suggested_rewrites": [
                {
                    "original": "Managed portfolio of clients.",
                    "rewritten": "Strategically managed a high-value portfolio of 80+ B2B clients in Fintech, driving a 35% increase in acquisition."
                }
            ],
            "section_order": ["Professional Summary", "Experience", "Education"],
            "summary_punchline": "Results-driven Fintech Sales Leader with deep expertise in digital payment ecosystems across México y LATAM."
        }
