import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildListingFilter, parsePagination } from "../services/listingService.js";
import { listingResponseShape } from "../services/responseService.js";
import { uploadListingImages } from "../services/uploadService.js";

export const createListing = asyncHandler(async (req, res) => {
  const uploadedImages = req.files?.length ? await uploadListingImages(req.files) : [];

  const listing = await Listing.create({
    farmerId: req.user._id,
    cropType: req.body.cropType,
    quantity: Number(req.body.quantity),
    unit: req.body.unit || "bag",
    price: Number(req.body.price),
    location: req.body.location,
    images: uploadedImages,
    status: "available",
  });

  const populated = await Listing.findById(listing._id).populate("farmerId", "name phoneNumber location profilePicture");

  res.status(201).json({
    message: "Listing created",
    listing: listingResponseShape(populated),
  });
});

export const getAllListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildListingFilter(req.query);

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .select("cropType quantity unit price location images status createdAt farmerId")
      .populate("farmerId", "name phoneNumber location profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Listing.countDocuments(filter),
  ]);

  res.status(200).json({
    data: items.map(listingResponseShape),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + items.length < total,
    },
  });
});

export const getMyListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { farmerId: req.user._id };

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .select("cropType quantity unit price location images status createdAt farmerId")
      .populate("farmerId", "name phoneNumber location profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Listing.countDocuments(filter),
  ]);

  res.status(200).json({
    data: items.map(listingResponseShape),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + items.length < total,
    },
  });
});

export const getSingleListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .select("cropType quantity unit price location images status createdAt farmerId")
    .populate("farmerId", "name phoneNumber location profilePicture")
    .lean();

  if (!listing) {
    const error = new Error("Listing not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ listing: listingResponseShape(listing) });
});

const ensureOwner = async (listingId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    const error = new Error("Invalid listing ID");
    error.statusCode = 400;
    throw error;
  }

  const listing = await Listing.findById(listingId);

  if (!listing) {
    const error = new Error("Listing not found");
    error.statusCode = 404;
    throw error;
  }

  if (listing.farmerId.toString() !== userId.toString()) {
    const error = new Error("You can only manage your own listings");
    error.statusCode = 403;
    throw error;
  }

  return listing;
};

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await ensureOwner(req.params.id, req.user._id);

  ["cropType", "quantity", "unit", "price", "location", "images", "status"].forEach((field) => {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  });

  await listing.save();
  const updated = await Listing.findById(listing._id).populate("farmerId", "name phoneNumber location profilePicture");

  res.status(200).json({
    message: "Listing updated",
    listing: listingResponseShape(updated),
  });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await ensureOwner(req.params.id, req.user._id);
  await listing.deleteOne();

  res.status(200).json({ message: "Listing deleted" });
});

export const markListingSold = asyncHandler(async (req, res) => {
  const listing = await ensureOwner(req.params.id, req.user._id);
  listing.status = "sold";
  await listing.save();

  const updated = await Listing.findById(listing._id).populate("farmerId", "name phoneNumber location profilePicture");

  res.status(200).json({
    message: "Listing marked as sold",
    listing: listingResponseShape(updated),
  });
});
