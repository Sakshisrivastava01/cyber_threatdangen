"""
DANGEN Mobile Scanner Microservice
Evaluates mobile application permission matrices and APK risk indicators.
"""
from typing import List, Dict, Any
from device_intelligence.risk_engine import analyze_mobile_risk as base_mobile_risk

def scan_mobile_posture(
    apps: List[str],
    permissions: List[str],
    unknown_sources: bool = False,
    suspicious_urls: List[str] = None,
) -> Dict[str, Any]:
    """Wrapper around the core risk engine for mobile posture evaluation."""
    return base_mobile_risk(
        apps=apps,
        permissions=permissions,
        unknown_sources=unknown_sources,
        suspicious_urls=suspicious_urls
    )
