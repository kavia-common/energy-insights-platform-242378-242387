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
