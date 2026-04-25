import { LineChart, Package, PlusCircle } from "lucide-react";
import { ActionTile } from "@/components/ActionTile";
import { OfflineNotice } from "@/components/OfflineNotice";

const FarmerDashboard = () => (
  <section className="animate-gentle-rise">
    <OfflineNotice />
    <div className="mb-5 rounded-3xl bg-surface-leaf p-5 shadow-touch">
      <p className="text-lg font-bold text-muted-foreground">Welcome, Amina</p>
      <h1 className="mt-1 text-4xl font-black">What do you want to do?</h1>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <ActionTile to="/post" icon={PlusCircle} emoji="➕" title="Post Produce" />
      <ActionTile to="/listings" icon={Package} emoji="📦" title="My Listings" tone="warm" />
      <ActionTile to="/prices" icon={LineChart} emoji="💰" title="Market Prices" tone="earth" />
    </div>
  </section>
);

export default FarmerDashboard;
