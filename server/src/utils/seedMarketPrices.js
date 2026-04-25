import dotenv from "dotenv";
import connectDB from "../config/db.js";
import MarketPrice from "../models/MarketPrice.js";

dotenv.config();

const defaults = [
  { cropType: "maize", currentPrice: 420, previousPrice: 400, location: "Tamale", unit: "100kg" },
  { cropType: "rice", currentPrice: 560, previousPrice: 575, location: "Tamale", unit: "100kg" },
  { cropType: "yam", currentPrice: 38, previousPrice: 35, location: "Tamale", unit: "tuber" },
];

const seed = async () => {
  await connectDB();

  await Promise.all(
    defaults.map((item) =>
      MarketPrice.findOneAndUpdate(
        { cropType: item.cropType },
        { $set: { ...item, lastUpdated: new Date() } },
        { upsert: true, new: true }
      )
    )
  );

  console.log("Market prices seeded");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
