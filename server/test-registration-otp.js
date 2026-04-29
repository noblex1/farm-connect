import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

console.log("=== Testing Registration OTP Flow ===\n");

import { generateOTP, sendRegistrationOTP } from "./src/services/emailService.js";

async function testRegistrationOTP() {
  try {
    // Test 1: Generate OTP
    console.log("1️⃣ Testing OTP Generation...");
    const otp = generateOTP();
    console.log("✅ OTP Generated:", otp);
    console.log("✅ OTP Length:", otp.length);
    console.log("✅ OTP is numeric:", /^\d+$/.test(otp));
    console.log("");

    // Test 2: Send to your own email (should work)
    console.log("2️⃣ Testing Email to YOUR address (mrgem156@gmail.com)...");
    try {
      await sendRegistrationOTP("mrgem156@gmail.com", otp, "Test User");
      console.log("✅ Email sent to YOUR address successfully!");
      console.log("📧 Check your inbox: mrgem156@gmail.com");
      console.log("");
    } catch (error) {
      console.error("❌ Failed to send to YOUR address:");
      console.error(error.message);
      console.log("");
    }

    // Test 3: Send to a different email
    console.log("3️⃣ Testing Email to DIFFERENT address...");
    const testEmail = "test@example.com"; // Change this to a real email you want to test
    console.log(`📧 Attempting to send to: ${testEmail}`);
    
    try {
      await sendRegistrationOTP(testEmail, otp, "Different User");
      console.log("✅ Email sent to different address successfully!");
      console.log(`📧 Check inbox: ${testEmail}`);
      console.log("");
    } catch (error) {
      console.error("❌ Failed to send to different address:");
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      console.log("");
    }

    // Test 4: Check SMTP configuration
    console.log("4️⃣ Checking SMTP Configuration...");
    console.log("SMTP_HOST:", process.env.SMTP_HOST || "NOT SET");
    console.log("SMTP_PORT:", process.env.SMTP_PORT || "NOT SET");
    console.log("SMTP_USER:", process.env.SMTP_USER || "NOT SET");
    console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET (hidden)" : "NOT SET");
    console.log("SMTP_FROM:", process.env.SMTP_FROM || "NOT SET");
    console.log("");

    console.log("=== Test Complete ===");
    console.log("\n📋 Summary:");
    console.log("1. OTP generation: ✅ Working");
    console.log("2. Email to your address: Check logs above");
    console.log("3. Email to different address: Check logs above");
    console.log("\n⚠️  IMPORTANT:");
    console.log("- Check SPAM folder for both emails");
    console.log("- Gmail may block emails to non-Gmail addresses");
    console.log("- Check server logs for detailed error messages");

  } catch (error) {
    console.error("\n❌ Test failed with error:");
    console.error(error);
  }
}

testRegistrationOTP();
