from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.db.models.analysis_result import AnalysisResult
from app.db.models.reading_session import ReadingSession
from app.db.models.user import User
from app.schemas.analysis import AnalysisRead, AnalysisRunResponse
from app.services.analysis_service import analyze_reading

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/run/{session_id}", response_model=AnalysisRunResponse)
def run_analysis(
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

    if not session.transcript_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session must include transcript_text before analysis can run",
        )

    result_data = analyze_reading(
        expected_text=session.source_text,
        spoken_text=session.transcript_text,
    )

    existing_result = (
        db.query(AnalysisResult)
        .filter(AnalysisResult.session_id == session.id)
        .first()
    )

    if existing_result:
        existing_result.word_count = result_data["word_count"]
        existing_result.accuracy_score = result_data["accuracy_score"]
        existing_result.fluency_score = result_data["fluency_score"]
        existing_result.comprehension_score = result_data["comprehension_score"]
        existing_result.feedback_summary = result_data["feedback_summary"]
        db.commit()
        db.refresh(existing_result)

        return AnalysisRunResponse(
            session_id=session.id,
            word_count=existing_result.word_count,
            accuracy_score=existing_result.accuracy_score,
            fluency_score=existing_result.fluency_score,
            comprehension_score=existing_result.comprehension_score,
            feedback_summary=existing_result.feedback_summary or "",
        )

    analysis_result = AnalysisResult(
        session_id=session.id,
        word_count=result_data["word_count"],
        accuracy_score=result_data["accuracy_score"],
        fluency_score=result_data["fluency_score"],
        comprehension_score=result_data["comprehension_score"],
        feedback_summary=result_data["feedback_summary"],
    )

    db.add(analysis_result)
    db.commit()
    db.refresh(analysis_result)

    return AnalysisRunResponse(
        session_id=session.id,
        word_count=analysis_result.word_count,
        accuracy_score=analysis_result.accuracy_score,
        fluency_score=analysis_result.fluency_score,
        comprehension_score=analysis_result.comprehension_score,
        feedback_summary=analysis_result.feedback_summary or "",
    )


@router.get("/{session_id}", response_model=AnalysisRead)
def get_analysis(
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

    analysis_result = (
        db.query(AnalysisResult)
        .filter(AnalysisResult.session_id == session.id)
        .first()
    )

    if not analysis_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis result not found for this session",
        )

    return analysis_result
