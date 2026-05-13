from sqlalchemy import create_all, Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

Base = declarative_base()

class Job(Base):
    __tablename__ = 'jobs'
    id = Column(Integer, primary_key=True)
    external_id = Column(String, unique=True)
    company = Column(String)
    title = Column(String)
    url = Column(String)
    location = Column(String)
    score = Column(Float)
    rationale = Column(JSON) # Stores PROS, CONS, and Strategy
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Application(Base):
    __tablename__ = 'applications'
    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey('jobs.id'))
    status = Column(String, default='Applied') # Applied, Interview, Offer, Rejected
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(String)
    cv_version = Column(String)

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./radar.db")
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
