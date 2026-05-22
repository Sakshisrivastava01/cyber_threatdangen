"""
DANGEN Geo-Location Microservice
Maps IP addresses and country codes to latitude/longitude coordinates for 3D Cyber Globe rendering.
"""
import random
from typing import Dict, Any, List

COUNTRY_COORDS = {
    "US": {"lat": 37.7749, "lng": -122.4194, "name": "United States"},
    "CN": {"lat": 35.8617, "lng": 104.1954, "name": "China"},
    "RU": {"lat": 61.5240, "lng": 105.3188, "name": "Russia"},
    "KP": {"lat": 40.3399, "lng": 127.5101, "name": "North Korea"},
    "IR": {"lat": 32.4279, "lng": 53.6880, "name": "Iran"},
    "DE": {"lat": 51.1657, "lng": 10.4515, "name": "Germany"},
    "BR": {"lat": -14.2350, "lng": -51.9253, "name": "Brazil"},
    "IN": {"lat": 20.5937, "lng": 78.9629, "name": "India"},
    "VN": {"lat": 14.0583, "lng": 108.2772, "name": "Vietnam"},
    "UA": {"lat": 48.3794, "lng": 31.1656, "name": "Ukraine"},
}

class GeoLocatorService:
    @staticmethod
    def get_coords_for_country(country_code: str) -> Dict[str, Any]:
        return COUNTRY_COORDS.get(country_code, COUNTRY_COORDS["US"])

    @staticmethod
    def get_active_threat_nodes() -> List[Dict[str, Any]]:
        """Returns a list of active threat coordinates with weights."""
        nodes = []
        for code, info in COUNTRY_COORDS.items():
            nodes.append({
                "country": code,
                "name": info["name"],
                "lat": info["lat"],
                "lng": info["lng"],
                "weight": random.randint(1, 100)
            })
        return nodes

geo_locator = GeoLocatorService()
