import { ApiError } from "./errors";
import { createLogger } from "./logger";
import { getBackendConfig } from "./config";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// PUBLIC_INTERFACE
export function createWsClient(options = {}) {
  /**
   * Creates a minimal WebSocket client with:
   * - connect()/disconnect()
   * - subscribe(handler) to receive messages (parsed as JSON when possible)
   * - sendJson(payload)
   * - optional autoReconnect
   *
   * @param {{
   *   url?: string,
   *   autoReconnect?: boolean,
   *   reconnectBackoffMs?: number[],
   * }} options
   */
  const cfg = getBackendConfig();
  const url = (options.url ?? cfg.wsUrl ?? "").trim();
  const autoReconnect = options.autoReconnect ?? true;
  const reconnectBackoffMs = options.reconnectBackoffMs ?? [500, 1000, 2000, 5000, 10000];

  const log = createLogger(cfg.logLevel);

  /** @type {WebSocket | null} */
  let ws = null;
  /** @type {Set<(msg:any)=>void>} */
  const subs = new Set();
  let desired = false;

  let reconnectAttempt = 0;

  function emit(msg) {
    subs.forEach((h) => {
      try {
        h(msg);
      } catch (e) {
        log.warn("WS subscriber threw", e);
      }
    });
  }

  function parseMessage(data) {
    if (typeof data !== "string") return data;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  async function connectInternal() {
    if (!url) throw new ApiError("WS URL is not configured", { code: "NO_WS_URL" });

    desired = true;
    reconnectAttempt = 0;

    while (desired) {
      try {
        log.debug("WS connecting", url);
        ws = new WebSocket(url);

        await new Promise((resolve, reject) => {
          if (!ws) return reject(new Error("WebSocket not created"));
          ws.onopen = () => resolve();
          ws.onerror = (e) => reject(e);
        });

        log.info("WS connected");
        ws.onmessage = (evt) => emit(parseMessage(evt.data));
        ws.onclose = () => {
          log.warn("WS closed");
          ws = null;
          emit({ type: "ws.closed" });
        };

        // Stay connected until closed
        return;
      } catch (err) {
        ws = null;
        emit({ type: "ws.error", error: String(err) });

        if (!autoReconnect) throw err;

        const backoff = reconnectBackoffMs[Math.min(reconnectAttempt, reconnectBackoffMs.length - 1)];
        reconnectAttempt += 1;
        log.warn("WS reconnecting in", backoff, "ms");
        await sleep(backoff);
      }
    }
  }

  return {
    connect: () => connectInternal(),
    disconnect: () => {
      desired = false;
      if (ws) {
        try {
          ws.close();
        } catch {
          // ignore
        }
      }
      ws = null;
    },
    subscribe: (handler) => {
      subs.add(handler);
      return () => subs.delete(handler);
    },
    sendJson: (payload) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        throw new ApiError("WebSocket is not connected", { code: "WS_NOT_CONNECTED" });
      }
      ws.send(JSON.stringify(payload));
    },
    getState: () => (ws ? ws.readyState : WebSocket.CLOSED),
  };
}
