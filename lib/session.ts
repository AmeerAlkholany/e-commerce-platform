import { cookies } from "next/headers";
import crypto from "crypto";

const JWT_SECRET = process.env.SESSION_SECRET || "default_session_secret_key_at_least_32_characters_long_for_security";

function base64urlEncode(str: string | Buffer): string {
  const buf = typeof str === "string" ? Buffer.from(str) : str;
  return buf.toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Signs a payload to generate a JWT token (HS256).
 */
export function signJWT(payload: any, expiresInSeconds: number = 7 * 24 * 60 * 60): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest();

  const signatureB64 = base64urlEncode(signature);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a JWT token (HS256) and returns its payload if valid.
 */
export function verifyJWT(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest();

    const expectedSignatureB64 = base64urlEncode(expectedSignature);

    if (signatureB64 !== expectedSignatureB64) {
      return null;
    }

    const payload = JSON.parse(base64urlDecode(payloadB64));

    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Creates an encrypted session JWT and sets it as an HTTP-only cookie.
 */
export async function createSession(user: { id: any; email: string; role: string | null; name: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Convert BigInt IDs to standard numbers for JSON serialization
  const userId = typeof user.id === "bigint" ? Number(user.id) : user.id;

  const sessionToken = signJWT({
    userId,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Clears the session cookie.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Extracts and decodes the authenticated user payload from the request cookies or next headers.
 */
export async function getUserFromRequest(request?: Request): Promise<{ id: number; email: string; role: string | null; name: string } | null> {
  // 1. Development Mode Bypass: Inject a real account session without needing cookies
  // This allows work on the dashboard without manual login during dev.
  if (process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true") {
    return {
      id: 15, // Assumes user with ID 1 is the main admin
      email: "ahmedahmed1@gmail.com",
      role: "admin",
      name: "Development Admin",
    };
  }

  try {
    let token: string | undefined;

    if (request) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("session")?.value;
    }

    if (!token) {
      return null;
    }

    const payload = verifyJWT(token);
    if (!payload || (typeof payload.userId !== "number" && typeof payload.userId !== "string")) {
      return null;
    }

    return {
      id: Number(payload.userId),
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch (e) {
    console.error("Error getting user from request:", e);
    return null;
  }
}
