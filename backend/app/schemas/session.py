from pydantic import BaseModel


class ReadingSessionCreate(BaseModel):
    title: str
    language: str
    difficulty: str
    source_text: str
    transcript_text: str | None = None


class ReadingSessionRead(BaseModel):
    id: int
    user_id: int
    title: str
    language: str
    difficulty: str
    source_text: str
    transcript_text: str | None = None

    model_config = {"from_attributes": True}