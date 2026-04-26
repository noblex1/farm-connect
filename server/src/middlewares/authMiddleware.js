import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authorization token is required");
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      const error = new Error(
        jwtError.name === "TokenExpiredError" 
          ? "Session expired. Please login again." 
          : "Invalid token. Please login again."
      );
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decoded.sub).select("_id name phoneNumber role location profilePicture email whatsappNumber");

    if (!user) {
      const error = new Error("User account no longer exists. Please create a new account.");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error("Forbidden: insufficient permissions");
    error.statusCode = 403;
    return next(error);
  }

  return next();
};
