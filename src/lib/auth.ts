const ADMIN_EMAIL = "office@chillzone.org.uk";
const ADMIN_PASSWORD = "Smbdcz25";
const AUTH_KEY = "chillzone_auth";
const TOKEN_KEY = "chillzone_token";

// The admin token must match the ADMIN_TOKEN secret set in your Cloudflare Worker
const ADMIN_API_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "";

export const login = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    sessionStorage.setItem(TOKEN_KEY, ADMIN_API_TOKEN);
    return true;
  }
  return false;
};

export const logout = () => {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = (): boolean => {
  return sessionStorage.getItem(AUTH_KEY) === "true";
};

export const getAdminToken = (): string => {
  return sessionStorage.getItem(TOKEN_KEY) || ADMIN_API_TOKEN;
};
