import express from "express";
import { getMarketPrices, upsertMarketPrices } from "../controllers/priceController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { updatePricesValidation } from "../utils/validators.js";

const router = express.Router();

router.get("/", getMarketPrices);
router.post("/", protect, authorize("admin"), updatePricesValidation, validateRequest, upsertMarketPrices);

export default router;
