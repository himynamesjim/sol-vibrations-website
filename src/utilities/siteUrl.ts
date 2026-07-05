/**
 * NEXT_PUBLIC_SITE_URL, normalized: tolerates values without a protocol
 * (e.g. "solvibrations.net") and trailing slashes. Falls back to localhost.
 */
export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
  if (!raw) return 'http://localhost:3000'
  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`)
    return url.origin
  } catch {
    return 'http://localhost:3000'
  }
}
