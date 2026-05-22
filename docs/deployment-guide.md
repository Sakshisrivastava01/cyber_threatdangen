# Deployment Guide

This repository includes a production-ready deployment path using Docker Compose and GitHub Actions.

## Local Docker deployment

```bash
docker compose up --build
```

- Frontend available at: `http://localhost:4173`
- Backend available at: `http://localhost:8000`

## Service definitions

- `dangen-backend` — Python FastAPI backend and WebSocket gateway
- `dangen-frontend` — Vite-built React UI preview server

## Environment variables

Use `.env.example` to populate secrets and service URLs before production deployment.

### Recommended values
- `HUGGINGFACE_API_KEY` — optional for LLMS / embeddings
- `VIRUSTOTAL_API_KEY` — optional threat intelligence enrichment
- `SHODAN_API_KEY` — optional external scanning integration
- `ABUSEIPDB_API_KEY` — optional risk scoring updates
- `REDIS_URL` — optional caching and session store
- `POSTGRES_URL` — optional telemetry or vector storage

## GitHub Actions readiness

This repository ships with CI pipelines that validate:
- frontend build and TypeScript compilation
- backend dependency install and Python syntax
- Docker Compose configuration and image build

The CI files are available under `.github/workflows/`.
