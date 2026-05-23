import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List

from ml_engine.anomaly_detector import AnomalyDetector
from ml_engine.malware_classifier import MalwareClassifier
from ml_engine.phishing_detector import PhishingDetector
from ml_engine.traffic_classifier import TrafficClassifier
from ml_engine.training_pipeline import TrainingPipeline

router = APIRouter()

_anomaly = AnomalyDetector()
_phishing = PhishingDetector()
_malware = MalwareClassifier()
_traffic = TrafficClassifier()
_pipeline = TrainingPipeline()


class FeatureRequest(BaseModel):
    packet_rate: float = 50.0
    failed_logins: float = 1.0
    suspicious_reqs: float = 2.0
    traffic_spike: float = 0.05
    unusual_ports: float = 0.5
    geo_mismatch: float = 0.1


class PhishingRequest(BaseModel):
    text: str


class MalwareRequest(BaseModel):
    suspicious_system_calls: float = 0.0
    network_beacons: float = 0.0
    persistence_indicators: float = 0.0
    code_obfuscation: float = 0.0
    credential_harvest: float = 0.0


@router.post("/ml/v2/train")
async def train_models():
    _pipeline.train_all()
    return {"status": "ok", "message": "ML models trained and saved to registry."}


@router.post("/ml/v2/anomaly")
async def detect_anomaly(body: FeatureRequest):
    return _anomaly.predict(body.model_dump())


@router.post("/ml/v2/phishing")
async def detect_phishing(body: PhishingRequest):
    return _phishing.predict(body.text)


@router.post("/ml/v2/malware")
async def classify_malware(body: MalwareRequest):
    return _malware.classify(body.model_dump())


@router.post("/ml/v2/traffic")
async def classify_traffic(body: FeatureRequest):
    return _traffic.classify(body.model_dump())


@router.get("/ml/v2/models")
async def list_models():
    return {"models": {
        "anomaly_detector": _anomaly.registry.get_model_info("anomaly_detector"),
        "phishing_detector": _phishing.registry.get_model_info("phishing_detector"),
        "malware_classifier": _malware.registry.get_model_info("malware_classifier"),
        "traffic_classifier": _traffic.registry.get_model_info("traffic_classifier"),
    }}
