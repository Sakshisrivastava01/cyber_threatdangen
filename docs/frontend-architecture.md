# Frontend Architecture

The `client/` app is built with React, TypeScript, Vite, and Zustand for fast, deterministic UI updates.

## Directory structure

- `src/pages/` — high-level views and navigation entry points.
- `src/components/` — reusable UI modules and dashboard visualizations.
- `src/services/api.ts` — HTTP client integration and API service helpers.
- `src/hooks/useThreatStore.ts` — global telemetry state management.
- `src/neural-hooks/useDangenTelemetry.ts` — telemetry subscription and streaming hooks.
- `src/threat-core/` — specialized heatmap, globe, and chart components.

## Frontend design principles

- **Modular pages** — each major capability lives in its own page module.
- **Component reuse** — UI composition and data layer separation keep styling stable.
- **Performance-first** — Vite and TypeScript enforce fast builds and compile-time checks.
- **No UI redesign** — the existing visual experience is preserved while improving engineering quality.

## Production readiness

- `client/Dockerfile` enables containerized frontend builds and preview hosting.
- `npm run build` performs TypeScript compilation and Vite production bundling.
- `client/eslint.config.js` provides linting enforcement for React and TypeScript code quality.
