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

class ThreatFeatures(BaseModel):
    packet_rate: float = 50.0
    failed_logins: float = 1.0
    suspicious_reqs: float = 2.0
    traffic_spike: float = 0.05
    unusual_ports: float = 0.5
    geo_mismatch: float = 0.1

class AnomalyBatch(BaseModel):
    data_points: List[ThreatFeatures]

class IPRequest(BaseModel):
    ip: str
    open_ports: List[int] = []
    failed_logins: int = 0
    traffic_spike: float = 0.0

class URLRequest(BaseModel):
    url: str

class MobileRequest(BaseModel):
    apps: List[str] = []
    permissions: List[str] = []
    unknown_sources: bool = False
    suspicious_urls: List[str] = []

class IPIntelResponse(BaseModel):
    ip: str
    reputation: str
    malicious_score: int
    abuse_score: int
    open_ports: List[int]
    asn: Optional[str] = None
    country: Optional[str] = None
    confidence_score: int
    source_flags: Optional[dict] = None

class IPIntelResponse(BaseModel):
    ip: str
    reputation: str
    abuse_score: int
    open_ports: List[int]
    asn: Optional[str] = None
    country: Optional[str] = None
    threat_confidence: int
    source_flags: Optional[dict] = None
