import { useEffect, useMemo, useRef, useState } from "react";
import { createBackendAdapter } from "./adapter";
import { isAbortError, normalizeError } from "./errors";

/**
 * Centralized async state hook:
 * - consistent { data, error, isLoading, reload }
 * - abort on unmount
 */

// PUBLIC_INTERFACE
export function useApiResource(loader, deps = []) {
  /**
   * Runs an async loader with standardized loading/error handling.
   *
   * @template T
   * @param {(ctx: { signal: AbortSignal }) => Promise<T>} loader
   * @param {any[]} deps
   * @returns {{ data: any, error: any, isLoading: boolean, reload: () => void }}
   */
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const reloadNonce = useRef(0);
  const reload = () => {
    reloadNonce.current += 1;
    // force effect re-run by setting state
    setIsLoading(true);
  };

  useEffect(() => {
    const ctrl = new AbortController();
    let mounted = true;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await loader({ signal: ctrl.signal });
        if (!mounted) return;
        setData(res);
      } catch (e) {
        if (!mounted) return;
        if (isAbortError(e)) return;
        setError(normalizeError(e));
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadNonce.current]);

  return { data, error, isLoading, reload };
}

// PUBLIC_INTERFACE
export function useBackendApi() {
  /**
   * Returns a memoized backend adapter instance.
   */
  return useMemo(() => createBackendAdapter(), []);
}

// PUBLIC_INTERFACE
export function useSites() {
  /** Load sites list via adapter. */
  const api = useBackendApi();
  return useApiResource(() => api.listSites(), [api]);
}

// PUBLIC_INTERFACE
export function useAlerts() {
  /** Load alerts list via adapter. */
  const api = useBackendApi();
  return useApiResource(() => api.listAlerts(), [api]);
}

// PUBLIC_INTERFACE
export function useAnomalies() {
  /** Load anomalies list via adapter. */
  const api = useBackendApi();
  return useApiResource(() => api.listAnomalies(), [api]);
}

// PUBLIC_INTERFACE
export function useReports() {
  /** Load reports list via adapter. */
  const api = useBackendApi();
  return useApiResource(() => api.listReports(), [api]);
}

// PUBLIC_INTERFACE
export function useApiAction(actionFn) {
  /**
   * Standardized action hook for POST/PUT/PATCH style operations.
   * Keeps consistent UX for:
   * - disabled buttons while running
   * - surfaced errors with Retry
   *
   * @template TArgs
   * @template TResult
   * @param {(args: TArgs) => Promise<TResult>} actionFn
   * @returns {{ run: (args: TArgs) => Promise<TResult>, isLoading: boolean, error: any, reset: () => void }}
   */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => setError(null);

  const run = async (args) => {
    setIsLoading(true);
    setError(null);
    try {
      return await actionFn(args);
    } catch (e) {
      const ne = normalizeError(e);
      setError(ne);
      throw ne;
    } finally {
      setIsLoading(false);
    }
  };

  return { run, isLoading, error, reset };
}

// PUBLIC_INTERFACE
export function useAlertActions() {
  /** Alert triage mutations via adapter (acknowledge/dismiss). */
  const api = useBackendApi();

  const acknowledge = useApiAction((alertId) => api.acknowledgeAlert(alertId));
  const dismiss = useApiAction((alertId) => api.dismissAlert(alertId));

  return { acknowledge, dismiss };
}

// PUBLIC_INTERFACE
export function useReportActions() {
  /** Report generation mutation via adapter. */
  const api = useBackendApi();
  const generate = useApiAction((payload) => api.generateReport(payload));
  return { generate };
}

// PUBLIC_INTERFACE
export function getErrorMessage(err) {
  /** Extract a human-friendly error message. */
  const e = normalizeError(err);
  if (e.status) return `${e.message}`;
  return e.message || "Something went wrong.";
}
