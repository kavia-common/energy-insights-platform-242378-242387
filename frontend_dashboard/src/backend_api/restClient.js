import { ApiError, normalizeError } from "./errors";
import { createLogger } from "./logger";
import { getBackendConfig } from "./config";

function joinUrl(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return p ? `${b}/${p}` : b;
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    // Not JSON; return raw text
    return text;
  }
}

// PUBLIC_INTERFACE
export function createRestClient(options = {}) {
  /**
   * Creates a lightweight REST client around fetch().
   * No external dependencies: uses browser fetch + AbortController.
   *
   * @param {{ baseUrl?: string, defaultTimeoutMs?: number }} options
   */
  const cfg = getBackendConfig();
  const baseUrl = (options.baseUrl ?? cfg.apiBase ?? "").trim();
  const defaultTimeoutMs = options.defaultTimeoutMs ?? 15000;
  const log = createLogger(cfg.logLevel);

  async function request(method, path, { query, body, headers, signal, timeoutMs } = {}) {
    if (!baseUrl) throw new ApiError("API base URL is not configured", { code: "NO_API_BASE" });

    const url = new URL(joinUrl(baseUrl, path));
    if (query && typeof query === "object") {
      Object.entries(query).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        url.searchParams.set(k, String(v));
      });
    }

    const ctrl = new AbortController();
    const tMs = timeoutMs ?? defaultTimeoutMs;
    const timer = setTimeout(() => ctrl.abort(), tMs);

    // If upstream signal aborts, propagate into internal controller
    if (signal) {
      if (signal.aborted) ctrl.abort();
      else signal.addEventListener("abort", () => ctrl.abort(), { once: true });
    }

    try {
      const init = {
        method,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : null),
          ...(headers || {}),
        },
        signal: ctrl.signal,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      };

      log.debug("REST", method, url.toString());
      const res = await fetch(url.toString(), init);

      const payload = await parseJsonSafe(res);

      if (!res.ok) {
        throw new ApiError(`Request failed (${res.status})`, {
          status: res.status,
          details: payload,
        });
      }

      return payload;
    } catch (err) {
      throw normalizeError(err);
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    get: (path, opts) => request("GET", path, opts),
    post: (path, opts) => request("POST", path, opts),
    put: (path, opts) => request("PUT", path, opts),
    patch: (path, opts) => request("PATCH", path, opts),
    del: (path, opts) => request("DELETE", path, opts),
  };
}
