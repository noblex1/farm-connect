export type UserRole = "farmer" | "buyer" | "admin";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  location: string;
  profilePicture?: string;
  whatsappNumber?: string;
  createdAt?: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: ApiUser;
};

export type CurrentUserResponse = {
  user: ApiUser;
};

export type ListingStatus = "available" | "sold";

export type ApiListing = {
  id: string;
  cropType: "maize" | "rice" | "yam";
  quantity: number;
  unit: string;
  price: number;
  location: string;
  status: ListingStatus;
  images: string[];
  createdAt: string;
  farmer?: {
    id: string;
    name: string;
    phoneNumber: string;
    location: string;
    profilePicture?: string;
  };
};

export type ListingsResponse = {
  data: ApiListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

export type ApiMarketPrice = {
  cropType: "maize" | "rice" | "yam";
  currentPrice: number;
  previousPrice: number;
  trend: "up" | "down" | "same";
  change: number;
  unit: string;
  location: string;
  lastUpdated: string;
};

export type MarketPricesResponse = {
  data: ApiMarketPrice[];
  count: number;
};
