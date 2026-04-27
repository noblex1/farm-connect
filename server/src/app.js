import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// Configure CORS before other middleware
const allowedOrigins = process.env.CLIENT_ORIGIN 
  ? process.env.CLIENT_ORIGIN.split(",").map(origin => origin.trim())
  : ["http://localhost:8080", "https://farm-connect-one-navy.vercel.app"];

console.log("=== CORS Configuration ===");
console.log("Allowed Origins:", allowedOrigins);

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight for 10 minutes
}));

// Configure Helmet with CORS-friendly settings
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(compression());
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false, limit: "200kb" }));
app.use(morgan("dev"));

// Handle preflight requests explicitly
app.options('*', cors());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "farm-market-api" });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
