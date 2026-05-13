import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from cv_analyzer import CVAnalyzer
from job_radar import JobRadar
from optimizer import ApplicationOptimizer

app = FastAPI(title="Career Booster AI")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and React defaults
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de rutas relativas para portabilidad (Vercel/Local)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CV_PATH = os.path.join(BASE_DIR, "uploads")
if not os.path.exists(CV_PATH):
    os.makedirs(CV_PATH)

analyzer = CVAnalyzer(CV_PATH)
radar = JobRadar()
optimizer = ApplicationOptimizer()

@app.get("/")
def read_root():
    return {"message": "Career Booster AI Backend is Running"}

@app.get("/cvs")
def get_cvs():
    """Returns the list of analyzed CVs."""
    cv_data = analyzer.scan_cvs()
    # Summarize for list view
    summary = []
    for filename, data in cv_data.items():
        summary.append({
            "filename": filename,
            "length": data["length"],
            "preview": data["content"][:200] + "..."
        })
    return summary

@app.get("/jobs")
def get_jobs(q: str = None):
    """Returns the list of matching jobs."""
    return radar.search_jobs(query=q)

@app.post("/optimize")
def optimize_cv(cv_id: str, job_id: int, job_description: str = ""):
    """Optimizes a CV for a specific job."""
    # We use the description passed from the frontend for the AI analysis
    return optimizer.optimize_application("CV content", job_description)

@app.post("/cvs/upload")
async def upload_cv(file: UploadFile = File(...)):
    """Uploads a new CV PDF to the user's folder."""
    if not os.path.exists(CV_PATH):
        os.makedirs(CV_PATH)
        
    file_location = os.path.join(CV_PATH, file.filename)
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    return {"info": f"file '{file.filename}' saved at '{file_location}'"}

@app.get("/jobs/custom")
def get_custom_jobs(url: str):
    """Scrapes a custom URL for job listings."""
    from url_fetcher import URLFetcher
    fetcher = URLFetcher()
    return fetcher.scrape_url(url)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
