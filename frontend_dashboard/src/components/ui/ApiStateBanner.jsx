import React from "react";
import { getErrorMessage } from "../../backend_api/hooks";

// PUBLIC_INTERFACE
export default function ApiStateBanner({ isLoading, error, label = "Data", onRetry }) {
  /**
   * Small, consistent inline status UI for API-backed panels.
   * - Shows "Loading…" (non-blocking)
   * - Shows an error message + Retry button when available
   */
  if (!isLoading && !error) return null;

  return (
    <div
      className="ei-apiBanner"
      role={error ? "alert" : "status"}
      aria-label={error ? `${label} load error` : `${label} loading`}
    >
      <div className="ei-apiBanner__text">
        {isLoading ? `${label} loading…` : `${label} error: ${getErrorMessage(error)}`}
      </div>
      {error && onRetry ? (
        <button className="ei-btn ei-btn--ghost" type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
