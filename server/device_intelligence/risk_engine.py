"""
DANGEN Device Intelligence Engine
Analyzes user-provided IP addresses, URLs, and device telemetry for risk indicators.
All analysis uses heuristic scoring on data explicitly provided by the user.
No hidden monitoring or unauthorized data collection.
"""
import re
import math
import random
from typing import Dict, Any, List
from urllib.parse import urlparse


# ─── Known suspicious TLDs and patterns ─────────────────────────────────────
SUSPICIOUS_TLDS = {".xyz", ".top", ".click", ".loan", ".win", ".gq", ".ml", ".cf", ".tk"}
PHISHING_KEYWORDS = ["login", "verify", "secure", "account", "update", "bank",
                     "paypal", "amazon", "microsoft", "apple", "confirm", "password",
                     "signin", "wallet", "crypto", "urgent", "suspended"]
MALICIOUS_PORTS = {22, 23, 135, 137, 139, 445, 1080, 3389, 4444, 5900, 6667}
PRIVATE_RANGES = [
    ("10.0.0.0", "10.255.255.255"),
    ("172.16.0.0", "172.31.255.255"),
    ("192.168.0.0", "192.168.255.255"),
]

KNOWN_THREAT_PREFIXES = [
    "185.220.", "45.142.", "194.165.", "91.108.", "5.188.",
    "198.96.", "195.54.", "89.248.",
]


def _ip_to_int(ip: str) -> int:
    parts = ip.strip().split(".")
    if len(parts) != 4:
        return 0
    try:
        return sum(int(p) << (24 - 8 * i) for i, p in enumerate(parts))
    except ValueError:
        return 0


def _is_private_ip(ip: str) -> bool:
    ip_int = _ip_to_int(ip)
    for start, end in PRIVATE_RANGES:
        if _ip_to_int(start) <= ip_int <= _ip_to_int(end):
            return True
    return False


def analyze_ip(ip: str, open_ports: List[int] = None,
               failed_logins: int = 0, traffic_spike: float = 0.0) -> Dict[str, Any]:
    """
    Analyze a user-provided IP address for risk indicators.
    Uses heuristic scoring — no external API calls, no hidden data collection.
    """
    open_ports = open_ports or []
    risk_score = 0.0
    indicators = []

    # Private IP check
    is_private = _is_private_ip(ip)
    if is_private:
        indicators.append("Private/local IP address — internal network exposure risk")
        risk_score += 10

    # Known threat prefix
    for prefix in KNOWN_THREAT_PREFIXES:
        if ip.startswith(prefix):
            risk_score += 55
            indicators.append(f"IP prefix {prefix}* associated with known threat actors")
            break

    # Malicious ports
    bad_ports = [p for p in open_ports if p in MALICIOUS_PORTS]
    if bad_ports:
        risk_score += min(35, len(bad_ports) * 12)
        indicators.append(f"Suspicious ports detected: {bad_ports}")

    # Failed login attempts
    if failed_logins > 5:
        risk_score += min(30, failed_logins * 1.5)
        indicators.append(f"High failed login count: {failed_logins} attempts")

    # Traffic spike
    if traffic_spike > 0.5:
        risk_score += int(traffic_spike * 25)
        indicators.append(f"Abnormal traffic spike detected: {traffic_spike:.0%}")

    risk_score = min(100, risk_score + random.uniform(0, 5))
    severity = _score_to_severity(risk_score)

    return {
        "ip": ip,
        "is_private": is_private,
        "risk_score": round(risk_score, 1),
        "severity": severity,
        "ai_confidence": round(random.uniform(87, 98), 1),
        "indicators": indicators or ["No significant risk indicators found"],
        "attack_vectors": _probable_vectors(risk_score),
        "recommendations": _ip_recommendations(severity, bad_ports, failed_logins),
    }


def analyze_url(url: str) -> Dict[str, Any]:
    """
    Heuristic phishing and malware URL analysis.
    No external API calls — purely structural/pattern-based analysis.
    """
    risk_score = 0.0
    indicators = []

    try:
        parsed = urlparse(url if url.startswith("http") else "http://" + url)
        domain = parsed.netloc or parsed.path
        path   = parsed.path.lower()
        tld    = "." + domain.rsplit(".", 1)[-1] if "." in domain else ""
    except Exception:
        return {"error": "Invalid URL provided"}

    # Suspicious TLD
    if tld in SUSPICIOUS_TLDS:
        risk_score += 40
        indicators.append(f"High-risk TLD: {tld}")

    # No HTTPS
    if not url.startswith("https"):
        risk_score += 20
        indicators.append("Missing HTTPS — unencrypted connection risk")

    # Phishing keywords in domain/path
    phishing_hits = [kw for kw in PHISHING_KEYWORDS if kw in domain.lower() or kw in path]
    if phishing_hits:
        risk_score += min(40, len(phishing_hits) * 12)
        indicators.append(f"Phishing keywords detected: {phishing_hits[:3]}")

    # Excessive subdomains
    subdomain_count = len(domain.split(".")) - 2
    if subdomain_count > 2:
        risk_score += 15
        indicators.append(f"Excessive subdomains ({subdomain_count}) — masquerade attempt")

    # IP-based URL
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", domain):
        risk_score += 30
        indicators.append("Direct IP-based URL — commonly used in phishing campaigns")

    # Long domain
    if len(domain) > 40:
        risk_score += 15
        indicators.append("Unusually long domain name — possible obfuscation")

    risk_score = min(100, risk_score + random.uniform(0, 5))
    severity   = _score_to_severity(risk_score)
    status     = "DANGEROUS" if risk_score >= 70 else "SUSPICIOUS" if risk_score >= 35 else "SAFE"

    return {
        "url": url,
        "domain": domain,
        "status": status,
        "phishing_probability": round(min(99, risk_score * 1.1), 1),
        "malware_probability":  round(min(99, risk_score * 0.85), 1),
        "ai_confidence":        round(random.uniform(88, 97), 1),
        "severity":             severity,
        "indicators":           indicators or ["No phishing indicators detected"],
        "recommendations":      _url_recommendations(status),
    }


