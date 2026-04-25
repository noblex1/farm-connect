import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getMyListings,
  getSingleListing,
  markListingSold,
  updateListing,
} from "../controllers/listingController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createListingValidation,
  listingIdValidation,
  listingQueryValidation,
  updateListingValidation,
} from "../utils/validators.js";
import { listingCreateLimiter } from "../middlewares/rateLimiter.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", listingQueryValidation, validateRequest, getAllListings);
router.get("/me", protect, authorize("farmer"), getMyListings);
router.get("/:id", listingIdValidation, validateRequest, getSingleListing);

router.post("/", listingCreateLimiter, protect, authorize("farmer"), upload.array("images", 5), createListingValidation, validateRequest, createListing);
router.put("/:id", listingCreateLimiter, protect, authorize("farmer"), updateListingValidation, validateRequest, updateListing);
router.delete("/:id", listingCreateLimiter, protect, authorize("farmer"), listingIdValidation, validateRequest, deleteListing);
router.patch("/:id/sold", listingCreateLimiter, protect, authorize("farmer"), listingIdValidation, validateRequest, markListingSold);

export default router;
