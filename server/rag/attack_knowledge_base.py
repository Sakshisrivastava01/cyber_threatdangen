from typing import Dict, List


class AttackKnowledgeBase:
    def __init__(self):
        self.knowledge = [
            {
                "id": "atk-001",
                "title": "Credential Harvesting Campaign",
                "category": "Phishing",
                "summary": "High-volume credential harvesting using social engineering and forged portal pages.",
                "tags": ["phishing", "credential theft", "social engineering"],
                "mitigations": [
                    "Enforce MFA on corporate gateways",
                    "Deploy email authentication with DMARC",
                    "Use browser isolation for external links",
                ],
            },
            {
                "id": "atk-002",
                "title": "Ransomware Beacon Activity",
                "category": "Malware",
                "summary": "Detected persistent beaconing to known ransomware command-and-control domains.",
                "tags": ["ransomware", "C2", "beaconing"],
                "mitigations": [
                    "Segment endpoints from backup resources",
                    "Block C2 domains at DNS and proxy layers",
                    "Harden endpoint execution policies",
                ],
            },
            {
                "id": "atk-003",
                "title": "MITRE ATT&CK Reconnaissance Sequence",
                "category": "Reconnaissance",
                "summary": "Automated scanning and port probing preceding credential stuffing and exploitation.",
                "tags": ["scan", "recon", "port probe", "mitre"],
                "mitigations": [
                    "Apply ingress filtering and rate limiting",
                    "Monitor for unusual port scanning patterns",
                    "Implement deception to slow attacker reconnaissance",
                ],
            },
        ]

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, str]]:
        query_text = query.lower()
        results = []
        for entry in self.knowledge:
            score = 0
            if any(tag in query_text for tag in entry["tags"]):
                score += 1
            if entry["category"].lower() in query_text:
                score += 1
            if any(word in query_text for word in entry["summary"].lower().split()):
                score += 0.5
            if score > 0:
                results.append({**entry, "relevance": score})
        return sorted(results, key=lambda item: item["relevance"], reverse=True)[:top_k]
