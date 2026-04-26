import User from "../models/User.js";
import { signToken, sanitizePhoneNumber } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userResponseShape } from "../services/responseService.js";
import { uploadProfileImage } from "../services/uploadService.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, role, location } = req.body;
  const normalizedPhone = sanitizePhoneNumber(phoneNumber);
  const normalizedEmail = email.toLowerCase().trim();

  // Additional validation
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
    message: "Registration successful",
    token,
    user: userResponseShape(user),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    const error = new Error("Email/phone and password are required");
    error.statusCode = 400;
    throw error;
  }

  // Determine if input is email or phone
  const isEmail = emailOrPhone.includes("@");
  const searchQuery = isEmail
    ? { email: emailOrPhone.toLowerCase().trim() }
    : { phoneNumber: sanitizePhoneNumber(emailOrPhone) };

  // Find user and include password field
  const user = await User.findOne(searchQuery).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials. Please check your email/phone and password.");
    error.statusCode = 401;
    throw error;
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials. Please check your email/phone and password.");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user);

  res.status(200).json({
    message: "Login successful",
    token,
    user: userResponseShape(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  console.log("=== Get Current User Request ===");
  console.log("User ID:", req.user._id);
  
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  console.log("User found:", {
    id: user._id,
    name: user.name,
    profilePicture: user.profilePicture,
  });

  const response = userResponseShape(user);
  console.log("Response shape:", {
    id: response.id,
    name: response.name,
    profilePicture: response.profilePicture,
  });

  res.status(200).json({ user: response });
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  console.log("=== Update Current User Request ===");
  console.log("User ID:", req.user._id);
  console.log("Request body:", req.body);
  console.log("Has file:", !!req.file);
  if (req.file) {
    console.log("File details:", {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  console.log("Current user profilePicture:", user.profilePicture);

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  if (req.body.location !== undefined) {
    user.location = req.body.location;
  }

  if (req.body.email !== undefined) {
    // Check if email is already taken by another user
    const existingEmail = await User.findOne({ 
      email: req.body.email.toLowerCase().trim(),
      _id: { $ne: user._id }
    });
    if (existingEmail) {
      const error = new Error("Email already in use by another account");
      error.statusCode = 409;
      throw error;
    }
    user.email = req.body.email.toLowerCase().trim();
  }

  if (req.body.whatsappNumber !== undefined) {
    user.whatsappNumber = sanitizePhoneNumber(req.body.whatsappNumber);
  }

  if (req.file) {
    console.log("Processing profile picture upload...");
    const uploadedUrl = await uploadProfileImage(req.file);
    console.log("Upload result:", uploadedUrl);
    
    if (!uploadedUrl) {
      console.error("❌ Cloudinary upload failed - no URL returned");
      const error = new Error("Image upload failed. Please check server logs and try again.");
      error.statusCode = 500;
      throw error;
    }
    
    user.profilePicture = uploadedUrl;
  }

  await user.save();
  console.log("User saved with profilePicture:", user.profilePicture);

  res.status(200).json({
    message: "Profile updated",
    user: userResponseShape(user),
  });
});
