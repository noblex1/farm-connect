import { Navigate } from "react-router-dom";
import NewLanding from "@/pages/NewLanding";
import { sessionStore } from "@/lib/session";
import { isTokenLikelyExpired } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roleHome";
import type { UserRole } from "@/types/api";

/** Public marketing page at `/` — only for guests. Signed-in users go to their app home. */
export const GuestOnlyLanding = () => {
  const token = sessionStore.getToken();
  const user = sessionStore.getUser<{ role?: UserRole }>();

  if (token && user?.role && !isTokenLikelyExpired()) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  return <NewLanding />;
};
