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

    async generateReport(payload) {
      // Simulate a backend-generated report object.
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
   *
   * Backend base URL (no auth): http://localhost:5000/api
   * The restClient composes `${baseUrl}${path}` and we pass paths like "/sites".
   *
   * @param {{ baseUrl?: string }} options
   */
  const client = createRestClient({ baseUrl: options.baseUrl });

  return {
    kind: "rest",

    // Reads
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

    // Mutations
    async createSite(payload) {
      return client.post("/sites", { body: payload });
    },
    async updateSite(siteId, patch) {
      return client.patch(`/sites/${encodeURIComponent(siteId)}`, { body: patch });
    },

    async acknowledgeAlert(alertId) {
      // Provided endpoint: POST /alerts/:id/ack
      return client.post(`/alerts/${encodeURIComponent(alertId)}/ack`);
    },

    async generateReport(payload) {
      // Provided endpoint: POST /reports
      return client.post("/reports", { body: payload });
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
