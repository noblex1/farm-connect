export type CropType = "maize" | "rice" | "yam";

export const cropOptions = [
  { value: "maize", label: "Maize", icon: "🌽" },
  { value: "rice", label: "Rice", icon: "🍚" },
  { value: "yam", label: "Yam", icon: "🥔" },
] as const;

export const marketPrices = [
  { crop: "Maize", icon: "🌽", price: "GH₵ 420", unit: "100kg", change: "up", note: "+ GH₵ 20" },
  { crop: "Rice", icon: "🍚", price: "GH₵ 560", unit: "100kg", change: "down", note: "- GH₵ 15" },
  { crop: "Yam", icon: "🥔", price: "GH₵ 38", unit: "tuber", change: "up", note: "+ GH₵ 3" },
] as const;

export const produceListings = [
  { id: 1, crop: "Maize", icon: "🌽", price: "GH₵ 410", quantity: "12 bags", location: "Tamale", farmer: "Amina", phone: "+233201234567" },
  { id: 2, crop: "Rice", icon: "🍚", price: "GH₵ 555", quantity: "8 bags", location: "Savelugu", farmer: "Issah", phone: "+233241112222" },
  { id: 3, crop: "Yam", icon: "🥔", price: "GH₵ 36", quantity: "80 tubers", location: "Yendi", farmer: "Fati", phone: "+233271234444" },
] as const;

export const myListings = [
  { id: 1, crop: "Maize", icon: "🌽", price: "GH₵ 410", status: "Available" },
  { id: 2, crop: "Yam", icon: "🥔", price: "GH₵ 36", status: "Sold" },
] as const;
