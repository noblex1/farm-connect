import jwt from "jsonwebtoken";

export const signToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required in environment variables");
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "14d" }
  );
};

export const sanitizePhoneNumber = (phone = "") => phone.replace(/\s+/g, "").trim();
