const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (secret && secret.trim().length >= 16) {
    return secret.trim();
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing SESSION_SECRET or JWT_SECRET environment variable in production.");
  }
  return "dev-local-session-secret-not-for-production-use";
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(base64Url: string): string {
  const padded = base64Url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((base64Url.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUint8Array(hex: string): Uint8Array | null {
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) return null;
  const arr = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    arr[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return arr;
}

/**
 * Creates a cryptographically signed session cookie value with expiration
 */
export async function signSession(
  data: Record<string, unknown>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payloadStr = JSON.stringify({
    ...data,
    iat: now,
    exp: now + ttlSeconds,
  });
  const payloadBase64 = toBase64Url(payloadStr);

  const key = await getHmacKey();
  const enc = new TextEncoder();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
  const sigHex = bufferToHex(sigBuffer);

  return `${payloadBase64}.${sigHex}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token and validates expiration.
 */
export async function verifySessionToken(token: string): Promise<any | null> {
  if (!token || !token.includes(".")) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadBase64, sigHex] = parts;
  if (!payloadBase64 || !sigHex) return null;

  const sigBytes = hexToUint8Array(sigHex);
  if (!sigBytes) return null;

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey();

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadBase64)
    );

    if (!isValid) return null;

    const payload = JSON.parse(fromBase64Url(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    if (!payload?.id || !payload?.role || typeof payload.exp !== "number" || payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
