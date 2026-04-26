import { useQuery } from "@tanstack/react-query";
import { sessionStore } from "@/lib/session";
import { fetchCurrentUser } from "@/services/marketApi";
import type { ApiUser } from "@/types/api";

/**
 * Custom hook to fetch and cache current user data
 * - Uses localStorage as initial data for instant display
 * - Syncs API response back to localStorage
 * - Provides consistent user data across the app
 */
export const useCurrentUser = () => {
  const token = sessionStore.getToken();

  return useQuery({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      console.log("=== useCurrentUser: Fetching from API ===");
      const response = await fetchCurrentUser(token!);
      console.log("API response user:", response.user);
      console.log("profilePicture from API:", response.user.profilePicture);
      
      // Sync the fetched user data back to localStorage
      sessionStore.setUser(response.user);
      console.log("Saved to localStorage");
      
      // Verify it was saved
      const saved = sessionStore.getUser<ApiUser>();
      console.log("Verified localStorage:", saved);
      console.log("Verified profilePicture:", saved?.profilePicture);
      
      return response;
    },
    enabled: Boolean(token),
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    // Use localStorage as initial data for instant display
    placeholderData: () => {
      console.log("=== useCurrentUser: Getting placeholder data ===");
      const cachedUser = sessionStore.getUser<ApiUser>();
      console.log("Cached user from localStorage:", cachedUser);
      console.log("Cached profilePicture:", cachedUser?.profilePicture);
      
      if (cachedUser && token) {
        return { user: cachedUser };
      }
      return undefined;
    },
  });
};
