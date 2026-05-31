import { Navigate, Outlet, useLocation } from "react-router-dom";
import { sessionStore } from "@/lib/session";
import { isTokenLikelyExpired } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roleHome";
import type { UserRole } from "@/types/api";

type RequireAuthProps = {
  allowedRoles?: UserRole[];
};

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const token = sessionStore.getToken();
  const user = sessionStore.getUser<{ role?: UserRole }>();

  // Check if token exists and is not expired
  if (!token || !user || isTokenLikelyExpired()) {
    // Clear invalid session
    if (isTokenLikelyExpired()) {
      sessionStore.clearSession();
    }
    
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if user has required role
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return <Outlet />;
};

