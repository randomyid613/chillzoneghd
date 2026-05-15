/**
 * ChillZone Gallery API — Cloudflare Worker + R2
 *
 * SETUP (Worker secrets — set with `npx wrangler secret put <NAME>`):
 *   ADMIN_EMAIL    — admin login email (e.g. office@chillzone.org.uk)
 *   ADMIN_PASSWORD — admin login password (plaintext; stored only as a Worker secret)
 *   AUTH_SECRET    — long random string used to sign session tokens (32+ chars)
 *
 * R2 binding:
 *   Variable name: GALLERY_BUCKET  →  R2 bucket: chillzone-gallery
 *
 * Update ALLOWED_ORIGINS below with your actual domain(s).
 */

const ALLOWED_ORIGINS = [
  "https://chillzone.org.uk",
  "https://www.chillzone.org.uk",
  "https://chillzoneghd.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Magic-byte signatures for the allowed types
const MAGIC_BYTES = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { type: "image/png",  bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: "image/gif",  bytes: [0x47, 0x49, 0x46, 0x38] },
  { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF (followed by WEBP at offset 8)
];

const SESSION_TTL_SECONDS = 60 * 60 * 4; // 4 hours
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) },
  });
}

// ---------- Session token (HMAC-SHA256) ----------

function b64urlEncode(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(str) {
  const pad = str.length % 4 ? "=".repeat(4 - (str.length % 4)) : "";
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signSession(email, secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = b64urlEncode(new TextEncoder().encode(JSON.stringify({ sub: email, exp })));
  const key = await hmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return `${payload}.${b64urlEncode(sig)}`;
}

async function verifySession(token, secret) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlDecode(sig),
      new TextEncoder().encode(payload)
    );
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(b64urlDecode(payload)));
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

async function isAuthorized(request, env) {
  if (!env.AUTH_SECRET) return false;
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  return !!(await verifySession(auth.slice(7), env.AUTH_SECRET));
}

// Constant-time string compare
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// ---------- File validation ----------

function matchesMagicBytes(declaredType, head) {
  for (const sig of MAGIC_BYTES) {
    if (sig.type !== declaredType) continue;
    if (head.length < sig.bytes.length) return false;
    for (let i = 0; i < sig.bytes.length; i++) {
      if (head[i] !== sig.bytes[i]) return false;
    }
    if (declaredType === "image/webp") {
      // After RIFF + 4-byte size, bytes 8..11 must be "WEBP"
      if (head.length < 12) return false;
      if (head[8] !== 0x57 || head[9] !== 0x45 || head[10] !== 0x42 || head[11] !== 0x50) return false;
    }
    return true;
  }
  return false;
}

// ---------- Handler ----------

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // LOGIN — POST /login  { email, password }  →  { token, expiresAt }
      if (path === "/login" && request.method === "POST") {
        if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || !env.AUTH_SECRET) {
          return jsonResponse({ error: "Server not configured" }, 500, request);
        }
        let body;
        try { body = await request.json(); } catch { body = null; }
        const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body?.password === "string" ? body.password : "";
        if (!email || !password) {
          return jsonResponse({ error: "Email and password required" }, 400, request);
        }
        const emailOk = timingSafeEqual(email, env.ADMIN_EMAIL.trim().toLowerCase());
        const passOk = timingSafeEqual(password, env.ADMIN_PASSWORD);
        if (!emailOk || !passOk) {
          return jsonResponse({ error: "Invalid credentials" }, 401, request);
        }
        const token = await signSession(email, env.AUTH_SECRET);
        const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
        return jsonResponse({ token, expiresAt }, 200, request);
      }

      // LIST images — GET /images
      if (path === "/images" && request.method === "GET") {
        const list = await env.GALLERY_BUCKET.list();
        const images = list.objects.map((obj) => ({
          id: obj.key,
          url: `/image/${obj.key}`,
          caption: obj.customMetadata?.caption || "",
          addedAt: obj.uploaded?.toISOString() || "",
        }));
        images.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        return jsonResponse(images, 200, request);
      }

      // GET single image — GET /image/:key
      if (path.startsWith("/image/") && request.method === "GET") {
        const key = decodeURIComponent(path.replace("/image/", ""));
        const object = await env.GALLERY_BUCKET.get(key);
        if (!object) return jsonResponse({ error: "Not found" }, 404, request);

        const storedType = object.httpMetadata?.contentType || "image/jpeg";
        const safeType = ALLOWED_MIME_TYPES.includes(storedType) ? storedType : "application/octet-stream";

        const headers = new Headers(corsHeaders(request));
        headers.set("Content-Type", safeType);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("X-Content-Type-Options", "nosniff");
        headers.set("Content-Disposition", "inline");
        return new Response(object.body, { headers });
      }

      // UPLOAD — POST /images
      if (path === "/images" && request.method === "POST") {
        if (!(await isAuthorized(request, env))) {
          return jsonResponse({ error: "Unauthorized" }, 401, request);
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const caption = (formData.get("caption") || "").toString().slice(0, 200);

        if (!file || !file.name) {
          return jsonResponse({ error: "No file provided" }, 400, request);
        }
        if (file.size > MAX_FILE_BYTES) {
          return jsonResponse({ error: "File too large" }, 413, request);
        }
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return jsonResponse({ error: "Invalid file type" }, 415, request);
        }

        // Verify magic bytes match the declared type
        const buf = await file.arrayBuffer();
        const head = new Uint8Array(buf.slice(0, 16));
        if (!matchesMagicBytes(file.type, head)) {
          return jsonResponse({ error: "File contents do not match declared type" }, 415, request);
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
        const key = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

        await env.GALLERY_BUCKET.put(key, buf, {
          httpMetadata: { contentType: file.type },
          customMetadata: { caption },
        });

        return jsonResponse({ id: key, caption, url: `/image/${key}` }, 201, request);
      }

      // DELETE — DELETE /images/:key
      if (path.startsWith("/images/") && request.method === "DELETE") {
        if (!(await isAuthorized(request, env))) {
          return jsonResponse({ error: "Unauthorized" }, 401, request);
        }
        const key = decodeURIComponent(path.replace("/images/", ""));
        await env.GALLERY_BUCKET.delete(key);
        return jsonResponse({ success: true }, 200, request);
      }

      return jsonResponse({ error: "Not found" }, 404, request);
    } catch (err) {
      console.error(err);
      return jsonResponse({ error: "Internal server error" }, 500, request);
    }
  },
};
