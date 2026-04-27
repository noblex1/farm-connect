import express from "express";
import {
  getAdminStats,
  getAllUsers,
  deleteUser,
  toggleUserStatus,
  getAllListingsAdmin,
  deleteListingAdmin,
  getAdminAnalytics,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

// Stats and analytics
router.get("/stats", getAdminStats);
router.get("/analytics", getAdminAnalytics);

// User management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", toggleUserStatus);

// Listing management
router.get("/listings", getAllListingsAdmin);
router.delete("/listings/:id", deleteListingAdmin);

export default router;
