import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchAdminAnalytics } from "@/services/adminApi";
import { sessionStore } from "@/lib/session";

const AdminAnalytics = () => {
  const token = sessionStore.getToken();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: () => fetchAdminAnalytics(token),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="animate-gentle-rise space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const cropDistribution = analytics?.cropDistribution || [];
  const userGrowth = analytics?.userGrowth || [];
  const revenueData = analytics?.revenueData || [];

  return (
    <div className="animate-gentle-rise space-y-6">
      {/* Header */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="grid size-12 place-items-center rounded-2xl bg-success text-2xl text-white">
              📊
            </div>
            <div>
              <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
              <CardDescription className="font-semibold">
                Platform insights and performance metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Total Revenue</CardTitle>
              <DollarSign className="size-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">₵{analytics?.totalRevenue?.toLocaleString() || 0}</p>
            <p className="mt-1 text-xs font-semibold text-success">
              +{analytics?.revenueGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Active Users</CardTitle>
              <Users className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{analytics?.activeUsers || 0}</p>
            <p className="mt-1 text-xs font-semibold text-primary">
              {analytics?.newUsersThisWeek || 0} new this week
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Total Listings</CardTitle>
              <Package className="size-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{analytics?.totalListings || 0}</p>
            <p className="mt-1 text-xs font-semibold text-secondary">
              {analytics?.activeListings || 0} currently available
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Conversion Rate</CardTitle>
              <TrendingUp className="size-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{analytics?.conversionRate || 0}%</p>
            <p className="mt-1 text-xs font-semibold text-accent">
              {analytics?.soldListings || 0} listings sold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Crop Distribution */}
        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Crop Distribution
            </CardTitle>
            <CardDescription className="font-semibold">Listings by crop type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cropDistribution.map((crop: any) => {
              const percentage = ((crop.count / analytics?.totalListings) * 100).toFixed(1);
              return (
                <div key={crop.cropType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {crop.cropType === "maize" ? "🌽" : crop.cropType === "rice" ? "🌾" : "🍠"}
                      </span>
                      <span className="font-bold capitalize">{crop.cropType}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black">{crop.count}</p>
                      <p className="text-xs font-semibold text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-secondary" />
              User Growth
            </CardTitle>
            <CardDescription className="font-semibold">New registrations by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👨‍🌾</span>
                  <span className="font-bold">Farmers</span>
                </div>
                <p className="font-black">{analytics?.farmers || 0}</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${((analytics?.farmers || 0) / (analytics?.totalUsers || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  <span className="font-bold">Buyers</span>
                </div>
                <p className="font-black">{analytics?.buyers || 0}</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{
                    width: `${((analytics?.buyers || 0) / (analytics?.totalUsers || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-surface-leaf p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-muted-foreground">Total Users</span>
                <span className="text-2xl font-black">{analytics?.totalUsers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-accent" />
              Top Locations
            </CardTitle>
            <CardDescription className="font-semibold">Most active regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.topLocations?.map((location: any, index: number) => (
                <div
                  key={location.name}
                  className="flex items-center justify-between rounded-2xl border bg-surface-warm p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-xl bg-accent/20 font-black text-accent">
                      #{index + 1}
                    </div>
                    <span className="font-bold">{location.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-black">{location.count}</p>
                    <p className="text-xs font-semibold text-muted-foreground">listings</p>
                  </div>
                </div>
              )) || <p className="text-center text-muted-foreground py-4">No data available</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trends */}
        <Card className="rounded-3xl border-2 shadow-touch">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-success" />
              Platform Trends
            </CardTitle>
            <CardDescription className="font-semibold">Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-2xl border bg-green-50 p-4">
                <p className="text-sm font-bold text-muted-foreground">Average Listing Price</p>
                <p className="text-2xl font-black text-success">
                  ₵{analytics?.avgListingPrice?.toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-2xl border bg-blue-50 p-4">
                <p className="text-sm font-bold text-muted-foreground">Avg. Time to Sell</p>
                <p className="text-2xl font-black text-blue-600">{analytics?.avgTimeToSell || 0} days</p>
              </div>
              <div className="rounded-2xl border bg-purple-50 p-4">
                <p className="text-sm font-bold text-muted-foreground">User Engagement</p>
                <p className="text-2xl font-black text-purple-600">{analytics?.engagementRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
