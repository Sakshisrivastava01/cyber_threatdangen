import ipaddress
import asyncio
import logging
from typing import Any, Dict, List, Optional

from .vt_client import VirusTotalClient
from .abuseipdb_client import AbuseIPDBClient
from .shodan_client import ShodanClient

logger = logging.getLogger(__name__)

class ThreatIntelAggregator:
    def __init__(self):
        self.vt = VirusTotalClient()
        self.abuse = AbuseIPDBClient()
        self.shodan = ShodanClient()

    @staticmethod
    def normalize_score(value: Optional[float], default: float = 0.0) -> float:
        if value is None:
            return default
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    @staticmethod
    def build_reputation(abuse_score: float, vt_score: Optional[float], open_ports: List[int]) -> str:
        port_factor = min(len(open_ports) * 4, 30)
        vt_factor = min(vt_score or 0, 100)
        abuse_factor = min(abuse_score, 100)
        aggregate = (abuse_factor * 0.45) + (vt_factor * 0.35) + (port_factor * 0.20)

        if aggregate >= 80:
            return "malicious"
        if aggregate >= 50:
            return "suspicious"
        if aggregate >= 20:
            return "unverified"
        return "benign"

    @staticmethod
    def build_confidence(abuse_score: float, vt_score: Optional[float], open_ports: List[int]) -> int:
        base = (abuse_score * 0.4) + ((vt_score or 0) * 0.4) + (min(len(open_ports) * 4, 40) * 0.5)
        confidence = min(max(int(base / 1.4), 1), 100)
        return confidence

    async def get_ip_intel(self, ip: str) -> Dict[str, Any]:
        try:
            ipaddress.ip_address(ip)
        except ValueError:
            logger.warning("Invalid IP address requested: %s", ip)
            return {
                "ip": ip,
                "reputation": "invalid",
                "malicious_score": 0,
                "abuse_score": 0,
                "open_ports": [],
                "asn": None,
                "country": None,
                "confidence_score": 0,
                "note": "invalid_ip",
            }

        tasks = [
            self.vt.get_ip_reputation(ip),
            self.abuse.lookup_ip(ip),
            self.shodan.lookup_ip(ip),
        ]

        vt_result, abuse_result, shodan_result = await asyncio.gather(*tasks, return_exceptions=False)

        open_ports = shodan_result.get("open_ports") or []
        abuse_score = self.normalize_score(abuse_result.get("abuse_score"), 0.0)
        vt_score = self.normalize_score(vt_result.get("reputation_score"), 0.0)

        asn = shodan_result.get("asn") or abuse_result.get("asn") or vt_result.get("asn")
        country = shodan_result.get("country") or abuse_result.get("country") or vt_result.get("country")

        reputation = self.build_reputation(abuse_score=abuse_score, vt_score=vt_score, open_ports=open_ports)
        confidence_score = self.build_confidence(abuse_score=abuse_score, vt_score=vt_score, open_ports=open_ports)
        malicious_score = int(max(vt_score, abuse_score))

        if not any([vt_result.get("available"), abuse_result.get("available"), shodan_result.get("available")]):
            logger.warning("All threat intel providers unavailable for %s; returning fallback response.", ip)
        else:
            logger.debug(
                "Threat intel provider availability for %s: VT=%s AbuseIPDB=%s Shodan=%s",
                ip,
                vt_result.get("available"),
                abuse_result.get("available"),
                shodan_result.get("available"),
            )

        return {
            "ip": ip,
            "reputation": reputation,
            "malicious_score": malicious_score,
            "abuse_score": int(abuse_score),
            "open_ports": open_ports,
            "asn": asn,
            "country": country,
            "confidence_score": confidence_score,
            "source_flags": {
                "virustotal_available": bool(vt_result.get("available")),
                "abuseipdb_available": bool(abuse_result.get("available")),
                "shodan_available": bool(shodan_result.get("available")),
            },
        }
