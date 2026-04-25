import MarketPrice from "../models/MarketPrice.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { marketPriceResponseShape } from "../services/responseService.js";

export const getMarketPrices = asyncHandler(async (req, res) => {
  const prices = await MarketPrice.find({}).sort({ cropType: 1 }).lean();

  res.status(200).json({
    data: prices.map(marketPriceResponseShape),
    count: prices.length,
  });
});

export const upsertMarketPrices = asyncHandler(async (req, res) => {
  const incomingPrices = req.body.prices;

  const results = await Promise.all(
    incomingPrices.map(async (item) => {
      const existing = await MarketPrice.findOne({ cropType: item.cropType });
      const previousPrice = existing ? existing.currentPrice : 0;

      const updated = await MarketPrice.findOneAndUpdate(
        { cropType: item.cropType },
        {
          $set: {
            currentPrice: item.currentPrice,
            previousPrice,
            location: item.location || existing?.location || "Tamale",
            unit: item.unit || existing?.unit || "100kg",
            lastUpdated: new Date(),
          },
        },
        { new: true, upsert: true }
      ).lean();

      return marketPriceResponseShape(updated);
    })
  );

  res.status(200).json({
    message: "Market prices updated",
    data: results,
  });
});
