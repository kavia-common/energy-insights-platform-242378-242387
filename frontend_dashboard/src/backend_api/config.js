/**
 * backend_api configuration derived from REACT_APP_* environment variables.
 *
 * Note: CRA exposes environment variables prefixed with REACT_APP_ at build time.
 */

// PUBLIC_INTERFACE
export function getBackendConfig() {
  /**
   * Returns a normalized backend configuration object.
   *
   * Env vars:
   * - REACT_APP_API_BASE: preferred REST base URL (e.g., https://api.example.com)
   * - REACT_APP_BACKEND_URL: alternate REST base URL
   * - REACT_APP_WS_URL: WebSocket base URL (e.g., wss://api.example.com/ws)
   * - REACT_APP_NODE_ENV: environment ("development", "production", etc.)
   * - REACT_APP_FEATURE_FLAGS: comma-separated flags, e.g. "use_mock_api,debug_api"
   * - REACT_APP_EXPERIMENTS_ENABLED: boolean-like ("true"/"1")
   */
  const apiBase =
    (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();
  const wsUrl = (process.env.REACT_APP_WS_URL || "").trim();

  const logLevel = (process.env.REACT_APP_LOG_LEVEL || "info").trim().toLowerCase();
  const nodeEnv = (process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development").trim();

  const featureFlagsRaw = (process.env.REACT_APP_FEATURE_FLAGS || "").trim();
  const featureFlags = new Set(
    featureFlagsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const experimentsEnabledRaw = (process.env.REACT_APP_EXPERIMENTS_ENABLED || "").trim().toLowerCase();
  const experimentsEnabled =
    experimentsEnabledRaw === "true" || experimentsEnabledRaw === "1" || experimentsEnabledRaw === "yes";

  // Default behavior: if no API base is configured, run in mock mode so UI works.
  const useMock = featureFlags.has("use_mock_api") || !apiBase;

  return {
    apiBase,
    wsUrl,
    nodeEnv,
    logLevel,
    featureFlags,
    experimentsEnabled,
    useMock,
  };
}
