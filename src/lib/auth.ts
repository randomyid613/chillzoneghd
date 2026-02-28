const ADMIN_EMAIL = "office@chillzone.org.uk";
const ADMIN_PASSWORD = "Smbdcz25";
const AUTH_KEY = "chillzone_auth";

export const login = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logout = () => {
  sessionStorage.removeItem(AUTH_KEY);
};

export const isLoggedIn = (): boolean => {
  return sessionStorage.getItem(AUTH_KEY) === "true";
};
