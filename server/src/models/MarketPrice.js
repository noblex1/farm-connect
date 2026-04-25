import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema(
  {
    cropType: {
      type: String,
      enum: ["maize", "rice", "yam"],
      required: true,
      unique: true,
      index: true,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    previousPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      default: "Tamale",
      trim: true,
      index: true,
    },
    unit: {
      type: String,
      default: "100kg",
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);

export default MarketPrice;
