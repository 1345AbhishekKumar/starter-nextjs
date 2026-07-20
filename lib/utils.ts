export const DEFAULT_PAGE_SIZE = 25;

/**
 * Determines whether a Neon/Drizzle error is a transient connectivity failure
 * (e.g. cold-start "fetch failed") that is safe to retry.
 */
function isTransientNeonError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message;
  // NeonDbError wraps fetch failures from cold-starts / brief network blips
  if (msg.includes('fetch failed')) return true;
  if (msg.includes('Error connecting to database')) return true;
  // Drizzle re-wraps the NeonDbError — check the cause chain too
  const cause = (error as { cause?: unknown }).cause;
  if (cause instanceof Error) return isTransientNeonError(cause);
  return false;
}

/**
 * Retries an async DB operation on transient Neon connectivity errors.
 *
 * Only retries on "fetch failed" / "Error connecting to database" — all other
 * errors (auth failures, constraint violations, query errors, etc.) propagate
 * immediately without retry.
 *
 * @param fn          The async operation to attempt.
 * @param maxAttempts Total attempts before giving up (default: 3).
 * @param baseDelayMs Initial backoff delay in ms, doubles each attempt (default: 600ms).
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 600,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isTransientNeonError(error) || attempt === maxAttempts) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1); // 600ms, 1200ms, …
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}
