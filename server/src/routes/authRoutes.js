import express from "express";
import { getCurrentUser, loginUser, registerUser, updateCurrentUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { loginValidation, registerValidation, updateProfileValidation } from "../utils/validators.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, upload.single("profilePicture"), updateProfileValidation, validateRequest, updateCurrentUser);

export default router;
