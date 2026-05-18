from pydantic import BaseModel
from typing import List, Optional

class ThreatEvent(BaseModel):
    ip: str
    attack_type: str
    severity: str
    confidence: int

class AnalyticsResponse(BaseModel):
    total_active: int
    total_blocked: int
    confidence_score: int
    top_vectors: List[dict]
