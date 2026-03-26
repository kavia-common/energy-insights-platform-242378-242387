/**
 * Minimal leveled logger for backend_api client modules.
 */

// PUBLIC_INTERFACE
export function createLogger(level = "info") {
  /**
   * Creates a console-based logger filtered by severity.
   * Levels: "debug" < "info" < "warn" < "error" < "silent"
   */
  const order = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };
  const min = order[level] ?? order.info;

  const should = (lvl) => (order[lvl] ?? 1000) >= min;

  return {
    debug: (...args) => (should("debug") ? console.debug("[api]", ...args) : undefined),
    info: (...args) => (should("info") ? console.info("[api]", ...args) : undefined),
    warn: (...args) => (should("warn") ? console.warn("[api]", ...args) : undefined),
    error: (...args) => (should("error") ? console.error("[api]", ...args) : undefined),
  };
}
