# Backend Architecture

The `server/` directory is the core orchestrator for DANGEN's cyber defense platform.

## Key backend modules

- `dangen_gateway.py` — FastAPI entrypoint, CORS middleware, REST routers, and WebSocket feed.
- `api/threat_routes.py` — REST endpoints for risk analytics, geographic threat data, and core API operations.
- `live_threat_stream/live_stream_manager.py` — connection manager for active WebSocket clients and broadcast delivery.
- `ml_engine/threat_predictor.py` — ensemble ML threat scoring and anomaly detection using scikit-learn.
- `device_intelligence/risk_engine.py` — heuristic device and threat surface analysis for IP, URL, and mobile telemetry.
- `rag/rag_pipeline.py` — threat intelligence retrieval engine with optional LangChain / FAISS integration and a pure Python fallback.
- `models/threat_models.py` — shared Pydantic request/response models for strong API contracts.

## Backend design principles

- **Modular services** — clear directory separation between analytics, device intelligence, RAG, and streaming.
- **API-first** — typed Pydantic schemas standardize request and response payloads.
- **Runtime resilience** — the RAG pipeline initializes a fallback vector store when optional ML dependencies are unavailable.
- **Environment-managed deployment** — `.env.example` defines integration points for external intelligence providers.

## Production readiness

- Use `server/requirements.txt` for core dependencies and `server/Dockerfile` for containerized deployment.
- `dangen_gateway.py` exposes `/api/*` endpoints and `/ws/neural-feed` WebSocket telemetry.
- The backend is designed for horizontal scaling and can be migrated to Kubernetes or cloud-based service mesh architectures.
