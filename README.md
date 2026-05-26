# DANGEN AI Cyber Defense Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![WebSockets](https://img.shields.io/badge/WebSockets-0078D7?logo=websockets&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-orange?logo=huggingface&logoColor=white)](https://huggingface.co/)
[![LangChain](https://img.shields.io/badge/LangChain-000000?logo=langchain&logoColor=white)](https://langchain.com/)
[![FAISS](https://img.shields.io/badge/FAISS-002469?logo=facebook&logoColor=white)](https://github.com/facebookresearch/faiss)
[![ML](https://img.shields.io/badge/ML-Threat%20Analysis-blue)](https://scikit-learn.org/)

Enterprise-grade AI cybersecurity operations for modern threat detection, analysis, and response.

## Project Overview

DANGEN is a startup-quality AI cybersecurity platform built to demonstrate a production-ready architecture for threat intelligence and security operations.

The system combines:
- a React + Vite command center for visualization and interaction
- a FastAPI backend for API orchestration and analytics
- WebSocket-based real-time threat telemetry
- embedded ML threat analysis and anomaly detection
- a lightweight HuggingFace inference layer for security reasoning
- a LangChain-enabled RAG pipeline for contextual threat guidance
- FAISS-style semantic retrieval and vector search support

## Core Features

- **Real-time Threat Telemetry** — live attack feed powered by WebSockets
- **Threat Intelligence Engine** — cybersecurity query analysis and guided response
- **ML Threat Scoring** — predictive risk scoring and anomaly detection
- **RAG Security Guidance** — retrieval-augmented intelligence for incident context
- **Device Risk Analysis** — IP, URL, and mobile posture evaluation
- **Visualization Command Center** — enterprise dashboard with threat maps and timelines

## Architecture Summary

DANGEN is organized into two primary layers:

- **Frontend** (`client/`)
  - React + TypeScript command center
  - real-time telemetry dashboard
  - threat analytics and threat intelligence UI

- **Backend** (`server/`)
  - FastAPI gateway and route orchestration
  - ML threat engine, anomaly detection, and model registry
  - WebSocket feed manager for live data streams
  - HuggingFace inference service and RAG retrieval logic

The backend is designed for stable startup and incremental AI integration, with lightweight fallback behavior when models or external services are unavailable.

## API Endpoints

The platform exposes core API routes for threat analysis and intelligence interaction:

- `POST /api/intelligence/analyze`
  - Input: cybersecurity text/query
  - Output: intelligence response, confidence score, model availability

- `POST /api/intelligence/query`
  - RAG-enabled threat intelligence query with security knowledge retrieval

- `POST /api/intelligence/stream`
  - streaming response endpoint for threat intelligence output

- `POST /api/ml/predict`
  - ML threat scoring for structured telemetry inputs

- `POST /api/ml/anomaly`
  - anomaly detection for batch threat vectors

- `POST /api/device/analyze-ip`
  - IP posture and risk assessment

- `POST /api/device/analyze-url`
  - URL threat and phishing analysis

- `GET /api/health/ready`
  - readiness check for backend service health

- `GET /api/health/live`
  - liveness check for deployment monitoring

## Tech Stack

- FastAPI, Uvicorn — backend API and runtime
- React, Vite, Tailwind CSS — frontend experience and dashboard
- WebSockets — live threat feed and telemetry updates
- Transformers / HuggingFace — AI inference layer
- LangChain — RAG and conversational retrieval pipeline
- FAISS-style retrieval — semantic search for security context
- scikit-learn, joblib, numpy, pandas — ML threat analytics

## Setup Instructions

### Backend

```bash
cd server
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
uvicorn dangen_gateway:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd client
npm ci
npm run dev -- --host 0.0.0.0
```

### Docker

```bash
docker compose up --build
```

## Future Roadmap

- Harden ML threat analysis and anomaly classification
- Expand RAG threat intelligence with additional cybersecurity knowledge sources
- Improve WebSocket resiliency and session recovery
- Add persistent vector store support for FAISS-backed memory
- Enable enterprise SIEM integration and operational telemetry
- Implement secure auth and multi-tenant policy controls

## Documentation

Detailed system, API, and deployment documentation is available in the `docs/` folder.

This README is intentionally concise and focused on the platform's enterprise-grade AI cybersecurity value proposition, with minimal changes to the existing codebase and architecture.
