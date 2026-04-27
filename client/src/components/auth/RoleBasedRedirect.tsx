import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "@/lib/session";
import { isTokenLikelyExpired } from "@/lib/auth";

/**
 * Component that redirects authenticated users to their role-specific dashboard
 * Used on public pages like login, register, and landing page
 */
export const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStore.getToken();
    const user = sessionStore.getUser<{ role?: string }>();

    // Only redirect if user is authenticated and token is valid
    if (token && user?.role && !isTokenLikelyExpired()) {
      const roleRoutes: Record<string, string> = {
        farmer: "/farmer",
        buyer: "/buyer",
        admin: "/admin",
      };

      const targetRoute = roleRoutes[user.role];
      if (targetRoute) {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [navigate]);

  return null;
};
