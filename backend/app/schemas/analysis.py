from pydantic import BaseModel


class AnalysisRunResponse(BaseModel):
    session_id: int
    word_count: int
    accuracy_score: float
    fluency_score: float
    comprehension_score: float
    feedback_summary: str

    model_config = {"from_attributes": True}


class AnalysisRead(BaseModel):
    id: int
    session_id: int
    word_count: int
    accuracy_score: float
    fluency_score: float
    comprehension_score: float
    feedback_summary: str | None = None

    model_config = {"from_attributes": True}
    