import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from api.config import settings
from api.cv_analyzer import CVAnalyzer
from api.job_radar import JobRadar
from api.optimizer import ApplicationOptimizer
from api.models import init_db, SessionLocal, Job, Application

app = FastAPI(title="Career Booster AI 2.0")

# Initialize Database on Startup
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = CVAnalyzer(settings.cv_folder)
radar = JobRadar(settings)
optimizer = ApplicationOptimizer(settings)

@app.get("/")
def read_root():
    return {"message": "Career Booster AI 2.0 Backend is running"}

@app.get("/api/jobs")
def get_jobs(
    q: str | None = Query(None, description="Search term"),
    location: str | None = Query(None, description="Location filter"),
):
    return radar.search_jobs(query=q, location=location)

@app.post("/api/track")
def track_application(job_data: dict):
    db = SessionLocal()
    try:
        # Create or Get Job
        job = db.query(Job).filter(Job.url == job_data['url']).first()
        if not job:
            job = Job(
                company=job_data.get('company', 'Unknown'),
                title=job_data.get('title', 'Unknown'),
                url=job_data['url'],
                score=job_data.get('score', 0),
                rationale=job_data.get('rationale', {})
            )
            db.add(job)
            db.commit()
            db.refresh(job)
        
        # Create Application
        app_record = Application(job_id=job.id, status="Applied")
        db.add(app_record)
        db.commit()
        return {"status": "success", "message": "Application tracked!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/api/stats")
def get_stats():
    db = SessionLocal()
    try:
        total_apps = db.query(Application).count()
        # Mocking some metrics for now
        return {
            "total_applications": total_apps,
            "response_rate": "15%",
            "active_interviews": 2
        }
    finally:
        db.close()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
