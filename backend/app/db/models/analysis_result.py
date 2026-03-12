from sqlalchemy import ForeignKey, Float, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("reading_sessions.id"), nullable=False, unique=True)
    word_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    accuracy_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    fluency_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    comprehension_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    feedback_summary: Mapped[str | None] = mapped_column(Text, nullable=True)