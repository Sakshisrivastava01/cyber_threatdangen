"""
DANGEN Gateway — Master FastAPI entrypoint
WebSocket live feed + REST endpoints for ML prediction and device intelligence.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio, random, json

from api.threat_routes import router as threat_router
from live_threat_stream.live_stream_manager import neural_stream
from ml_engine.threat_predictor import predict_threat, detect_anomalies
from device_intelligence.risk_engine import analyze_ip, analyze_url, analyze_mobile_risk

app = FastAPI(title="Dangen AI Cyber Defense Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(threat_router, prefix="/api")

# ─── Pydantic request models ─────────────────────────────────────────────────
class ThreatFeatures(BaseModel):
    packet_rate:      float = 50
    failed_logins:    float = 1
    suspicious_reqs:  float = 2
    traffic_spike:    float = 0.05
    unusual_ports:    float = 0.5
    geo_mismatch:     float = 0.1

class AnomalyBatch(BaseModel):
    data_points: List[ThreatFeatures]

class IPRequest(BaseModel):
    ip:            str
    open_ports:    List[int] = []
    failed_logins: int       = 0
    traffic_spike: float     = 0.0

class URLRequest(BaseModel):
    url: str

class MobileRequest(BaseModel):
    apps:            List[str] = []
    permissions:     List[str] = []
    unknown_sources: bool      = False
    suspicious_urls: List[str] = []


# ─── Health ──────────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "Dangen Neural Gateway Operational", "version": "4.0"}


# ─── ML Prediction Endpoints ─────────────────────────────────────────────────
@app.post("/api/ml/predict")
async def ml_predict(body: ThreatFeatures):
    result = predict_threat(body.model_dump())
    return result

@app.post("/api/ml/anomaly")
async def ml_anomaly(body: AnomalyBatch):
    points = [d.model_dump() for d in body.data_points]
    return detect_anomalies(points)


# ─── Device Intelligence Endpoints ───────────────────────────────────────────
@app.post("/api/device/analyze-ip")
async def device_analyze_ip(body: IPRequest):
    return analyze_ip(
        ip=body.ip,
        open_ports=body.open_ports,
        failed_logins=body.failed_logins,
        traffic_spike=body.traffic_spike,
    )

@app.post("/api/device/analyze-url")
async def device_analyze_url(body: URLRequest):
    return analyze_url(body.url)

@app.post("/api/device/mobile-risk")
async def device_mobile_risk(body: MobileRequest):
    return analyze_mobile_risk(
        apps=body.apps,
        permissions=body.permissions,
        unknown_sources=body.unknown_sources,
        suspicious_urls=body.suspicious_urls,
    )


# ─── Live WebSocket Feed ──────────────────────────────────────────────────────
ATTACK_TYPES = ["DDoS Flood", "SQL Injection", "Brute Force SSH",
                "Port Scan", "Zero-Day Exploit", "Credential Stuffing",
                "Ransomware Beacon", "Botnet C2", "XSS Injection", "Phishing"]

@app.websocket("/ws/neural-feed")
async def websocket_endpoint(websocket: WebSocket):
    await neural_stream.connect(websocket)
    try:
        while True:
            event = {
                "type": "threat_event",
                "data": {
                    "ip":          f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
                    "attack_type": random.choice(ATTACK_TYPES),
                    "severity":    random.choice(["low", "medium", "high", "critical"]),
                    "confidence":  random.randint(70, 99),
                    "country":     random.choice(["RU", "CN", "KP", "IR", "US", "DE", "BR", "IN"]),
                }
            }
            await neural_stream.broadcast(event)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        neural_stream.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("dangen_gateway:app", host="0.0.0.0", port=8000, reload=True)
