const TOKEN_KEY = "farm-market-token";
const USER_KEY = "farm-market-user";

export const sessionStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || "",
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  setUser: (user: object) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: <T>() => {
    try {
      const value = localStorage.getItem(USER_KEY);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },
};