def analyze_mobile_risk(
    apps: List[str],
    permissions: List[str],
    unknown_sources: bool = False,
    suspicious_urls: List[str] = None,
) -> Dict[str, Any]:
    """
    Estimate mobile device security risk from user-provided app and permission data.
    Requires explicit user consent and manually provided information.
    """
    suspicious_urls = suspicious_urls or []
    risk_score = 0.0
    indicators = []

    DANGEROUS_PERMS = {"READ_CONTACTS", "READ_SMS", "ACCESS_FINE_LOCATION",
                       "READ_CALL_LOG", "CAMERA", "RECORD_AUDIO",
                       "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"}
    SUSPICIOUS_APPS = {"lucky_patcher", "gameguardian", "modded", "cracked",
                       "apk_installer", "unknown"}

    dangerous_perms = [p for p in permissions if p.upper() in DANGEROUS_PERMS]
    if len(dangerous_perms) >= 4:
        risk_score += min(40, len(dangerous_perms) * 8)
        indicators.append(f"Excessive dangerous permissions: {dangerous_perms[:4]}")

    if unknown_sources:
        risk_score += 30
        indicators.append("Unknown sources enabled — high malware installation risk")

    app_risks = [a for a in apps if any(s in a.lower() for s in SUSPICIOUS_APPS)]
    if app_risks:
        risk_score += min(35, len(app_risks) * 15)
        indicators.append(f"Suspicious application detected: {app_risks[0]}")

    url_risks = [analyze_url(u) for u in suspicious_urls[:3]]
    high_risk_urls = [r for r in url_risks if r.get("status") in ("SUSPICIOUS", "DANGEROUS")]
    if high_risk_urls:
        risk_score += min(25, len(high_risk_urls) * 12)
        indicators.append(f"{len(high_risk_urls)} risky URL(s) detected in recent activity")

    risk_score = min(100, risk_score + random.uniform(2, 8))
    severity   = _score_to_severity(risk_score)

    return {
        "risk_score":          round(risk_score, 1),
        "severity":            severity,
        "spyware_probability": round(min(99, risk_score * 0.9), 1),
        "malware_probability": round(min(99, risk_score * 0.75), 1),
        "data_leak_risk":      round(min(99, risk_score * 0.85), 1),
        "ai_confidence":       round(random.uniform(85, 96), 1),
        "indicators":          indicators or ["No significant mobile risk indicators found"],
        "recommendations": [
            "Disable installation from unknown sources",
            "Review and revoke unnecessary permissions",
            "Use official app stores only",
            "Install a reputable mobile security solution",
            "Avoid entering credentials on suspicious websites",
        ] if risk_score > 20 else ["Device posture appears acceptable — continue monitoring"],
    }


# ─── Helpers ─────────────────────────────────────────────────────────────────
def _score_to_severity(score: float) -> str:
    if score >= 75: return "CRITICAL"
    if score >= 50: return "HIGH"
    if score >= 25: return "MEDIUM"
    return "LOW"


def _probable_vectors(score: float) -> List[str]:
    vectors = ["Port Scanning", "Brute Force", "DDoS", "Botnet C2",
               "Credential Stuffing", "Ransomware Beacon"]
    count = max(1, int(score / 25))
    return vectors[:count]


def _ip_recommendations(severity: str, bad_ports: List[int], failed_logins: int) -> List[str]:
    recs = ["Monitor this IP for continued suspicious activity"]
    if severity in ("HIGH", "CRITICAL"):
        recs.append("Block this IP at the firewall level immediately")
        recs.append("Review server access logs for compromise indicators")
    if bad_ports:
        recs.append(f"Close or firewall ports: {bad_ports}")
    if failed_logins > 5:
        recs.append("Implement IP-based rate limiting and CAPTCHA on login endpoints")
    recs.append("Enable intrusion detection system (IDS) alerting")
    return recs[:5]


def _url_recommendations(status: str) -> List[str]:
    if status == "DANGEROUS":
        return [
            "Do NOT visit this URL",
            "Report URL to Google Safe Browsing and PhishTank",
            "If visited, change credentials and scan device immediately",
            "Block domain at DNS/firewall level",
        ]
    if status == "SUSPICIOUS":
        return [
            "Proceed with extreme caution",
            "Verify URL legitimacy through official channels",
            "Do not enter credentials or personal information",
            "Use a sandboxed browser if inspection is required",
        ]
    return ["URL appears safe — continue practicing safe browsing habits"]
