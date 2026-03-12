from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ReadingSession(Base):
    __tablename__ = "reading_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    language: Mapped[str] = mapped_column(String(50), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)
    source_text: Mapped[str] = mapped_column(Text, nullable=False)
    transcript_text: Mapped[str | None] = mapped_column(Text, nullable=True)