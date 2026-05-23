Category: Web Security

# SSRF Attack and Mitigation

Server-Side Request Forgery (SSRF) occurs when an application fetches remote resources using attacker-controlled input. Common targets include internal metadata services and management endpoints.

## Mitigation

- Validate and restrict outbound destinations using allowlists.
- Disable redirects for untrusted requests.
- Enforce strict URL whitelisting and sandboxing.
- Monitor internal access patterns for unusual requests.
