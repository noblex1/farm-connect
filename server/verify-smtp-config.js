#!/usr/bin/env node

/**
 * SMTP Configuration Verification Script
 * 
 * This script checks if all required SMTP environment variables are set
 * and tests the connection to the SMTP server.
 * 
 * Usage: node verify-smtp-config.js
 */

import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

console.log("\n=== SMTP Configuration Verification ===\n");

// Check required environment variables
const requiredVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM"
];

let missingVars = [];
let configStatus = {};

console.log("1️⃣ Checking Environment Variables...\n");

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
    configStatus[varName] = "❌ MISSING";
  } else {
    // Mask sensitive values
    const displayValue = varName.includes("PASS") 
      ? "***" + value.slice(-4) 
      : value;
    configStatus[varName] = `✅ ${displayValue}`;
  }
  console.log(`   ${varName}: ${configStatus[varName]}`);
});

console.log();

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error("\n⚠️  Please set these variables in your .env file or Render dashboard.\n");
  process.exit(1);
}

console.log("✅ All required environment variables are set!\n");

// Test SMTP connection
console.log("2️⃣ Testing SMTP Connection...\n");

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
});

try {
  console.log(`   Connecting to ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}...`);
  await transporter.verify();
  console.log("   ✅ SMTP connection successful!\n");
  
  console.log("3️⃣ Configuration Summary:\n");
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT}`);
  console.log(`   Secure: ${process.env.SMTP_SECURE || "false"}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   From: ${process.env.SMTP_FROM}`);
  console.log();
  
  console.log("✅ SMTP is properly configured and ready to send emails!\n");
  console.log("💡 You can now test sending an OTP email using:");
  console.log("   node test-email-otp.js\n");
  
  process.exit(0);
} catch (error) {
  console.error("   ❌ SMTP connection failed!\n");
  console.error("Error Details:");
  console.error(`   Code: ${error.code || "N/A"}`);
  console.error(`   Message: ${error.message}`);
  console.error();
  
  // Provide helpful troubleshooting tips
  console.log("🔧 Troubleshooting Tips:\n");
  
  if (error.code === "EAUTH") {
    console.log("   Authentication failed. Possible causes:");
    console.log("   - Wrong email or password");
    console.log("   - For Gmail: You need an App Password (not your regular password)");
    console.log("   - Generate one at: https://myaccount.google.com/apppasswords");
    console.log("   - Make sure 2FA is enabled on your Gmail account");
  } else if (error.code === "ESOCKET" || error.code === "ETIMEDOUT") {
    console.log("   Connection timeout. Possible causes:");
    console.log("   - Firewall blocking port 587");
    console.log("   - Wrong SMTP host or port");
    console.log("   - No internet connection");
    console.log("   - SMTP server is down");
  } else if (error.code === "ECONNREFUSED") {
    console.log("   Connection refused. Possible causes:");
    console.log("   - Wrong port number");
    console.log("   - SMTP server not accepting connections");
    console.log("   - Try port 465 with SMTP_SECURE=true");
  } else {
    console.log("   Check your SMTP configuration and try again.");
    console.log("   Verify all environment variables are correct.");
  }
  
  console.log();
  process.exit(1);
}
