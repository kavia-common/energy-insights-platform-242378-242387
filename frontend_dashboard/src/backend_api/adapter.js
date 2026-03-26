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
