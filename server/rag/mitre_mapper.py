from typing import Dict, List


class MitreMapper:
    TECHNIQUE_MAP = {
        "phishing": ["T1566"],
        "credential stuffing": ["T1110"],
        "ransomware": ["T1486"],
        "malware": ["T1059", "T1566"],
        "command and control": ["T1071", "T1105"],
        "scan": ["T1595"],
        "docker": ["T1610"],
        "sql injection": ["T1505"],
        "xss": ["T1059"],
        "phishing campaign": ["T1566"],
        "reconnaissance": ["T1595"],
    }

    def map_query(self, query: str) -> List[Dict[str, str]]:
        normalized = query.lower()
        mapped = []
        for key, techniques in self.TECHNIQUE_MAP.items():
            if key in normalized:
                for technique in techniques:
                    mapped.append({
                        "technique": key,
                        "mitre_id": technique,
                        "description": f"MITRE ATT&CK technique {technique} matched from query phrase '{key}'.",
                    })
        if not mapped:
            return [{"technique": "unknown", "mitre_id": "T0000", "description": "No direct MITRE mapping found. Use context retrieval for similar techniques."}]
        return mapped
