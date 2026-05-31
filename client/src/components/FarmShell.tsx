import { Link, NavLink, Outlet } from "react-router-dom";
import { LineChart, Package, ShoppingBasket, Sprout, UserRound, Settings, Heart } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { InstallPWA } from "@/components/InstallPWA";
import { sessionStore } from "@/lib/session";

const navItems = [
  { to: "/buyer", label: "Buy", icon: ShoppingBasket, roles: ["buyer"] },
  { to: "/farmer", label: "Farmer", icon: Sprout, roles: ["farmer"] },
  { to: "/admin", label: "Admin", icon: LineChart, roles: ["admin"] },
  { to: "/prices", label: "Prices", icon: LineChart, roles: ["farmer", "buyer"] },
  { to: "/favorites", label: "Saved", icon: Heart, roles: ["buyer"] },
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
    ? visibleNavItems.filter(item => ["Buy", "Saved", "Prices", "Profile", "Settings"].includes(item.label))
    : user?.role === "admin"
    ? visibleNavItems.filter(item => ["Admin", "Prices", "Profile", "Settings"].includes(item.label))
    : visibleNavItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 font-black text-foreground hover:text-primary transition-colors" aria-label="Farm Produce Marketplace home">
            <span className="grid size-10 sm:size-11 place-items-center rounded-xl sm:rounded-2xl bg-surface-leaf text-2xl sm:text-3xl shadow-sm">🌾</span>
            <span className="leading-tight text-base sm:text-lg lg:text-xl">Farm Market</span>
          </Link>
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex min-h-10 sm:min-h-11 items-center gap-2 rounded-full border bg-card px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold shadow-sm transition hover:bg-surface-leaf hover:border-primary"
              aria-label="Open user profile"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="size-6 sm:size-7 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <UserRound className="size-5 sm:size-6 text-primary" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{firstName || "Profile"}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="rounded-full border-2 border-border bg-background px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition hover:border-primary hover:bg-surface-leaf"
              >
                Sign In
              </Link>
              <Link
                to="/create-account"
                className="rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        {isLoggedIn && (
          <aside className="hidden md:block w-64 lg:w-72 border-r bg-card/50 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto" aria-label="Main navigation">
            <nav className="p-4 space-y-2">
              {visibleNavItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-surface-leaf hover:text-primary"
                    }`
                  }
                >
                  <Icon className="size-5 flex-shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 ${isLoggedIn ? "pb-20 md:pb-12" : "pb-8 sm:pb-12"}`}>
          <Outlet />
        </main>
      </div>

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
