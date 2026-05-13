import requests
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from api.models import init_db, SessionLocal, Job, Application

# ── Rutas dinámicas con pathlib (nunca absolutas) ──────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "storage" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Career Booster AI 2.0")

# Initialize Database on Startup
init_db()

# ── CORS: solo orígenes conocidos ──────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://jobradartono.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Career Booster AI 2.0 — operational"}

# ── PROXY: el backend llama a Remotive, el frontend no sabe que existe ──────
@app.get("/api/jobs")
def get_jobs(
    q: str | None = Query(None),
    location: str | None = Query(None),
):
    try:
        search = f"{q or 'fintech sales manager'} {location or 'latam mexico remote'}"
        response = requests.get(
            "https://remotive.com/api/remote-jobs",
            params={"search": search, "limit": 20},
            timeout=10,
        )
        response.raise_for_status()
        jobs = response.json().get("jobs", [])
        # Normalizar campos
        return [
            {
                "company": j.get("company_name", "N/A"),
                "title": j.get("title", "N/A"),
                "url": j.get("url", "#"),
                "location": j.get("candidate_required_location", "Remote"),
                "salary": j.get("salary") or None,
                "tags": j.get("tags", [])[:4],
                "description": j.get("description", "")[:300],
            }
            for j in jobs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudieron obtener los empleos: {e}")

# ── TRACKING: guarda aplicaciones en la BD ──────────────────────────────────
@app.post("/api/track")
def track_application(job_data: dict):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.url == job_data.get("url")).first()
        if not job:
            job = Job(
                company=job_data.get("company", "Unknown"),
                title=job_data.get("title", "Unknown"),
                url=job_data.get("url", "#"),
                score=job_data.get("score", 0),
                rationale=job_data.get("rationale", {}),
            )
            db.add(job)
            db.commit()
            db.refresh(job)

        record = Application(job_id=job.id, status="Applied")
        db.add(record)
        db.commit()
        return {"status": "success", "message": "Application tracked!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# ── STATS: métricas reales desde la BD ─────────────────────────────────────
@app.get("/api/stats")
def get_stats():
    db = SessionLocal()
    try:
        total = db.query(Application).count()
        interviews = db.query(Application).filter(Application.status == "Interview").count()
        return {
            "total_applications": total,
            "active_interviews": interviews,
            "response_rate": f"{round((interviews / total * 100) if total else 0)}%",
        }
    finally:
        db.close()

# ── CV UPLOAD ───────────────────────────────────────────────────────────────
@app.post("/api/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se aceptan archivos PDF")
    dest = UPLOADS_DIR / file.filename
    with open(dest, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename, "status": "uploaded"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
