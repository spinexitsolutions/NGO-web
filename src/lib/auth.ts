// Edge + Node compatible signed-cookie session (HMAC-SHA256 via Web Crypto)

export const SESSION_COOKIE = "ummeed_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ummeed.org";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ummeed@2026";
const SECRET = process.env.AUTH_SECRET || "ummeed-demo-secret-change-me";

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  return atob(pad);
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function createSession(email: string) {
  const payload = b64url(enc.encode(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + MAX_AGE })));
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySession(token: string | undefined | null): Promise<{ email: string } | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const data = JSON.parse(fromB64url(payload)) as { email: string; exp: number };
    if (data.exp < Date.now() / 1000) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
