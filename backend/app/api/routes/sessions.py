from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.db.models.reading_session import ReadingSession
from app.db.models.user import User
from app.schemas.session import ReadingSessionCreate, ReadingSessionRead

router = APIRouter(prefix="/sessions", tags=["Reading Sessions"])


@router.post("/", response_model=ReadingSessionRead, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: ReadingSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ReadingSession(
        user_id=current_user.id,
        title=payload.title,
        language=payload.language,
        difficulty=payload.difficulty,
        source_text=payload.source_text,
        transcript_text=payload.transcript_text,
    )

    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/", response_model=list[ReadingSessionRead])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = (
        db.query(ReadingSession)
        .filter(ReadingSession.user_id == current_user.id)
        .order_by(ReadingSession.id.desc())
        .all()
    )
    return sessions


@router.get("/{session_id}", response_model=ReadingSessionRead)
def get_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ReadingSession)
        .filter(
            ReadingSession.id == session_id,
            ReadingSession.user_id == current_user.id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading session not found",
        )

    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ReadingSession)
        .filter(
            ReadingSession.id == session_id,
            ReadingSession.user_id == current_user.id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reading session not found",
        )

    db.delete(session)
    db.commit()