"""
DANGEN Threat Feed Service
Coordinates event generation, caching, and database/SIEM logging preparation.
"""
from threat_simulator.attack_generator import attack_generator
from typing import Dict, Any

class ThreatFeedService:
    @staticmethod
    def fetch_latest_event() -> Dict[str, Any]:
        return attack_generator.generate_event()

threat_feed_service = ThreatFeedService()
