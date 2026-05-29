/**
 * Returns the base URL for internal API calls.
 * - In local dev (localhost), returns '' so relative paths like /api/chat work.
 * - In production (deployed), returns the NEXT_PUBLIC_APP_URL.
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "";
    }
  }
  return process.env.NEXT_PUBLIC_APP_URL || "";
}
