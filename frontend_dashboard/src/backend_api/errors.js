/**
 * Shared error utilities for backend_api integration.
 */

// PUBLIC_INTERFACE
export class ApiError extends Error {
  /**
   * Standardized API error with optional HTTP status and metadata.
   * @param {string} message
   * @param {{ status?: number, code?: string, details?: any, cause?: any }} meta
   */
  constructor(message, meta = {}) {
    super(message);
    this.name = "ApiError";
    this.status = meta.status;
    this.code = meta.code;
    this.details = meta.details;
    this.cause = meta.cause;
  }
}

// PUBLIC_INTERFACE
export function normalizeError(err) {
  /**
   * Normalizes unknown thrown values into an ApiError instance.
   * @param {unknown} err
   * @returns {ApiError}
   */
  if (err instanceof ApiError) return err;
  if (err instanceof Error) return new ApiError(err.message, { cause: err });
  return new ApiError("Unknown error", { details: err });
}

// PUBLIC_INTERFACE
export function isAbortError(err) {
  /**
   * Returns true if error is a fetch abort/cancel.
   */
  const e = err instanceof Error ? err : null;
  return (
    (e && (e.name === "AbortError" || e.message?.toLowerCase?.().includes("abort"))) ||
    false
  );
}
