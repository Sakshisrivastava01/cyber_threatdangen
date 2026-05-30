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
from api.intelligence_routes import router as intelligence_router
from api.ml_routes import router as ml_router
from api.auth_routes import router as auth_router
from live_threat_stream.live_stream_manager import neural_stream
from ml_engine.threat_predictor import predict_threat, detect_anomalies
from device_intelligence.risk_engine import analyze_ip, analyze_url, analyze_mobile_risk
from config.logging_config import configure_logging
from config.error_handlers import register_exception_handlers
from config.rate_limiter import RateLimitMiddleware

configure_logging()
app = FastAPI(title="Dangen AI Cyber Defense Gateway")

allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,https://cyberthreatdangen.vercel.app,https://dangen.vercel.app")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RateLimitMiddleware, max_requests=60, window_seconds=60)
register_exception_handlers(app)

app.include_router(threat_router, prefix="/api")
app.include_router(intelligence_router, prefix="/api")
app.include_router(ml_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

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

@app.get("/api/health/ready")
def readiness():
    return {"status": "ready", "version": "4.0", "services": ["api", "ml", "device_intelligence"]}

@app.get("/api/health/live")
def liveness():
    return {"status": "alive", "timestamp": asyncio.get_event_loop().time()}


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


# ─── Live WebSocket Feed ──────────────────────────────────────────────
ATTACK_TYPES = ["DDoS Flood", "SQL Injection", "Brute Force SSH",
                "Port Scan", "Zero-Day Exploit", "Credential Stuffing",
                "Ransomware Beacon", "Botnet C2", "XSS Injection", "Phishing"]

@app.websocket("/ws/neural-feed")
async def websocket_endpoint(websocket: WebSocket):
    await neural_stream.connect(websocket)
    try:
        ASNS = ["AS12389 Rostelecom", "AS4134 Chinanet", "AS174 Cogent", "AS3356 Lumen", "AS6830 Liberty Global", "AS2914 NTT", "AS1299 Arelion", "AS6453 TATA"]
        ISPS = ["Rostelecom", "China Telecom", "HostKey B.V.", "DigitalOcean", "Linode", "OVH SAS", "Hetzner Online", "Amazon Web Services", "Microsoft Azure"]
        PROTOCOLS = ["TCP", "UDP", "ICMP", "DNS", "HTTP/3", "SMB"]
        PORTS = [22, 443, 80, 445, 3389, 53, 8080, 23, 3306]
        MALWARE_FAMILIES = ["Mirai Botnet", "Cobalt Strike Beacon", "QakBot", "TrickBot", "LockBit 3.0", "BlackCat/ALPHV", "Pegasus", "Emotet", "AgentTesla"]
        CVES = ["CVE-2023-38606", "CVE-2024-3094", "CVE-2023-46805", "CVE-2021-44228", "CVE-2023-23397", "CVE-2022-26134", "CVE-2023-3519", "CVE-2023-4966"]
        ACTORS = ["APT29 (Cozy Bear)", "Lazarus Group", "Sandworm Team", "Wizard Spider", "APT36 (Transparent Tribe)", "Charming Kitten", "FIN7", "Scattered Spider"]

        while True:
            source_country = random.choice(["RU", "CN", "KP", "IR", "BY", "VN", "BR", "IN"])
            target_country = random.choice(["US", "DE", "UK", "FR", "JP", "AU", "CA"])
            source_ip = f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}"
            target_ip = f"10.{random.randint(0,2)}.{random.randint(0,50)}.{random.randint(1,250)}"
            severity = random.choice(["low", "medium", "high", "critical"])
            attack_type = random.choice(ATTACK_TYPES)
            pps = random.randint(15000, 85000)

            event = {
                "type": "threat_event",
                "data": {
                    "ip":          source_ip,
                    "attack_type": attack_type,
                    "severity":    severity,
                    "confidence":  random.randint(75, 99),
                    "country":     source_country,
                    "source_country": source_country,
                    "target_country": target_country,
                    "source_ip": source_ip,
                    "target_ip": target_ip,
                    "packets_per_second": pps,
                    "threat_level": severity.upper(),
                    "asn": random.choice(ASNS),
                    "isp": random.choice(ISPS),
                    "protocol": random.choice(PROTOCOLS),
                    "target_port": random.choice(PORTS),
                    "malware_family": random.choice(MALWARE_FAMILIES),
                    "cve": random.choice(CVES),
                    "threat_actor": random.choice(ACTORS),
                    "timestamp": asyncio.get_event_loop().time()
                }
            }
            await neural_stream.broadcast(event)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        neural_stream.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("dangen_gateway:app", host="0.0.0.0", port=8000, reload=True)
