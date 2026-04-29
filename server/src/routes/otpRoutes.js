import express from "express";
import {
  registerWithOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
} from "../controllers/otpController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  registerOTPValidation,
  verifyOTPValidation,
  resendOTPValidation,
  requestPasswordResetValidation,
  verifyPasswordResetOTPValidation,
  resetPasswordValidation,
} from "../utils/validators.js";

const router = express.Router();

// Registration with OTP
router.post("/register", registerOTPValidation, validateRequest, registerWithOTP);
router.post("/verify-registration", verifyOTPValidation, validateRequest, verifyRegistrationOTP);
router.post("/resend-registration-otp", resendOTPValidation, validateRequest, resendRegistrationOTP);

// Password reset with OTP
router.post("/forgot-password", requestPasswordResetValidation, validateRequest, requestPasswordReset);
router.post("/verify-reset-otp", verifyPasswordResetOTPValidation, validateRequest, verifyPasswordResetOTP);
router.post("/reset-password", resetPasswordValidation, validateRequest, resetPassword);

export default router;
