// Client-side auth helpers.
//
// IMPORTANT: there are NO admin credentials or API tokens in this file.
// Login posts the user's credentials to the Cloudflare Worker, which
// validates them server-side and returns a short-lived signed session
// token. That token is the only thing stored in sessionStorage and is
// the only credential the server trusts for upload/delete.
//
// The client-side `isLoggedIn` check is purely a UI hint — the Worker
// independently verifies the token signature and expiry on every
// privileged request.

const TOKEN_KEY = "chillzone_session";
const EXP_KEY = "chillzone_session_exp";

const API_BASE = import.meta.env.VITE_GALLERY_API_URL || "";

export const login = async (email: string, password: string): Promise<boolean> => {
  if (!API_BASE) {
    console.error("VITE_GALLERY_API_URL is not set — cannot log in.");
    return false;
  }
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token?: string; expiresAt?: number };
    if (!data.token) return false;
    sessionStorage.setItem(TOKEN_KEY, data.token);
    if (data.expiresAt) sessionStorage.setItem(EXP_KEY, String(data.expiresAt));
    return true;
  } catch (err) {
    console.error("Login error:", err);
    return false;
  }
};

export const logout = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXP_KEY);
};

export const getAdminToken = (): string => {
  return sessionStorage.getItem(TOKEN_KEY) || "";
};

export const isLoggedIn = (): boolean => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return false;
  const expRaw = sessionStorage.getItem(EXP_KEY);
  if (expRaw) {
    const exp = Number(expRaw);
    if (Number.isFinite(exp) && exp < Math.floor(Date.now() / 1000)) {
      logout();
      return false;
    }
  }
  return true;
};
