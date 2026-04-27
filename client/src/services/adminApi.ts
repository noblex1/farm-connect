import { apiRequest } from "./apiClient";

export const fetchAdminStats = (token: string) =>
  apiRequest<{
    totalUsers: number;
    farmers: number;
    buyers: number;
    activeListings: number;
    soldListings: number;
    totalRevenue: number;
    recentActivity: number;
    recentActivities: Array<{
      type: string;
      message: string;
      timestamp: string;
    }>;
  }>("/admin/stats", { token });

export const fetchAllUsers = (token: string) =>
  apiRequest<{ data: any[] }>("/admin/users", { token });

export const deleteUser = (token: string, userId: string) =>
  apiRequest<{ message: string }>(`/admin/users/${userId}`, {
    method: "DELETE",
    token,
  });

export const toggleUserStatus = (token: string, userId: string, status: boolean) =>
  apiRequest<{ message: string }>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ active: status }),
  });

export const fetchAllListings = (token: string) =>
  apiRequest<{ data: any[] }>("/admin/listings", { token });

export const deleteListingAdmin = (token: string, listingId: string) =>
  apiRequest<{ message: string }>(`/admin/listings/${listingId}`, {
    method: "DELETE",
    token,
  });

export const updateMarketPrices = (
  token: string,
  prices: Array<{ cropType: string; currentPrice: number }>
) =>
  apiRequest<{ message: string }>("/prices", {
    method: "POST",
    token,
    body: JSON.stringify({ prices }),
  });

export const fetchAdminAnalytics = (token: string) =>
  apiRequest<{
    totalRevenue: number;
    revenueGrowth: number;
    activeUsers: number;
    newUsersThisWeek: number;
    totalListings: number;
    activeListings: number;
    soldListings: number;
    conversionRate: number;
    cropDistribution: Array<{ cropType: string; count: number }>;
    userGrowth: Array<{ month: string; farmers: number; buyers: number }>;
    topLocations: Array<{ name: string; count: number }>;
    avgListingPrice: number;
    avgTimeToSell: number;
    engagementRate: number;
    farmers: number;
    buyers: number;
    totalUsers: number;
  }>("/admin/analytics", { token });
