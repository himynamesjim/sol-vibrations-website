/**
 * Basic in-memory sliding-window rate limiter for public form submissions.
 *
 * Note: on serverless hosting each warm instance has its own window, so this
 * is best-effort spam protection (paired with a honeypot field), not a hard
 * guarantee. Swap for Upstash/Redis if abuse becomes a real problem.
 */
const windows = new Map<string, number[]>()

export function isRateLimited(key: string, limit = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now()
  const hits = (windows.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    windows.set(key, hits)
    return true
  }
  hits.push(now)
  windows.set(key, hits)

  // Keep the map from growing unbounded on long-lived processes.
  if (windows.size > 10_000) {
    for (const [k, v] of windows) {
      if (v.every((t) => now - t >= windowMs)) windows.delete(k)
    }
  }
  return false
}
