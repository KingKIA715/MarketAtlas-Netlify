// Generic error reporting utility — replace with your own error tracking (Sentry, LogRocket, etc.)

type ErrorReportOptions = {
  source?: string;
  route?: string;
  boundary?: string;
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

/**
 * Report an error to the console and optionally to an external service.
 * Hook into window.onerror or your error tracking SDK here.
 */
export function reportError(error: unknown, options: ErrorReportOptions = {}) {
  const { source = "unknown", boundary, severity = "error" } = options;

  console.error(`[${severity}] ${source}${boundary ? ` (${boundary})` : ""}:`, error);

  // Example: send to external service
  // if (typeof window !== "undefined" && window.SENTRY_SDK) { ... }
}
