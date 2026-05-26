# Git Workflow and Engineering Standards

This document captures the branch strategy, commit convention, pull request workflow, release lifecycle, and contribution guidelines for the DANGEN cyber defense repository.

## 1. Purpose

The repository is organized for enterprise-grade production engineering. The goal is to keep `main` stable and deployable while isolating feature work, performance improvements, and fixes in dedicated branches.

## 2. Branch Strategy

### Stable Branches
- `main` — production-ready branch. Only reviewed and tested code is merged here.
- `release/*` — release candidate branches created from `main` for final validation before deployment.

### Feature Branches
Feature work is developed in isolated branches, merged only after code review and CI validation.

Required feature branches:
- `feature/intelligent-analysis`
- `feature/rag-pipeline`
- `feature/ml-threat-engine`
- `feature/geopulse-radar`
- `feature/device-intelligence`
- `feature/threat-intelligence`
- `perf/render-optimization`

### Support Branches
Support and maintenance branches use clear prefixes:
- `fix/` — bug fixes and stabilization work
- `perf/` — performance tuning and optimization
- `chore/` — dependency updates, doc maintenance, repo housekeeping
- `build/` — CI, packaging, or infrastructure automation changes

## 3. Branch Naming Guidelines

Use descriptive names that clearly identify the scope of work.

Examples:
- `feature/device-intelligence/mobile-risk-engine`
- `fix/websocket-session-reconnect`
- `perf/dashboard-render-path`
- `chore/dependency-refresh-2026`

## 4. Main Branch Policy

`main` must remain deployable at all times.
- No direct commits to `main` for feature work.
- All changes arrive through pull requests targeting `main`.
- Merge only after passing CI and at least one peer review.
- Preserve clean history with merge commits or rebase merges, depending on team conventions.

## 5. Pull Request Workflow

1. Create a short-lived feature branch from `main`.
2. Implement the change and keep commits focused.
3. Push the branch and open a pull request against `main`.
4. Include a concise summary, testing notes, and checklist items.
5. Allow at least one reviewer to validate changes.
6. Merge only after CI passes and review feedback is addressed.

### PR Expectations
- Title should be concise and follow semantic intent.
- Description should explain what changed and why.
- Include testing instructions and any manual validation notes.
- Reference related issues or tasks when available.

## 6. Commit Conventions

Follow semantic commit prefixes for clear history.

Allowed prefixes:
- `feat:` — new feature or capability
- `fix:` — bug fixes and stability improvements
- `perf:` — performance enhancements
- `refactor:` — internal restructuring without functional change
- `docs:` — documentation or guide updates
- `build:` — CI, automation, packaging, or repository tooling
- `chore:` — maintenance tasks, dependency upkeep, or housekeeping

### Commit Message Structure

Use a short subject line followed by an optional body.

Example:
```
feat: added geopulse radar heatmap ingestion layer

- implemented geographic threat correlation service
- added backend route for radar event requests
- updated deployment guidance for radar ingest
```

### Example Commit Messages
- `feat: added realtime threat intelligence ingestion`
- `fix: resolved websocket reconnect instability`
- `perf: optimized dashboard render throughput`
- `refactor: modularized telemetry processing services`
- `docs: added git workflow and branch strategy guide`
- `build: updated CI validation matrix`

## 7. CI Gating and Validation

All pull requests against `main` should be validated by GitHub Actions.
- Backend dependency and syntax validation
- Frontend build, lint, and TypeScript validation
- Docker compose and image validation

Use the CI results as the single source of truth for merge readiness.

## 8. Release Lifecycle

### Regular Releases
- `main` is the integration branch for stable deliverables.
- Create `release/x.y.z` branches for milestone validation if needed.
- Tag release commits with semantic versioning, e.g. `v1.2.0`.

### Hotfixes
- Use `fix/` branches for urgent production issues.
- Merge hotfix branches into `main` once validated.
- Backport fixes to the active release branch if required.

## 9. Contribution Process

### Issue Triage
- Capture new work in issues or backlog items.
- Assign issues to a sprint or milestone.
- Use labels to differentiate `feature`, `bug`, `performance`, and `ops` work.

### Development Steps
- Branch from `main` using the approved naming pattern.
- Keep commits narrow, focused, and descriptive.
- Rebase or squash locally as needed before opening a PR.

### Review Checklist
- [ ] Code follows repository conventions
- [ ] Tests or validation steps are included
- [ ] Documentation updates are included when needed
- [ ] CI passes successfully
- [ ] Changes are scoped to the branch purpose

## 10. Repository Engineering Standards

- Keep feature branches isolated from production-critical paths.
- Prefer incremental changes over large, all-in-one commits.
- Maintain a transparent history with commit prefixes and meaningful messages.
- Keep documentation up to date with workflow expectations.
- Treat `main` as the authoritative deployable branch.
