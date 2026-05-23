Category: Vulnerabilities

# Log4Shell Vulnerability

Log4Shell is a critical remote code execution vulnerability in Apache Log4j. Attackers exploit JNDI lookup behavior to execute arbitrary payloads when untrusted data is logged.

## Mitigation

- Upgrade Log4j to version 2.17.1 or higher.
- Set `log4j2.formatMsgNoLookups=true`.
- Apply network segmentation and logging validation.
- Use input sanitization and denylist dangerous payloads.
