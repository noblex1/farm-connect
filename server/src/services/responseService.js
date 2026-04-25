export const listingResponseShape = (listingDoc) => ({
  id: listingDoc._id,
  cropType: listingDoc.cropType,
  quantity: listingDoc.quantity,
  unit: listingDoc.unit,
  price: listingDoc.price,
  location: listingDoc.location,
  status: listingDoc.status,
  images: listingDoc.images,
  createdAt: listingDoc.createdAt,
  farmer: listingDoc.farmerId
    ? {
        id: listingDoc.farmerId._id,
        name: listingDoc.farmerId.name,
        phoneNumber: listingDoc.farmerId.phoneNumber,
        location: listingDoc.farmerId.location,
        profilePicture: listingDoc.farmerId.profilePicture || "",
      }
    : undefined,
});

export const userResponseShape = (userDoc) => ({
  id: userDoc._id,
  name: userDoc.name,
  phoneNumber: userDoc.phoneNumber,
  role: userDoc.role,
  location: userDoc.location,
  profilePicture: userDoc.profilePicture || "",
  email: userDoc.email || "",
  whatsappNumber: userDoc.whatsappNumber || userDoc.phoneNumber,
  createdAt: userDoc.createdAt,
});

export const marketPriceResponseShape = (priceDoc) => {
  const trend =
    priceDoc.currentPrice > priceDoc.previousPrice
      ? "up"
      : priceDoc.currentPrice < priceDoc.previousPrice
      ? "down"
      : "same";

  return {
    cropType: priceDoc.cropType,
    currentPrice: priceDoc.currentPrice,
    previousPrice: priceDoc.previousPrice,
    trend,
    change: Number((priceDoc.currentPrice - priceDoc.previousPrice).toFixed(2)),
    unit: priceDoc.unit,
    location: priceDoc.location,
    lastUpdated: priceDoc.lastUpdated,
  };
};
