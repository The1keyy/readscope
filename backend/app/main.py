from fastapi import FastAPI

from app.api.routes.analysis import router as analysis_router
from app.api.routes.auth import router as auth_router
from app.api.routes.sessions import router as sessions_router
from app.db.base import Base
from app.db.models import AnalysisResult, ReadingSession, User
from app.db.session import engine

app = FastAPI(title="ReadScope API")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "ReadScope backend is running"}


app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(analysis_router)