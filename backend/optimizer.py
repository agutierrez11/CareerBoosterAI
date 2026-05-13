import os
import time
import json
from backend.config import settings

class ApplicationOptimizer:
    def __init__(self, settings):
        self.settings = settings

    def optimize_application(self, cv_content, job_description):
        if self.settings.deepseek_api_key:
            return self._optimize_with_deepseek(cv_content, job_description)
        return self._optimize_mock(cv_content, job_description)

    def _optimize_with_deepseek(self, cv_content, job_description):
        import requests
        
        api_key = self.settings.deepseek_api_key
        url = "https://api.deepseek.com/chat/completions"
        
        prompt = (
            "Eres un experto en GTM y Sales Recruitment para Fintech. "
            "Recibe el texto del CV de Antonio Gutiérrez y la descripción de una vacante. "
            "Devuelve un JSON con: match_score (0-100), matching_skills (lista), "
            "suggested_rewrites (lista de objetos {original, rewritten}), "
            "summary_punchline (una frase de alto impacto)."
        )
        prompt += f"\n\nCV:\n{cv_content}\n\nJob:\n{job_description}\n"
        prompt += "\nResponde SOLO con JSON válido."

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Eres un asistente experto en reclutamiento."},
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            text = data['choices'][0]['message']['content']
            
            # Limpiar posibles bloques de código markdown
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            
            return json.loads(text)
        except Exception as e:
            print(f"DeepSeek Error: {e}")
            return self._optimize_mock(cv_content, job_description)

    def _optimize_mock(self, cv_content, job_description):
        return {
            "match_score": 90,
            "matching_skills": ["GTM Strategy", "Fintech Sales", "B2B Payments"],
            "suggested_rewrites": [
                {
                    "original": "Managed sales team.",
                    "rewritten": "Led high-performance GTM teams in the Fintech sector, achieving a 40% growth in payment processing volume."
                }
            ],
            "summary_punchline": "Líder estratégico de ventas con enfoque en infraestructura de pagos y crecimiento regional."
        }
