# backend_api contract (frontend expectations)

This frontend currently uses an adapter layer (`src/backend_api/adapter.js`) so the UI can run with either:
- a real backend (REST + optional WS), or
- mock data (`src/mocks/sampleData.js`) when `REACT_APP_API_BASE`/`REACT_APP_BACKEND_URL` is not set (or `use_mock_api` feature flag is enabled).

## Environment variables

- `REACT_APP_API_BASE` (preferred) or `REACT_APP_BACKEND_URL`: REST base URL
  - Example: `https://api.example.com`
- `REACT_APP_WS_URL`: WebSocket URL
  - Example: `wss://api.example.com/ws`
- `REACT_APP_FEATURE_FLAGS`: comma-separated flags
  - `use_mock_api` forces mock adapter even if `REACT_APP_API_BASE` is set.

## REST endpoints (expected)

All responses are JSON.

### `GET /sites`
Returns: `Site[]`

`Site` shape (current UI fields):
```json
{
  "id": "site_101",
  "name": "Harbor Plaza",
  "account": "Oceanic Retail Group",
  "city": "San Diego, CA",
  "meters": 12,
  "status": "Active",
  "lastIngest": "2026-03-25T18:10:00Z"
}
```

### `GET /alerts`
Returns: `Alert[]`

```json
{
  "id": "al_9001",
  "createdAt": "2026-03-26T06:30:00Z",
  "siteId": "site_102",
  "siteName": "Seaside Distribution Center",
  "type": "Spike",
  "severity": "High",
  "status": "Open",
  "summary": "Overnight kWh spike vs baseline (+38%).",
  "recommendation": "Check refrigeration schedules and loading bay lighting."
}
```

### `GET /anomalies`
Returns: `Anomaly[]`

```json
{
  "id": "an_4001",
  "detectedAt": "2026-03-26T06:15:00Z",
  "siteId": "site_102",
  "siteName": "Seaside Distribution Center",
  "model": "Seasonal baseline v2",
  "score": 0.92,
  "category": "Consumption spike",
  "window": "02:00–05:00",
  "notes": "Largest deviation in last 30 days."
}
```

### `GET /reports`
Returns: `Report[]`

```json
{
  "id": "rp_2001",
  "name": "Monthly Portfolio Summary",
  "period": "Feb 2026",
  "status": "Ready",
  "generatedAt": "2026-03-01T08:00:00Z",
  "description": "High-level KPIs, savings opportunities, and anomalies."
}
```

## Mutation endpoints (recommended)

These endpoints are used by the production-ready UI wiring for triage + report generation.

### `POST /alerts/:id/acknowledge`
Returns: updated `Alert` (recommended) or a minimal ok payload.

Example response:
```json
{ "id": "al_9001", "status": "Acknowledged" }
```

### `POST /alerts/:id/dismiss`
Returns: updated `Alert` (recommended) or a minimal ok payload.

Example response:
```json
{ "id": "al_9001", "status": "Closed" }
```

### `POST /reports/generate`
Body (suggested):
```json
{
  "type": "Monthly Portfolio Summary",
  "period": "Feb 2026",
  "format": "PDF",
  "includeAlertDetails": true
}
```

Returns: newly created `Report` (recommended) or `{ "id": "...", "status": "Draft" }`.

## WebSocket (optional)

If `REACT_APP_WS_URL` is provided, the `wsClient` can connect. The UI does not yet depend on WS messages, but the scaffolding supports receiving JSON messages for future real-time updates.

Potential message patterns (suggested, not enforced yet):
- `{ "type": "alert.created", "payload": { ...Alert } }`
- `{ "type": "site.ingest_status", "payload": { "siteId": "...", "lastIngest": "..." } }`
- `{ "type": "anomaly.detected", "payload": { ...Anomaly } }`
