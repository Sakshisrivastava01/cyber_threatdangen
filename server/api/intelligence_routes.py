import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from inference_service import hf_inference_service
from services.intelligence_service import ThreatIntelligenceService

router = APIRouter()
service = ThreatIntelligenceService()

class HistoryEntry(BaseModel):
    user: str
    analyst: str

class ThreatIntelligenceRequest(BaseModel):
    query: str
    history: Optional[List[HistoryEntry]] = None

class ThreatIntelligenceResponse(BaseModel):
    response: str
    confidence: float
    sources: List[Dict[str, Any]]
    retrieved_context: List[Dict[str, Any]]

class HfAnalyzeRequest(BaseModel):
    query: str

class HfAnalyzeResponse(BaseModel):
    response: str
    confidence: float
    model: str
    available: bool

@router.post("/intelligence/query", response_model=ThreatIntelligenceResponse)
@router.post("/intelligence/v1/query", response_model=ThreatIntelligenceResponse)
async def intelligence_query(body: ThreatIntelligenceRequest):
    result = await service.get_response(body.query, history=[entry.model_dump() for entry in body.history] if body.history else [])
    return result

@router.post("/intelligence/stream")
async def intelligence_stream(body: ThreatIntelligenceRequest):
    async def event_stream():
        async for chunk in service.get_response_stream(body.query, history=[entry.model_dump() for entry in body.history] if body.history else []):
            yield chunk

    return StreamingResponse(event_stream(), media_type="application/json")

@router.post("/intelligence/analyze", response_model=HfAnalyzeResponse)
async def intelligence_analyze(body: HfAnalyzeRequest):
    return hf_inference_service.analyze_text(body.query)

@router.get("/intelligence/status")
async def intelligence_status():
    return {"status": "ok", "service": "DANGEN Threat Intelligence Engine", "rag_enabled": True}
