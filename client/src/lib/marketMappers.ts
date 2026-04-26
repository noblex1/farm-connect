import type { ApiListing, ApiMarketPrice } from "@/types/api";

const cropMeta: Record<"maize" | "rice" | "yam", { label: string; icon: string }> = {
  maize: { label: "Maize", icon: "🌽" },
  rice: { label: "Rice", icon: "🌾" },
  yam: { label: "Yam", icon: "🍠" },
};

const cedi = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

export const toProduceCard = (item: ApiListing) => ({
  id: item.id,
  crop: cropMeta[item.cropType].label,
  icon: cropMeta[item.cropType].icon,
  price: cedi.format(item.price),
  quantity: `${item.quantity} ${item.unit}${item.quantity > 1 ? "s" : ""}`,
  location: item.location,
  farmer: item.farmer?.name || "Farmer",
  phone: item.farmer?.phoneNumber || "",
  images: item.images || [],
  status: item.status,
  createdAt: item.createdAt,
});

export const toPriceCard = (item: ApiMarketPrice) => ({
  crop: cropMeta[item.cropType].label,
  icon: cropMeta[item.cropType].icon,
  price: cedi.format(item.currentPrice),
  unit: item.unit,
  change: item.trend === "same" ? "up" : item.trend,
  note: `${item.change > 0 ? "+" : ""} ${cedi.format(item.change)}`,
});
