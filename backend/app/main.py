from fastapi import FastAPI

from app.db.base import Base
from app.db.session import engine
from app.db.models import User, ReadingSession, AnalysisResult

app = FastAPI(title="ReadScope API")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "ReadScope backend is running"}