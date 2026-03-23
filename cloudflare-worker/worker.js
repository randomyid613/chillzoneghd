/**
 * ChillZone Gallery API — Cloudflare Worker + R2
 *
 * SETUP:
 * 1. Create an R2 bucket called "chillzone-gallery" in your Cloudflare dashboard
 * 2. Create a Worker and paste this code
 * 3. In the Worker settings, bind R2:
 *    - Variable name: GALLERY_BUCKET
 *    - R2 bucket: chillzone-gallery
 * 4. Add environment variable:
 *    - ADMIN_TOKEN: a secret string of your choice (e.g. "my-secret-token-123")
 * 5. Update ALLOWED_ORIGINS below with your actual domain(s)
 */

const ALLOWED_ORIGINS = [
  "https://chillzoneghd.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
  // Add your custom domain here, e.g.:
  // "https://chillzone.org.uk",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) },
  });
}

function isAuthorized(request, env) {
  const auth = request.headers.get("Authorization") || "";
  return auth === `Bearer ${env.ADMIN_TOKEN}`;
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // LIST images — GET /images
      if (path === "/images" && request.method === "GET") {
        const list = await env.GALLERY_BUCKET.list();
        const images = [];

        for (const obj of list.objects) {
          images.push({
            id: obj.key,
            url: `/image/${obj.key}`,
            caption: obj.customMetadata?.caption || "",
            addedAt: obj.uploaded?.toISOString() || "",
          });
        }

        // Sort newest first
        images.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        return jsonResponse(images, 200, request);
      }

      // GET single image — GET /image/:key
      if (path.startsWith("/image/") && request.method === "GET") {
        const key = path.replace("/image/", "");
        const object = await env.GALLERY_BUCKET.get(key);

        if (!object) {
          return jsonResponse({ error: "Not found" }, 404, request);
        }

        const headers = new Headers(corsHeaders(request));
        headers.set("Content-Type", object.httpMetadata?.contentType || "image/jpeg");
        headers.set("Cache-Control", "public, max-age=31536000");
        return new Response(object.body, { headers });
      }

      // UPLOAD image — POST /images (multipart form: file + caption)
      if (path === "/images" && request.method === "POST") {
        if (!isAuthorized(request, env)) {
          return jsonResponse({ error: "Unauthorized" }, 401, request);
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const caption = formData.get("caption") || "";

        if (!file || !file.name) {
          return jsonResponse({ error: "No file provided" }, 400, request);
        }

        const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

        await env.GALLERY_BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: file.type },
          customMetadata: { caption },
        });

        return jsonResponse({ id: key, caption, url: `/image/${key}` }, 201, request);
      }

      // DELETE image — DELETE /images/:key
      if (path.startsWith("/images/") && request.method === "DELETE") {
        if (!isAuthorized(request, env)) {
          return jsonResponse({ error: "Unauthorized" }, 401, request);
        }

        const key = path.replace("/images/", "");
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
