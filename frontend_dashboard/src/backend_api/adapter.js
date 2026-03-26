import { createRestClient } from "./restClient";
import { getBackendConfig } from "./config";
import { sampleAlerts, sampleAnomalies, sampleReports, sampleSites } from "../mocks/sampleData";

/**
 * Adapter layer:
 * - UI talks only to adapter functions (listSites, listAlerts, etc.)
 * - Implementation can be REST-backed or mock-backed.
 *
 * This keeps components simple and enables "UI works without backend".
 */

// PUBLIC_INTERFACE
export function createMockAdapter() {
  /**
   * Mock adapter using in-memory sample data.
   * Methods are async to match network adapter signatures.
   */
  return {
    kind: "mock",
    async listSites() {
      return sampleSites;
    },
    async listAlerts() {
      return sampleAlerts;
    },
    async listAnomalies() {
      return sampleAnomalies;
    },
    async listReports() {
      return sampleReports;
    },

    /**
     * Mock "mutations" return updated objects but do not persist them globally.
     * This keeps UI wiring realistic without introducing a mock store.
     */
    async acknowledgeAlert(alertId) {
      const found = sampleAlerts.find((a) => a.id === alertId);
      if (!found) return null;
      return { ...found, status: "Acknowledged" };
    },
    async dismissAlert(alertId) {
      const found = sampleAlerts.find((a) => a.id === alertId);
      if (!found) return null;
      return { ...found, status: "Closed" };
    },

    async createSite(payload) {
      // Simulate backend-assigned ID and fill in reasonable defaults.
      const now = new Date().toISOString();
      return {
        id: `site_mock_${Math.random().toString(16).slice(2)}`,
        name: payload?.name || "New site",
        account: payload?.account || "Unknown account",
        city: payload?.city || "Unknown",
        meters: payload?.meters ?? 0,
        status: payload?.status || "Active",
        lastIngest: payload?.lastIngest || now,
      };
    },

    async updateSite(siteId, patch) {
      const found = sampleSites.find((s) => s.id === siteId);
      if (!found) return null;
      return { ...found, ...(patch || {}), id: found.id };
    },

    async createAlertFromAnomaly(anomalyId) {
      const found = sampleAnomalies.find((a) => a.id === anomalyId);
      if (!found) return null;
      const now = new Date().toISOString();
      return {
        id: `al_mock_${Math.random().toString(16).slice(2)}`,
        createdAt: now,
        siteId: found.siteId,
        siteName: found.siteName,
        type: "Anomaly",
        severity: found.score >= 0.85 ? "High" : found.score >= 0.7 ? "Medium" : "Low",
        status: "Open",
        summary: `${found.category} detected (${Math.round(found.score * 100)}%).`,
        recommendation: "Review the anomaly details and confirm operational drivers.",
      };
    },

    async generateReport(payload) {
      // Simulate a backend-generated report object; prepend so it appears newest.
      const now = new Date().toISOString();
      return {
        id: `rp_mock_${Math.random().toString(16).slice(2)}`,
        name: payload?.type || "Generated report",
        period: payload?.period || "Custom",
        status: "Draft",
        generatedAt: now,
        description: "Generated in mock mode (no backend configured).",
      };
    },
  };
}

// PUBLIC_INTERFACE
export function createRestAdapter(options = {}) {
  /**
   * REST adapter. Endpoints are documented in src/backend_api/contract.md.
   * @param {{ baseUrl?: string }} options
   */
  const client = createRestClient({ baseUrl: options.baseUrl });

  return {
    kind: "rest",
    async listSites() {
      return client.get("/sites");
    },
    async listAlerts() {
      return client.get("/alerts");
    },
    async listAnomalies() {
      return client.get("/anomalies");
    },
    async listReports() {
      return client.get("/reports");
    },

    /**
     * Mutations (scaffold): these endpoints are part of the hardened UI wiring.
     * A real backend should implement these to make triage and report flows functional.
     */
    async acknowledgeAlert(alertId) {
      return client.post(`/alerts/${encodeURIComponent(alertId)}/acknowledge`);
    },
    async dismissAlert(alertId) {
      return client.post(`/alerts/${encodeURIComponent(alertId)}/dismiss`);
    },

    /**
     * Sites: create/update (scaffold)
     * Backend can implement these as standard CRUD; UI will refresh lists after mutation.
     */
    async createSite(payload) {
      return client.post("/sites", { body: payload });
    },
    async updateSite(siteId, patch) {
      return client.patch(`/sites/${encodeURIComponent(siteId)}`, { body: patch });
    },

    /**
     * Anomalies → Alerts (optional scaffold): allows creating a triage item from an anomaly.
     * If backend does not implement it yet, keep it a no-op until integrated.
     */
    async createAlertFromAnomaly(anomalyId) {
      return client.post(`/anomalies/${encodeURIComponent(anomalyId)}/create-alert`);
    },

    async generateReport(payload) {
      return client.post("/reports/generate", { body: payload });
    },
  };
}

// PUBLIC_INTERFACE
export function createBackendAdapter() {
  /**
   * Factory that returns the best available adapter.
   * Default: mock adapter if API base is not configured.
   */
  const cfg = getBackendConfig();
  if (cfg.useMock) return createMockAdapter();
  return createRestAdapter({ baseUrl: cfg.apiBase });
}
