import { BarChart3, DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "@/services/adminApi";
import { sessionStore } from "@/lib/session";

const AdminDashboard = () => {
  const token = sessionStore.getToken();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => fetchAdminStats(token),
    enabled: !!token,
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      description: `${stats?.farmers || 0} farmers, ${stats?.buyers || 0} buyers`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-surface-leaf",
      link: "/admin/users",
    },
    {
      title: "Active Listings",
      value: stats?.activeListings || 0,
      description: `${stats?.soldListings || 0} sold this month`,
      icon: Package,
      color: "text-secondary",
      bgColor: "bg-surface-warm",
      link: "/admin/listings",
    },
    {
      title: "Total Revenue",
      value: `₵${stats?.totalRevenue?.toLocaleString() || 0}`,
      description: "From all transactions",
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-green-50",
      link: "/admin/analytics",
    },
    {
      title: "Market Activity",
      value: `${stats?.recentActivity || 0}%`,
      description: "Activity increase this week",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-yellow-50",
      link: "/admin/analytics",
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-gentle-rise space-y-6">
        <div className="rounded-3xl border bg-card p-6">
          <div className="h-8 w-48 animate-pulse rounded-2xl bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-gentle-rise space-y-6">
      {/* Header */}
      <header className="rounded-3xl border bg-gradient-to-br from-primary/10 via-surface-leaf to-accent/10 p-6 shadow-touch">
        <div className="flex items-center gap-3">
          <div className="grid size-16 place-items-center rounded-3xl bg-primary text-4xl text-primary-foreground shadow-touch">
            <BarChart3 className="size-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">Admin Dashboard</h1>
            <p className="text-lg font-semibold text-muted-foreground">Manage your farm marketplace</p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="group cursor-pointer rounded-3xl border-2 shadow-touch transition-all hover:scale-105 hover:border-primary hover:shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold">{stat.title}</CardTitle>
                <div className={`rounded-2xl ${stat.bgColor} p-2`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{stat.value}</div>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/users">
          <Card className="group cursor-pointer rounded-3xl border-2 shadow-touch transition-all hover:scale-105 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-6 text-primary" />
                Manage Users
              </CardTitle>
              <CardDescription className="font-semibold">View and manage farmers and buyers</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/listings">
          <Card className="group cursor-pointer rounded-3xl border-2 shadow-touch transition-all hover:scale-105 hover:border-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-6 text-secondary" />
                Manage Listings
              </CardTitle>
              <CardDescription className="font-semibold">Monitor and moderate produce listings</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/prices">
          <Card className="group cursor-pointer rounded-3xl border-2 shadow-touch transition-all hover:scale-105 hover:border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-6 text-accent" />
                Market Prices
              </CardTitle>
              <CardDescription className="font-semibold">Update and manage market prices</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-6 text-success" />
            Recent Activity
          </CardTitle>
          <CardDescription className="font-semibold">Latest actions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl border bg-surface-leaf p-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-xl">
                  {activity.type === "user" ? "👤" : activity.type === "listing" ? "📦" : "💰"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
