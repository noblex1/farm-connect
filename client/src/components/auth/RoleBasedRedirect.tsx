import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sessionStore } from "@/lib/session";
import { isTokenLikelyExpired } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roleHome";
import type { UserRole } from "@/types/api";

/** Redirects signed-in users away from login / register to their app home. */
export const RoleBasedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStore.getToken();
    const user = sessionStore.getUser<{ role?: UserRole }>();

    if (token && user?.role && !isTokenLikelyExpired()) {
      navigate(getRoleHomePath(user.role), { replace: true });
    }
  }, [navigate]);

  return null;
};
