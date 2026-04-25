import User from "../models/User.js";
import { signToken, sanitizePhoneNumber } from "../utils/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userResponseShape } from "../services/responseService.js";
import { uploadProfileImage } from "../services/uploadService.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, phoneNumber, role, location } = req.body;
  const normalizedPhone = sanitizePhoneNumber(phoneNumber);

  const existingUser = await User.findOne({ phoneNumber: normalizedPhone });

  if (existingUser) {
    const error = new Error("Phone number already registered");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    phoneNumber: normalizedPhone,
    role,
    location,
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
  const normalizedPhone = sanitizePhoneNumber(req.body.phoneNumber);
  const user = await User.findOne({ phoneNumber: normalizedPhone });

  if (!user) {
    const error = new Error("Invalid phone number");
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
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ user: userResponseShape(user) });
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  if (req.body.location !== undefined) {
    user.location = req.body.location;
  }

  if (req.body.email !== undefined) {
    user.email = req.body.email;
  }

  if (req.body.whatsappNumber !== undefined) {
    user.whatsappNumber = sanitizePhoneNumber(req.body.whatsappNumber);
  }

  if (req.file) {
    user.profilePicture = await uploadProfileImage(req.file);
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated",
    user: userResponseShape(user),
  });
});
