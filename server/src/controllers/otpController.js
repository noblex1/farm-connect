import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { signToken, sanitizePhoneNumber } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userResponseShape } from "../services/responseService.js";
import { generateOTP, sendRegistrationOTP, sendPasswordResetOTP } from "../services/emailService.js";

/**
 * Step 1: Register user and send OTP
 */
export const registerWithOTP = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, role, location } = req.body;
  const normalizedPhone = sanitizePhoneNumber(phoneNumber);
  const normalizedEmail = email.toLowerCase().trim();

  // Validation
  if (!normalizedPhone || normalizedPhone.length < 9) {
    const error = new Error("Invalid phone number format");
    error.statusCode = 400;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    error.statusCode = 400;
    throw error;
  }

  if (!["farmer", "buyer"].includes(role)) {
    const error = new Error("Invalid role. Must be 'farmer' or 'buyer'");
    error.statusCode = 400;
    throw error;
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    const error = new Error("Email already registered. Please login instead.");
    error.statusCode = 409;
    throw error;
  }

  // Check if phone number already exists
  const existingPhone = await User.findOne({ phoneNumber: normalizedPhone });
  if (existingPhone) {
    const error = new Error("Phone number already registered. Please login instead.");
    error.statusCode = 409;
    throw error;
  }

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  console.log("📧 Generated OTP for registration:", otp);
  console.log("📧 Sending to email:", normalizedEmail);
  console.log("📧 User name:", name.trim());

  // Store OTP in database
  await OTP.create({
    email: normalizedEmail,
    otp,
    type: "registration",
    expiresAt,
  });

  console.log("✅ OTP stored in database");

  // Send OTP email - DO NOT catch errors, let them propagate
  console.log("📧 Attempting to send registration OTP email...");
  await sendRegistrationOTP(normalizedEmail, otp, name.trim());
  console.log("✅ Registration OTP email sent successfully!");

  // Return success
  res.status(200).json({
    message: "OTP sent to your email. Please verify to complete registration.",
    email: normalizedEmail,
    requiresVerification: true,
  });
});

/**
 * Step 2: Verify OTP and complete registration
 */
export const verifyRegistrationOTP = asyncHandler(async (req, res) => {
  const { email, otp, name, phoneNumber, password, role, location } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = sanitizePhoneNumber(phoneNumber);

  // Find valid OTP
  const otpRecord = await OTP.findOne({
    email: normalizedEmail,
    otp,
    type: "registration",
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    const error = new Error("Invalid or expired OTP. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  // Mark OTP as verified
  otpRecord.verified = true;
  await otpRecord.save();

  // Create user account
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phoneNumber: normalizedPhone,
    password,
    role,
    location: location.trim(),
    whatsappNumber: normalizedPhone,
  });

  const token = signToken(user);

  res.status(201).json({
    message: "Registration successful! Your account has been verified.",
    token,
    user: userResponseShape(user),
  });
});

/**
 * Resend OTP for registration
 */
export const resendRegistrationOTP = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("Email already registered. Please login instead.");
    error.statusCode = 409;
    throw error;
  }

  // Delete old OTPs for this email
  await OTP.deleteMany({ email: normalizedEmail, type: "registration" });

  // Generate new OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  console.log("📧 Generated new OTP for resend:", otp);
  console.log("📧 Sending to email:", normalizedEmail);

  await OTP.create({
    email: normalizedEmail,
    otp,
    type: "registration",
    expiresAt,
  });

  // Send OTP email
  console.log("📧 Attempting to resend registration OTP email...");
  await sendRegistrationOTP(normalizedEmail, otp, name || "User");
  console.log("✅ Registration OTP email resent successfully!");

  res.status(200).json({
    message: "New OTP sent to your email.",
  });
});

/**
 * Step 1: Request password reset OTP
 */
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // Find user
  const user = await User.findOne({ email: normalizedEmail });
  
  // Always return success to prevent email enumeration
  if (!user) {
    res.status(200).json({
      message: "If an account exists with this email, you will receive a password reset OTP.",
    });
    return;
  }

  // Delete old OTPs for this email
  await OTP.deleteMany({ email: normalizedEmail, type: "password-reset" });

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  console.log("📧 Generated OTP for password reset:", otp);
  console.log("📧 Sending to email:", normalizedEmail);
  console.log("📧 User name:", user.name);

  await OTP.create({
    email: normalizedEmail,
    otp,
    type: "password-reset",
    expiresAt,
  });

  // Send OTP email
  console.log("📧 Attempting to send password reset OTP email...");
  await sendPasswordResetOTP(normalizedEmail, otp, user.name);
  console.log("✅ Password reset OTP email sent successfully!");

  res.status(200).json({
    message: "If an account exists with this email, you will receive a password reset OTP.",
    email: normalizedEmail,
  });
});

/**
 * Step 2: Verify OTP for password reset
 */
export const verifyPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // Find valid OTP
  const otpRecord = await OTP.findOne({
    email: normalizedEmail,
    otp,
    type: "password-reset",
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    const error = new Error("Invalid or expired OTP. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  // Mark OTP as verified (but don't delete yet - needed for password reset)
  otpRecord.verified = true;
  await otpRecord.save();

  res.status(200).json({
    message: "OTP verified successfully. You can now reset your password.",
    resetToken: otpRecord._id.toString(), // Use OTP ID as reset token
  });
});

/**
 * Step 3: Reset password with verified OTP
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (!newPassword || newPassword.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    error.statusCode = 400;
    throw error;
  }

  // Verify reset token (OTP ID)
  const otpRecord = await OTP.findOne({
    _id: resetToken,
    email: normalizedEmail,
    type: "password-reset",
    verified: true,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    const error = new Error("Invalid or expired reset token. Please start over.");
    error.statusCode = 400;
    throw error;
  }

  // Find user and update password
  const user = await User.findOne({ email: normalizedEmail });
  
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  // Delete used OTP
  await OTP.deleteOne({ _id: resetToken });

  res.status(200).json({
    message: "Password reset successful. You can now login with your new password.",
  });
});
