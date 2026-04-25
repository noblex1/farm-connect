import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cropType: {
      type: String,
      enum: ["maize", "rice", "yam"],
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      trim: true,
      default: "bag",
      maxlength: 20,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (val) => val.length <= 5,
        message: "You can upload up to 5 images",
      },
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

listingSchema.index({ cropType: 1, location: 1, price: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
