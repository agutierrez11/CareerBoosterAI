import os
import json
import sys
from pathlib import Path

# Añadir el directorio raíz al path para permitir importaciones de 'api'
root_dir = Path(__file__).parent.parent.absolute()
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from api.job_radar import JobRadar
from api.config import settings

def update_radar():
    print("Iniciando escaneo activo de vacantes (CareerBoosterAI Swarm)...")
    
    # Inicializar Radar
    radar = JobRadar(settings)
    
    # Realizar búsqueda (usamos Fintech y Mexico como defaults estratégicos)
    print("Buscando nuevas oportunidades en Remotive, JobLeads y Google...")
    new_hits = radar.search_jobs(query="Fintech", location="Mexico")
    
    # Guardar resultados
    try:
        radar.save_results(new_hits)
        print(f"✅ Escaneo completado. Se encontraron {len(new_hits)} oportunidades.")
        print(f"📁 Resultados guardados en: {radar.data_path}")
    except Exception as e:
        print(f"❌ Error al guardar los resultados: {e}")
        # No levantamos excepción para que el workflow pueda continuar si no hay cambios críticos

if __name__ == "__main__":
    update_radar()
