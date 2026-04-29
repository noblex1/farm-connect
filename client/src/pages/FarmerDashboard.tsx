import { LineChart, Package, PlusCircle, User } from "lucide-react";
import { ActionTile } from "@/components/ActionTile";
import { OfflineNotice } from "@/components/OfflineNotice";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const FarmerDashboard = () => {
  const { data, isLoading } = useCurrentUser();

  const user = data?.user;
  const firstName = user?.name.split(" ")[0] || "Farmer";

  return (
    <section className="animate-gentle-rise">
      <OfflineNotice />
      <div className="mb-4 sm:mb-5 rounded-2xl sm:rounded-3xl bg-surface-leaf p-4 sm:p-5 shadow-touch">
        {isLoading ? (
          <>
            <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 mb-2" />
            <Skeleton className="h-8 sm:h-10 w-56 sm:w-64" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-muted-foreground">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="size-8 sm:size-10 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <User className="size-8 sm:size-10 rounded-full border-2 border-primary p-1" />
              )}
              <span>Welcome, {firstName}</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-black">What do you want to do?</h1>
          </>
        )}
      </div>
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
        <ActionTile to="/post" icon={PlusCircle} emoji="➕" title="Post Produce" />
        <ActionTile to="/listings" icon={Package} emoji="📦" title="My Listings" tone="warm" />
        <ActionTile to="/prices" icon={LineChart} emoji="💰" title="Market Prices" tone="earth" />
      </div>
    </section>
  );
};

export default FarmerDashboard;
