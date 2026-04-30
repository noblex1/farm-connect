import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

/**
 * Diagnostic endpoint to check environment configuration
 * Only accessible in development or with admin token
 */
router.get("/env-check", asyncHandler(async (req, res) => {
  // Basic security - only allow in development or with specific header
  const isDev = process.env.NODE_ENV !== "production";
  const hasAdminKey = req.headers["x-admin-key"] === process.env.ADMIN_DIAGNOSTIC_KEY;
  
  if (!isDev && !hasAdminKey) {
    return res.status(403).json({
      error: "Forbidden",
      message: "This endpoint is only accessible in development mode"
    });
  }

  const envCheck = {
    nodeEnv: process.env.NODE_ENV || "not set",
    port: process.env.PORT || "not set",
    
    database: {
      mongoUri: process.env.MONGO_URI ? "✅ Set" : "❌ Missing",
      mongoUriLength: process.env.MONGO_URI?.length || 0,
    },
    
    jwt: {
      jwtSecret: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || "not set",
    },
    
    cors: {
      clientOrigin: process.env.CLIENT_ORIGIN || "not set",
    },
    
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
      apiKey: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
      apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
    },
    
    smtp: {
      host: process.env.SMTP_HOST || "❌ Missing",
      port: process.env.SMTP_PORT || "587 (default)",
      secure: process.env.SMTP_SECURE || "false (default)",
      user: process.env.SMTP_USER ? "✅ Set" : "❌ Missing",
      pass: process.env.SMTP_PASS ? "✅ Set (hidden)" : "❌ Missing",
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "❌ Missing",
      configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    },
  };

  // Check if all critical variables are set
  const criticalMissing = [];
  
  if (!process.env.MONGO_URI) criticalMissing.push("MONGO_URI");
  if (!process.env.JWT_SECRET) criticalMissing.push("JWT_SECRET");
  if (!process.env.SMTP_HOST) criticalMissing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) criticalMissing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) criticalMissing.push("SMTP_PASS");

  res.json({
    status: criticalMissing.length === 0 ? "✅ All critical variables set" : "⚠️ Missing critical variables",
    criticalMissing,
    environment: envCheck,
    timestamp: new Date().toISOString(),
  });
}));

/**
 * Test SMTP connection with detailed diagnostics
 */
router.get("/smtp-test", asyncHandler(async (req, res) => {
  // Basic security
  const isDev = process.env.NODE_ENV !== "production";
  const hasAdminKey = req.headers["x-admin-key"] === process.env.ADMIN_DIAGNOSTIC_KEY;
  
  if (!isDev && !hasAdminKey) {
    return res.status(403).json({
      error: "Forbidden",
      message: "This endpoint is only accessible in development mode"
    });
  }

  console.log("🔍 SMTP Diagnostic Test Starting...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS length:", process.env.SMTP_PASS?.length);
  console.log("SMTP_PASS first 4 chars:", process.env.SMTP_PASS?.substring(0, 4));

  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({
      status: "❌ SMTP not configured",
      missing: {
        host: !process.env.SMTP_HOST,
        user: !process.env.SMTP_USER,
        pass: !process.env.SMTP_PASS,
      },
      message: "Please configure SMTP environment variables in Render dashboard",
      instructions: "Go to Render Dashboard → Your Service → Environment → Add SMTP variables"
    });
  }

  // Try to create transporter and verify connection
  try {
    const nodemailer = (await import("nodemailer")).default;
    
    console.log("📧 Creating SMTP transporter...");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      debug: true,
      logger: true,
    });

    console.log("🔌 Verifying SMTP connection...");
    // Verify connection
    await transporter.verify();

    console.log("✅ SMTP verification successful!");
    res.json({
      status: "✅ SMTP connection successful",
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || "587",
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        passLength: process.env.SMTP_PASS?.length,
      },
      message: "SMTP is properly configured and can send emails",
      note: "If using Gmail, ensure you're using an App Password (16 chars), not your regular password",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ SMTP verification failed:", error);
    
    let troubleshooting = "Check SMTP configuration and try again";
    let solution = "";
    
    if (error.code === "EAUTH") {
      troubleshooting = "Authentication failed - Invalid username or password";
      solution = "For Gmail: You MUST use an App Password (16 characters), not your regular Gmail password. Generate one at: https://myaccount.google.com/apppasswords";
    } else if (error.code === "ESOCKET") {
      troubleshooting = "Cannot connect to SMTP server";
      solution = "Check SMTP_HOST and SMTP_PORT. For Gmail use: smtp.gmail.com:587";
    } else if (error.code === "ETIMEDOUT") {
      troubleshooting = "Connection timeout";
      solution = "Check firewall or network settings. Ensure port 587 is not blocked.";
    }
    
    res.status(500).json({
      status: "❌ SMTP connection failed",
      error: {
        message: error.message,
        code: error.code,
        command: error.command,
      },
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || "587",
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER,
        passLength: process.env.SMTP_PASS?.length,
      },
      troubleshooting,
      solution,
      timestamp: new Date().toISOString(),
    });
  }
}));

export default router;
