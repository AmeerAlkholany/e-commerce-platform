import { cookies } from "next/headers";

const JWT_SECRET = process.env.SESSION_SECRET || "default_session_secret_key_at_least_32_characters_long_for_security";

/**
 * Base64URL encoding/decoding using standard Web APIs for Edge compatibility.
 */
function base64urlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes as Uint8Array<ArrayBuffer>;
}

/**
 * Signs a payload using Web Crypto API for Edge Runtime compatibility.
 */
export async function signJWT(payload: any, expiresInSeconds: number = 7 * 24 * 60 * 60): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };

  const encoder = new TextEncoder();
  const headerB64 = base64urlEncode(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64urlEncode(encoder.encode(JSON.stringify(fullPayload)));

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${headerB64}.${payloadB64}`)
  );

  const signatureB64 = base64urlEncode(new Uint8Array(signature));

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a JWT token using Web Crypto API for Edge Runtime compatibility.
 */
export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(signatureB64),
      encoder.encode(`${headerB64}.${payloadB64}`)
    );

    if (!isValid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));

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

  const sessionToken = await signJWT({
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
  if (process.env.NODE_ENV === "development" && process.env.DEV_ADMIN_BYPASS === "true") {
    return {
      id: 4, // Assumes user with ID 15 is the main admin
      email: "diana@example.com",
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

    const payload = await verifyJWT(token);
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
