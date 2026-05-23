"""
DANGEN Autonomous Attack Generator Simulator
Generates synthetic cyber warfare vectors across global nodes for WebSocket streaming.
"""
import random
from typing import Dict, Any

ATTACK_TYPES = [
    "DDoS Flood", "SQL Injection", "Brute Force SSH",
    "Port Scan", "Zero-Day Exploit", "Credential Stuffing",
    "Ransomware Beacon", "Botnet C2", "XSS Injection", "Phishing"
]

COUNTRIES = ["RU", "CN", "KP", "IR", "US", "DE", "BR", "IN", "VN", "UA"]

class AttackGenerator:
    @staticmethod
    def generate_event() -> Dict[str, Any]:
        """Generates a single realistic threat telemetry event."""
        return {
            "ip": f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
            "attack_type": random.choice(ATTACK_TYPES),
            "severity": random.choice(["low", "medium", "high", "critical"]),
            "confidence": random.randint(70, 99),
            "country": random.choice(COUNTRIES),
        }

attack_generator = AttackGenerator()
