import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter
from models.threat_models import AnalyticsResponse
import random

router = APIRouter()

@router.get("/risk-analysis", response_model=AnalyticsResponse)
async def get_risk_analysis():
    return AnalyticsResponse(
        total_active=random.randint(10, 50),
        total_blocked=random.randint(1000, 5000),
        confidence_score=random.randint(85, 99),
        top_vectors=[
            {"name": "SQLi", "count": 4000},
            {"name": "XSS", "count": 3000},
            {"name": "DDoS", "count": 2000},
        ]
    )

@router.get("/threats/geo")
async def get_geo_threats():
    return {
        "status": "success",
        "data": [
            {"lat": 37.7749, "lng": -122.4194, "weight": random.randint(1, 10)},
            {"lat": 51.5074, "lng": -0.1278, "weight": random.randint(1, 10)},
        ]
    }
