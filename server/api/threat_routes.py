import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import APIRouter
from models.threat_models import AnalyticsResponse, IPIntelResponse
from threat_intel.intel_aggregator import ThreatIntelAggregator
import random

router = APIRouter()
intel_aggregator = ThreatIntelAggregator()

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
    ATTACK_TYPES = ["DDoS Flood", "SQL Injection", "Brute Force SSH",
                    "Port Scan", "Zero-Day Exploit", "Credential Stuffing",
                    "Ransomware Beacon", "Botnet C2", "XSS Injection", "Phishing"]
    return {
        "status": "success",
        "data": [
            {
                "id": "init-1",
                "lat": 37.7749, "lng": -122.4194, "weight": random.randint(5, 10),
                "ip": "185.220.101.45",
                "attack_type": random.choice(ATTACK_TYPES),
                "type": random.choice(ATTACK_TYPES),
                "severity": "critical",
                "confidence": 96,
                "country": "RU",
                "source_country": "RU",
                "target_country": "US",
                "source_ip": "185.220.101.45",
                "target_ip": "10.0.0.1",
                "packets_per_second": random.randint(40000, 85000),
                "threat_level": "CRITICAL",
                "asn": "AS12389 Rostelecom",
                "isp": "Rostelecom",
                "protocol": "TCP",
                "target_port": 445,
                "malware_family": "LockBit 3.0",
                "cve": "CVE-2023-38606",
                "threat_actor": "APT29 (Cozy Bear)",
                "timestamp": "12:00:00"
            },
            {
                "id": "init-2",
                "lat": 51.5074, "lng": -0.1278, "weight": random.randint(5, 10),
                "ip": "194.154.20.10",
                "attack_type": random.choice(ATTACK_TYPES),
                "type": random.choice(ATTACK_TYPES),
                "severity": "high",
                "confidence": 92,
                "country": "CN",
                "source_country": "CN",
                "target_country": "DE",
                "source_ip": "194.154.20.10",
                "target_ip": "10.0.5.12",
                "packets_per_second": random.randint(20000, 50000),
                "threat_level": "HIGH",
                "asn": "AS4134 Chinanet",
                "isp": "China Telecom",
                "protocol": "UDP",
                "target_port": 53,
                "malware_family": "Mirai Botnet",
                "cve": "CVE-2021-44228",
                "threat_actor": "Lazarus Group",
                "timestamp": "12:00:05"
            },
        ]
    }

@router.get("/threat-intel/ip/{ip}", response_model=IPIntelResponse)
async def get_ip_threat_intel(ip: str):
    return await intel_aggregator.get_ip_intel(ip)
