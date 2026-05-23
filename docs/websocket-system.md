# WebSocket System

DANGEN uses a dedicated WebSocket telemetry channel to drive live attack visualizations and threat waveform updates.

## Flow overview

1. The frontend connects to `/ws/neural-feed`.
2. `dangen_gateway.py` accepts WebSocket clients and registers them with `live_stream_manager.neural_stream`.
3. A continuous simulation loop emits enriched threat events each second.
4. The stream manager broadcasts JSON payloads to all active clients.

## WebSocket payload

Each event contains telemetry fields such as:
- `ip`, `attack_type`, `severity`, `confidence`
- `country`, `source_country`, `target_country`
- `asn`, `isp`, `protocol`, `target_port`
- `malware_family`, `cve`, `threat_actor`
- `packets_per_second`, `threat_level`, `timestamp`

## System resilience

- The backend uses a centralized connection manager for active WebSocket sessions.
- Broadcast failures are handled by disconnecting unhealthy sockets.
- Future improvements can add reconnect backoff, session heartbeats, and multi-tenant routing.
