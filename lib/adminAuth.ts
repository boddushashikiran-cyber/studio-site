// A lightweight, single-admin session scheme: no user accounts, just
// one shared password. The session cookie is a SHA-256 hash of the
// password + a separate secret, so the raw password never sits in a
// cookie. This is appropriate for "one studio owner checks a private
// page" — it is NOT a substitute for real multi-user auth.

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return null;
  return sha256Hex(`${password}:${secret}`);
}

export const ADMIN_COOKIE_NAME = "admin_session";
