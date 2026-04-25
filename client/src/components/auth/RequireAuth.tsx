import { Navigate, Outlet, useLocation } from "react-router-dom";
import { sessionStore } from "@/lib/session";
import type { UserRole } from "@/types/api";

type RequireAuthProps = {
  allowedRoles?: UserRole[];
};

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const token = sessionStore.getToken();
  const user = sessionStore.getUser<{ role?: UserRole }>();

  if (!token || !user) {
    const roleQuery = allowedRoles?.[0] ? `role=${allowedRoles[0]}&` : "";
    return <Navigate to={`/login?${roleQuery}next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    const roleQuery = allowedRoles[0] ? `role=${allowedRoles[0]}&` : "";
    return <Navigate to={`/login?${roleQuery}next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
};

