import os
import logging
import httpx

logger = logging.getLogger(__name__)

class VirusTotalClient:
    def __init__(self):
        self.api_key = os.getenv("VT_API_KEY")
        self.base_url = "https://www.virustotal.com/api/v3"
        self.headers = {"x-apikey": self.api_key} if self.api_key else {}

    async def get_ip_reputation(self, ip: str) -> dict:
        if not self.api_key:
            logger.debug("VirusTotal API key missing; skipping VT lookup.")
            return {
                "source": "virustotal",
                "available": False,
                "reputation_score": None,
                "asn": None,
                "country": None,
                "malicious_count": 0,
                "suspicious_count": 0,
                "open_ports": [],
            }

        url = f"{self.base_url}/ip_addresses/{ip}"
        try:
            async with httpx.AsyncClient(timeout=15.0, headers=self.headers, follow_redirects=True) as client:
                response = await client.get(url)
                response.raise_for_status()
                payload = response.json()
        except Exception as exc:
            logger.warning("VirusTotal lookup failed for %s: %s", ip, exc)
            return {
                "source": "virustotal",
                "available": False,
                "reputation_score": None,
                "asn": None,
                "country": None,
                "malicious_count": 0,
                "suspicious_count": 0,
                "open_ports": [],
            }

        attributes = payload.get("data", {}).get("attributes", {})
        analysis_stats = attributes.get("last_analysis_stats", {})
        malicious = analysis_stats.get("malicious", 0)
        suspicious = analysis_stats.get("suspicious", 0)
        reputation_score = malicious * 10 + suspicious * 5

        return {
            "source": "virustotal",
            "available": True,
            "reputation_score": min(reputation_score, 100),
            "asn": attributes.get("asn"),
            "country": attributes.get("country"),
            "malicious_count": malicious,
            "suspicious_count": suspicious,
            "open_ports": [],
        }
