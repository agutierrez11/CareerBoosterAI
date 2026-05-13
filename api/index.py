import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.cv_analyzer import CVAnalyzer
from backend.job_radar import JobRadar
from backend.optimizer import ApplicationOptimizer

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = CVAnalyzer(settings.cv_folder)
radar = JobRadar(settings)
optimizer = ApplicationOptimizer(settings)

@app.get("/")
def read_root():
    return {"message": "Career Booster AI Backend is running"}

@app.get("/cvs")
def get_cvs():
    cv_data = analyzer.scan_cvs()
    return [
        {
            "filename": filename,
            "length": data["length"],
            "preview": data["content"][:220] + "...",
        }
        for filename, data in cv_data.items()
    ]

@app.get("/jobs")
def get_jobs(
    q: str | None = Query(None, description="Search term"),
    location: str | None = Query(None, description="Location filter"),
):
    return radar.search_jobs(query=q, location=location)

@app.post("/optimize")
def optimize_cv(
    cv_id: str,
    job_id: str,
    job_description: str = "",
):
    # Ensure analyzer has get_cv_text or equivalent
    cv_data = analyzer.get_cv_text(cv_id) if hasattr(analyzer, 'get_cv_text') else "CV Content Placeholder"
    if not cv_data:
        raise HTTPException(status_code=404, detail="CV not found")
    return optimizer.optimize_application(cv_data, job_description)

@app.post("/cvs/upload")
async def upload_cv(file: UploadFile = File(...)):
    if not settings.cv_folder.exists():
        settings.cv_folder.mkdir(parents=True, exist_ok=True)

    file_location = settings.cv_folder / file.filename
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename, "path": str(file_location)}

@app.get("/jobs/custom")
def get_custom_jobs(url: str = Query(..., description="Job page URL")):
    from backend.url_fetcher import URLFetcher

    fetcher = URLFetcher()
    return fetcher.scrape_url(url)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
