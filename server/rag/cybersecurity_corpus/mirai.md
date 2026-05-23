Category: Malware Analysis

# Mirai Botnet

Mirai targets Internet-facing IoT devices by scanning for open Telnet and SSH ports. It brute-forces factory credentials and enrolls devices into distributed denial-of-service botnets.

## Mitigation

- Disable unnecessary Telnet and SSH access.
- Enforce strong credentials and unique passwords.
- Isolate IoT devices on segmented network zones.
- Monitor for anomalous outbound traffic.
