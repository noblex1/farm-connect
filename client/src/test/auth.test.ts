import { describe, it, expect, beforeEach } from "vitest";
import { sessionStore } from "@/lib/session";
import { logout, hasRole, getCurrentRole, isTokenLikelyExpired } from "@/lib/auth";

describe("Authentication Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("sessionStore", () => {
    it("should store and retrieve token", () => {
      const token = "test-token-123";
      sessionStore.setToken(token);
      expect(sessionStore.getToken()).toBe(token);
    });

    it("should store and retrieve user", () => {
      const user = { id: "1", name: "Test User", role: "farmer" };
      sessionStore.setUser(user);
      const retrieved = sessionStore.getUser();
      expect(retrieved).toEqual(user);
    });

    it("should clear session", () => {
      sessionStore.setToken("token");
      sessionStore.setUser({ id: "1" });
      sessionStore.clearSession();
      expect(sessionStore.getToken()).toBe("");
      expect(sessionStore.getUser()).toBeNull();
    });

    it("should check authentication status", () => {
      expect(sessionStore.isAuthenticated()).toBe(false);
      sessionStore.setToken("token");
      sessionStore.setUser({ id: "1" });
      expect(sessionStore.isAuthenticated()).toBe(true);
    });
  });

  describe("hasRole", () => {
    it("should return false when no user", () => {
      expect(hasRole("farmer")).toBe(false);
    });

    it("should check single role", () => {
      sessionStore.setUser({ role: "farmer" });
      expect(hasRole("farmer")).toBe(true);
      expect(hasRole("buyer")).toBe(false);
    });

    it("should check multiple roles", () => {
      sessionStore.setUser({ role: "farmer" });
      expect(hasRole(["farmer", "buyer"])).toBe(true);
      expect(hasRole(["buyer", "admin"])).toBe(false);
    });
  });

  describe("getCurrentRole", () => {
    it("should return null when no user", () => {
      expect(getCurrentRole()).toBeNull();
    });

    it("should return user role", () => {
      sessionStore.setUser({ role: "farmer" });
      expect(getCurrentRole()).toBe("farmer");
    });
  });

  describe("isTokenLikelyExpired", () => {
    it("should return true when no token", () => {
      expect(isTokenLikelyExpired()).toBe(true);
    });

    it("should return true for invalid token format", () => {
      sessionStore.setToken("invalid-token");
      expect(isTokenLikelyExpired()).toBe(true);
    });

    it("should check expiration for valid JWT", () => {
      // Create a mock JWT with future expiration
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const payload = btoa(JSON.stringify({ exp: futureExp }));
      const mockToken = `header.${payload}.signature`;
      
      sessionStore.setToken(mockToken);
      expect(isTokenLikelyExpired()).toBe(false);
    });

    it("should detect expired JWT", () => {
      // Create a mock JWT with past expiration
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const payload = btoa(JSON.stringify({ exp: pastExp }));
      const mockToken = `header.${payload}.signature`;
      
      sessionStore.setToken(mockToken);
      expect(isTokenLikelyExpired()).toBe(true);
    });
  });
});
