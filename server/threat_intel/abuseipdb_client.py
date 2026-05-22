import os
import logging
import httpx

logger = logging.getLogger(__name__)

class AbuseIPDBClient:
    def __init__(self):
        self.api_key = os.getenv("ABUSEIPDB_API_KEY")
        self.base_url = "https://api.abuseipdb.com/api/v2"
        self.headers = {
            "Accept": "application/json",
            "Key": self.api_key,
        } if self.api_key else {}

    async def lookup_ip(self, ip: str) -> dict:
        if not self.api_key:
            logger.debug("AbuseIPDB API key missing; skipping AbuseIPDB lookup.")
            return {
                "source": "abuseipdb",
                "available": False,
                "abuse_score": 0,
                "country": None,
                "asn": None,
                "open_ports": [],
            }

        url = f"{self.base_url}/check"
        params = {"ipAddress": ip, "verbose": "true"}
        try:
            async with httpx.AsyncClient(timeout=15.0, headers=self.headers) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                payload = response.json()
        except Exception as exc:
            logger.warning("AbuseIPDB lookup failed for %s: %s", ip, exc)
            return {
                "source": "abuseipdb",
                "available": False,
                "abuse_score": 0,
                "country": None,
                "asn": None,
                "open_ports": [],
            }

        data = payload.get("data", {})
        return {
            "source": "abuseipdb",
            "available": True,
            "abuse_score": data.get("abuseConfidenceScore", 0),
            "country": data.get("countryCode"),
            "asn": data.get("asn") or data.get("isp"),
            "open_ports": [],
        }
