# API Documentation

The DANGEN backend exposes typed REST and WebSocket interfaces.

## Health

- `GET /`
  - Response: `{"status":"Dangen Neural Gateway Operational","version":"4.0"}`

## Threat analytics

- `GET /api/risk-analysis`
  - Response: `AnalyticsResponse`
  - Example fields: `total_active`, `total_blocked`, `confidence_score`, `top_vectors`

- `GET /api/threats/geo`
  - Response: geo threat payloads for initial map rendering

## Machine learning

- `POST /api/ml/predict`
  - Payload: `ThreatFeatures`
  - Response: ensemble threat score, severity, attack type, forecast curve, recommendations

- `POST /api/ml/anomaly`
  - Payload: `AnomalyBatch`
  - Response: anomaly result set with severity and scores

## Device intelligence

- `POST /api/device/analyze-ip`
  - Payload: `IPRequest`
  - Response: IP risk score, severity, health indicators, recommendations

- `POST /api/device/analyze-url`
  - Payload: `URLRequest`
  - Response: phishing/malware risk, severity, confidence, remediation advice

- `POST /api/device/mobile-risk`
  - Payload: `MobileRequest`
  - Response: mobile device posture score, severity, and risk recommendations

## WebSocket stream

- `ws://<host>:8000/ws/neural-feed`

### Event payload example

```json
{
  "type": "threat_event",
  "data": {
    "ip": "185.220.101.45",
    "attack_type": "DDoS Flood",
    "severity": "critical",
    "confidence": 96,
    "country": "RU",
    "source_country": "RU",
    "target_country": "US",
    "source_ip": "185.220.101.45",
    "target_ip": "10.0.0.1",
    "packets_per_second": 78000,
    "threat_level": "CRITICAL",
    "asn": "AS12389 Rostelecom",
    "isp": "Rostelecom",
    "protocol": "TCP",
    "target_port": 445,
    "malware_family": "LockBit 3.0",
    "cve": "CVE-2023-38606",
    "threat_actor": "APT29 (Cozy Bear)",
    "timestamp": 1234567890.123
  }
}
```

## API conventions

- Request/response contracts are defined by Pydantic models in `server/models/threat_models.py`.
- The backend router is mounted under `/api` in `server/dangen_gateway.py`.
