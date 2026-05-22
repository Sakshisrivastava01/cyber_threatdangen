import os
import logging
import httpx

logger = logging.getLogger(__name__)

class ShodanClient:
    def __init__(self):
        self.api_key = os.getenv("SHODAN_API_KEY")
        self.base_url = "https://api.shodan.io/shodan/host"

    async def lookup_ip(self, ip: str) -> dict:
        if not self.api_key:
            logger.debug("Shodan API key missing; skipping Shodan lookup.")
            return {
                "source": "shodan",
                "available": False,
                "asn": None,
                "country": None,
                "open_ports": [],
            }

        url = f"{self.base_url}/{ip}"
        params = {"key": self.api_key, "minify": "true"}
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                payload = response.json()
        except Exception as exc:
            logger.warning("Shodan lookup failed for %s: %s", ip, exc)
            return {
                "source": "shodan",
                "available": False,
                "asn": None,
                "country": None,
                "open_ports": [],
            }

        return {
            "source": "shodan",
            "available": True,
            "asn": payload.get("asn"),
            "country": payload.get("country_code"),
            "open_ports": payload.get("ports", []),
        }
