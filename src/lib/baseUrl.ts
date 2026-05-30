/**
 * Returns the base URL for internal API calls.
 * Always returns '' so relative paths like /api/chat resolve
 * correctly on any host (localhost, Vercel, Render, etc.).
 */
export function getBaseUrl(): string {
  return "";
}
