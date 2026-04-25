import { apiRequest } from "./apiClient";
import type { AuthResponse, CurrentUserResponse, ListingsResponse, MarketPricesResponse } from "@/types/api";

export const registerUser = (payload: {
  name: string;
  phoneNumber: string;
  role: "farmer" | "buyer";
  location: string;
}) =>
  apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload: { phoneNumber: string }) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchListings = (query: URLSearchParams = new URLSearchParams()) =>
  apiRequest<ListingsResponse>(`/listings?${query.toString()}`);

export const fetchMyListings = (token: string, query: URLSearchParams = new URLSearchParams()) =>
  apiRequest<ListingsResponse>(`/listings/me?${query.toString()}`, { token });

export const createListing = (
  token: string,
  payload: {
    cropType: "maize" | "rice" | "yam";
    quantity: number;
    unit?: string;
    price: number;
    location: string;
    images?: File[];
  }
) => {
  const formData = new FormData();
  formData.append("cropType", payload.cropType);
  formData.append("quantity", String(payload.quantity));
  formData.append("price", String(payload.price));
  formData.append("location", payload.location);
  if (payload.unit) {
    formData.append("unit", payload.unit);
  }
  payload.images?.forEach((file) => formData.append("images", file));

  return apiRequest<{ message: string }>("/listings", {
    method: "POST",
    token,
    body: formData,
  });
};

export const markListingSold = (token: string, id: string) =>
  apiRequest<{ message: string }>(`/listings/${id}/sold`, {
    method: "PATCH",
    token,
  });

export const deleteListing = (token: string, id: string) =>
  apiRequest<{ message: string }>(`/listings/${id}`, {
    method: "DELETE",
    token,
  });

export const fetchMarketPrices = () => apiRequest<MarketPricesResponse>("/prices");

export const fetchCurrentUser = (token: string) =>
  apiRequest<CurrentUserResponse>("/auth/me", {
    token,
  });

export const updateCurrentUser = (
  token: string,
  payload: { name?: string; location?: string; email?: string; whatsappNumber?: string; profilePicture?: File | null }
) => {
  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }
  if (payload.location !== undefined) {
    formData.append("location", payload.location);
  }
  if (payload.email !== undefined) {
    formData.append("email", payload.email);
  }
  if (payload.whatsappNumber !== undefined) {
    formData.append("whatsappNumber", payload.whatsappNumber);
  }
  if (payload.profilePicture) {
    formData.append("profilePicture", payload.profilePicture);
  }

  return apiRequest<{ message: string; user: CurrentUserResponse["user"] }>("/auth/me", {
    method: "PUT",
    token,
    body: formData,
  });
};
