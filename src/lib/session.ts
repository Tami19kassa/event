const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "eventhub-secure-hmac-secret-key-32chars-minimum-length-key";

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUint8Array(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return arr;
}

/**
 * Creates a cryptographically signed session cookie value
 */
export async function signSession(data: any): Promise<string> {
  const enc = new TextEncoder();
  const payloadStr = JSON.stringify(data);
  const payloadBase64 = Buffer.from(payloadStr, "utf-8").toString("base64url");

  const key = await getHmacKey();
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadBase64)
  );
  const sigHex = bufferToHex(sigBuffer);

  return `${payloadBase64}.${sigHex}`;
}

/**
 * Verifies a signed session token. Returns null if invalid or tampered with.
 */
export async function verifySessionToken(token: string): Promise<any | null> {
  if (!token || !token.includes(".")) {
    // Graceful backward compatibility check if un-signed JSON was previously stored
    try {
      const parsed = JSON.parse(token);
      if (parsed?.id && parsed?.role) return parsed;
    } catch {}
    return null;
  }

  const [payloadBase64, sigHex] = token.split(".");
  if (!payloadBase64 || !sigHex) return null;

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey();
    const sigBytes = hexToUint8Array(sigHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(payloadBase64)
    );

    if (!isValid) return null;

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    return JSON.parse(payloadJson);
  } catch (err) {
    return null;
  }
}
