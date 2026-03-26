# frontend_dashboard (Energy Insights Platform)

This container is the **Energy Insights Platform** React dashboard UI for account managers and commercial customers. It provides portfolio snapshot KPIs, alerts triage, anomaly views, account/site management scaffolding, and reports scaffolding.

The frontend integrates with a backend via a small client library and adapter layer in `src/backend_api/`. If the backend is not configured, the UI will automatically fall back to mock data so development can continue.

## Running locally

From `frontend_dashboard/`:

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Backend integration overview

The UI talks to an adapter interface implemented in:

- `src/backend_api/adapter.js`

There are two adapter modes:

- **Mock mode**: uses in-memory sample data from `src/mocks/sampleData.js`
- **REST mode**: calls the backend using `fetch()` via `src/backend_api/restClient.js`

The adapter mode is selected by `src/backend_api/config.js`:

- If no REST base URL is configured, mock mode is enabled by default.
- If `REACT_APP_FEATURE_FLAGS` includes `use_mock_api`, mock mode is forced even if a base URL is present.

## Environment variables

Create a `.env` file (or set these at build time). In Create React App, only variables prefixed with `REACT_APP_` are exposed to the browser bundle.

### Required for live backend usage

- `REACT_APP_API_BASE` (preferred) or `REACT_APP_BACKEND_URL` (fallback): REST base URL used by the frontend REST client.
  - Example: `REACT_APP_API_BASE=https://api.example.com`
  - The frontend constructs requests like `${REACT_APP_API_BASE}/sites`.

### Optional

- `REACT_APP_WS_URL`: WebSocket URL for future realtime updates.
  - Example: `REACT_APP_WS_URL=wss://api.example.com/ws`
  - The current UI does not require WS messages yet, but `src/backend_api/wsClient.js` can connect if configured.
- `REACT_APP_FEATURE_FLAGS`: Comma-separated feature flags.
  - Example: `REACT_APP_FEATURE_FLAGS=use_mock_api,debug_api`
  - Currently used flags:
    - `use_mock_api`: forces mock adapter mode
- `REACT_APP_EXPERIMENTS_ENABLED`: Boolean-like value (`true`, `1`, `yes`) enabling experiments (scaffolding).
- `REACT_APP_LOG_LEVEL`: One of `debug`, `info`, `warn`, `error`, `silent`. Used to filter backend client logs.

### Present in the container `.env` but not currently used by the frontend code

The following variables exist in the container environment list, but are not currently referenced by the frontend code in `src/backend_api/*`:

- `REACT_APP_FRONTEND_URL`
- `REACT_APP_NODE_ENV` (the code uses it if present, otherwise falls back to `process.env.NODE_ENV`)
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`
- `REACT_APP_TRUST_PROXY`
- `REACT_APP_HEALTHCHECK_PATH`

If you intend these to affect runtime behavior, you will need to wire them into the React app (for example, using them in config, diagnostics, or build scripts).

## Backend API contract

The endpoint list and payload shapes expected by the current UI are documented here:

- `src/backend_api/contract.md`

At a minimum, the frontend expects these JSON REST endpoints:

- `GET /sites` → `Site[]`
- `GET /alerts` → `Alert[]`
- `GET /anomalies` → `Anomaly[]`
- `GET /reports` → `Report[]`

## CORS and authentication assumptions

### CORS

The REST client uses browser `fetch()` directly. That means:

- The backend must allow cross-origin requests from the frontend origin in development (typically `http://localhost:3000`) and from the deployed frontend origin in production.
- The backend should respond to preflight requests (`OPTIONS`) when required.

If you implement cookie-based auth, you will also need to configure:

- Backend CORS to allow credentials (`Access-Control-Allow-Credentials: true`)
- Frontend fetch to include credentials (note: the current `restClient.js` does not set `credentials: "include"` yet)

### Authentication

The current client does not send an `Authorization` header and does not implement login flows yet. The contract is therefore currently one of:

- Unauthenticated endpoints for development, or
- Authentication handled upstream (for example via a reverse proxy injecting identity), or
- A backend that accepts requests without auth until the next integration step adds token/cookie support to `restClient.js`

If you add auth, the recommended approach is:

- Use `Authorization: Bearer <token>` headers for REST
- Use either:
  - a token in the WebSocket URL query string, or
  - the `Sec-WebSocket-Protocol` mechanism, depending on your backend stack

## Notes on error handling

The REST client:

- Parses JSON responses when possible, otherwise returns raw text.
- Throws a standardized `ApiError` with `status` when HTTP responses are non-2xx.
- Times out requests after 15 seconds by default (configurable in code).

## Where to change integration behavior

- REST base URL and feature flags: `src/backend_api/config.js`
- REST client implementation: `src/backend_api/restClient.js`
- WebSocket client scaffolding: `src/backend_api/wsClient.js`
- Adapter methods used by pages/hooks: `src/backend_api/adapter.js`
- Hooks used by pages: `src/backend_api/hooks.js`
