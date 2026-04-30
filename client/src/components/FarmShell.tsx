import { Link, NavLink, Outlet } from "react-router-dom";
import { LineChart, Package, ShoppingBasket, Sprout, UserRound, Settings } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { InstallPWA } from "@/components/InstallPWA";
import { sessionStore } from "@/lib/session";

const navItems = [
  { to: "/buyer", label: "Buy", icon: ShoppingBasket, roles: ["buyer"] },
  { to: "/farmer", label: "Farmer", icon: Sprout, roles: ["farmer"] },
  { to: "/admin", label: "Admin", icon: LineChart, roles: ["admin"] },
  { to: "/prices", label: "Prices", icon: LineChart, roles: ["farmer", "buyer"] },
  { to: "/listings", label: "Mine", icon: Package, roles: ["farmer"] },
  { to: "/profile", label: "Profile", icon: UserRound, roles: ["farmer", "buyer", "admin"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["farmer", "buyer", "admin"] },
];

export const FarmShell = () => {
  const { data } = useCurrentUser();
  const sessionUser = sessionStore.getUser<{ name?: string; role?: "farmer" | "buyer" | "admin"; profilePicture?: string }>();
  const user = data?.user ?? sessionUser;
  const firstName = user?.name.split(" ")[0];
  const isLoggedIn = Boolean(user);
  
  // Filter nav items based on user role
  const visibleNavItems = user?.role
    ? navItems.filter(item => item.roles.includes(user.role))
    : navItems;

  // Get mobile nav items (limit to 5 most important)
  const mobileNavItems = user?.role === "farmer"
    ? visibleNavItems.filter(item => ["Farmer", "Mine", "Prices", "Profile", "Settings"].includes(item.label))
    : user?.role === "buyer"
    ? visibleNavItems.filter(item => ["Buy", "Prices", "Profile", "Settings"].includes(item.label))
    : user?.role === "admin"
    ? visibleNavItems.filter(item => ["Admin", "Prices", "Profile", "Settings"].includes(item.label))
    : visibleNavItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-black text-primary" aria-label="Farm Produce Marketplace home">
            <span className="grid size-9 sm:size-10 place-items-center rounded-xl sm:rounded-2xl bg-surface-leaf text-xl sm:text-2xl shadow-touch">🌾</span>
            <span className="leading-tight text-sm sm:text-base">Farm Market</span>
          </Link>
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex min-h-10 sm:min-h-11 items-center gap-1.5 sm:gap-2 rounded-full border bg-card px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow-touch transition hover:bg-surface-leaf"
              aria-label="Open user profile"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="size-5 sm:size-6 rounded-full object-cover border border-primary"
                />
              ) : (
                <UserRound className="size-4 sm:size-5 text-primary" aria-hidden="true" />
              )}
              <span className="hidden xs:inline sm:inline">{firstName || "Profile"}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border bg-card px-3 py-2 text-xs sm:text-sm font-bold shadow-touch transition hover:bg-surface-leaf"
              >
                Sign In
              </Link>
              <Link
                to="/create-account"
                className="rounded-full bg-primary px-3 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-touch transition hover:opacity-90"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className={`mx-auto max-w-5xl px-3 sm:px-4 pt-3 sm:pt-4 ${isLoggedIn ? "pb-20 sm:pb-24 md:pb-8" : "pb-24 sm:pb-28 md:pb-8"}`}>
        <Outlet />
      </main>

      {/* PWA Install Prompt */}
      <InstallPWA />

      {/* Mobile Bottom Navigation */}
      {isLoggedIn && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface-leaf safe-bottom shadow-soft md:hidden" aria-label="Main navigation">
          <div className="grid grid-cols-5 px-1 pt-1.5 pb-1">
            {mobileNavItems.slice(0, 5).map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-touch"
                      : "text-muted-foreground hover:bg-surface-warm"
                  }`
                }
              >
                <Icon className="size-5" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};
