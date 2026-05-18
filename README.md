# DANGEN AI CYBER DEFENSE 🛡️

**Enterprise AI Cyber Defense Platform | Real-Time Threat Intelligence System**

![Dangen Neural OS](https://via.placeholder.com/1200x500/0B1020/00E5FF?text=INITIALIZING+DANGEN+CORE...)

Dangen is an autonomous AI security monitoring platform developed from the ground up for modern enterprise infrastructure. It replaces outdated static dashboards with a live, futuristic Neural Intrusion Matrix, providing unparalleled visibility into darknet signals, zero-day exploits, and real-time network anomalies.

---

## ⚡ Core Capabilities

- **Neural Intrusion Matrix:** Proprietary AI actively monitors and scores network confidence, instantly flagging anomalies.
- **Quantum Shield Status:** A live metric dashboard displaying actively blocked vectors and real-time defensive posture.
- **GeoPulse Radar:** Scans global attack vectors, visualizing threat origins via a glowing HTML5 Canvas node network.
- **Adaptive Risk Intelligence:** Dynamic data visualization utilizing Recharts to map out the severity and frequency of ongoing attacks (SQLi, XSS, DDoS).
- **Live Threat Evolution Timeline:** A constant, websocket-powered stream of raw telemetry data, categorizing events by critical severity.

---

## 🏗 System Architecture

Dangen is built on a highly modular, scalable stack designed for immediate cloud deployment.

### **Frontend (DangenCore)**
- **Framework:** React 18 + TypeScript + Vite
- **State Management:** Zustand (`useDangenTelemetry` hook) for zero-latency UI updates.
- **Motion & UI:** Framer Motion for holographic transitions, Tailwind CSS for the deep neon glassmorphism aesthetic.
- **Data Vis:** Recharts & native Canvas APIs.

### **Backend (Neural Gateway)**
- **Framework:** Python FastAPI
- **Real-Time:** WebSockets (`live_stream_manager.py`) streaming simulated neural telemetry.
- **Validation:** Pydantic (`threat_models.py`).

---

## 🚀 Deployment Guide

### Vercel (Frontend)
1. Link your repository to Vercel.
2. Set the Root Directory to `client/`.
3. Framework Preset: **Vite**.
4. Deploy!

### Render / Railway (Backend API)
1. Create a new Web Service pointing to the `server/` directory.
2. **Build Command:** `pip install -r requirements.txt`
3. **Start Command:** `uvicorn dangen_gateway:app --host 0.0.0.0 --port $PORT`

---

## 🛠 Local Initialization Sequence

Boot up the Dangen Core locally to experience the live telemetry simulation.

**1. Initialize Neural Gateway (Backend)**
```bash
cd server
pip install -r requirements.txt
python dangen_gateway.py
```

**2. Boot Dangen OS (Frontend)**
```bash
cd client
npm install
npm run dev
```

*Access the command center at `http://localhost:5173`.*

---

## 🔮 Scalability Roadmap

- [ ] **v4.1:** Integrate physical SIEM log ingestion (Splunk, Datadog).
- [ ] **v4.5:** Deploy the `dangen_ai_engine` with active PyTorch mitigation models.
- [ ] **v5.0:** Autonomous drone-node defense capabilities.

---
*© 2026 Dangen Security Technologies. Independently built for the future of cyber warfare.*
