import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, LineChart, Package, ShoppingBasket, Sprout, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { sessionStore } from "@/lib/session";
import { fetchCurrentUser } from "@/services/marketApi";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/buyer", label: "Buy", icon: ShoppingBasket },
  { to: "/farmer", label: "Farmer", icon: Sprout },
  { to: "/prices", label: "Prices", icon: LineChart },
  { to: "/listings", label: "Mine", icon: Package },
];

export const FarmShell = () => {
  const token = sessionStore.getToken();

  const { data } = useQuery({
    queryKey: ["currentUser", token],
    queryFn: () => fetchCurrentUser(token!),
    enabled: Boolean(token),
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const user = data?.user;
  const firstName = user?.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-black text-primary" aria-label="Farm Produce Marketplace home">
            <span className="grid size-10 place-items-center rounded-2xl bg-surface-leaf text-2xl shadow-touch">🌾</span>
            <span className="leading-tight">Farm Market</span>
          </Link>
          <Link
            to="/profile"
            className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm font-bold shadow-touch transition hover:bg-surface-leaf"
            aria-label="Open user profile"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="size-6 rounded-full object-cover border border-primary"
              />
            ) : (
              <UserRound className="size-5 text-primary" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{firstName || "Profile"}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-4 md:pb-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/98 safe-bottom shadow-soft md:hidden" aria-label="Main navigation">
        <div className="grid grid-cols-5 px-1 pt-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-bold transition ${
                  isActive ? "bg-surface-leaf text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
