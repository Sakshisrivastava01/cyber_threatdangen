import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from inference_service import hf_inference_service
from services.copilot_service import CopilotService

router = APIRouter()
service = CopilotService()

class HistoryEntry(BaseModel):
    user: str
    assistant: str

class CopilotRequest(BaseModel):
    query: str
    history: Optional[List[HistoryEntry]] = None

class CopilotResponse(BaseModel):
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

@router.post("/copilot/chat", response_model=CopilotResponse)
@router.post("/copilot/v1/chat", response_model=CopilotResponse)
async def copilot_chat(body: CopilotRequest):
    result = await service.get_response(body.query, history=[entry.model_dump() for entry in body.history] if body.history else [])
    return result

@router.post("/copilot/stream")
async def copilot_stream(body: CopilotRequest):
    async def event_stream():
        async for chunk in service.get_response_stream(body.query, history=[entry.model_dump() for entry in body.history] if body.history else []):
            yield chunk

    return StreamingResponse(event_stream(), media_type="application/json")

@router.post("/copilot/analyze", response_model=HfAnalyzeResponse)
async def copilot_analyze(body: HfAnalyzeRequest):
    return hf_inference_service.analyze_text(body.query)

@router.get("/copilot/status")
async def copilot_status():
    return {"status": "ok", "service": "DANGEN AI Copilot", "rag_enabled": True}
