import type { UserRole } from "@/types/api";

/** Authenticated user's app home — not the public marketing landing page. */
export const getRoleHomePath = (role: UserRole | string): string => {
  switch (role) {
    case "buyer":
      return "/buyer";
    case "farmer":
      return "/listings";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
};
