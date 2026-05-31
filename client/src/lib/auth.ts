import { sessionStore } from "./session";

/**
 * Logout user and clear all session data
 */
export const logout = () => {
  sessionStore.clearSession();
  window.location.href = "/";
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: string | string[]): boolean => {
  const user = sessionStore.getUser<{ role?: string }>();
  if (!user?.role) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
};

/**
 * Get current user role
 */
export const getCurrentRole = (): string | null => {
  const user = sessionStore.getUser<{ role?: string }>();
  return user?.role || null;
};

/**
 * Check if token is likely expired (basic check without decoding)
 */
export const isTokenLikelyExpired = (): boolean => {
  const token = sessionStore.getToken();
  if (!token) return true;
  
  try {
    // Basic JWT structure check
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    
    // Decode payload (without verification)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    }
    
    return false;
  } catch {
    return true;
  }
};
