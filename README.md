# Energy Insights Platform

This repository contains the **Energy Insights Platform**, a full-stack web application that provides intelligent analytics and anomaly detection for commercial energy consumption.

## Containers

### `frontend_dashboard` (React)

The account-manager dashboard UI lives under:

- `frontend_dashboard/`

It communicates with a backend service via REST (and optionally WebSocket) using an adapter layer. The current UI can run without a backend using mock data, but the integration contract below documents what the frontend expects from a real backend.

## Backend API contract (frontend expectations)

The canonical contract for integrating a backend with the `frontend_dashboard` is:

- `frontend_dashboard/src/backend_api/contract.md`

That document includes:

- The required REST endpoint list and response payload shapes used by the UI today
- The environment variables used to configure REST and WebSocket connectivity
- CORS and authentication assumptions for local development and production deployments