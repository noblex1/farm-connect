import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, ".env") });

console.log("=== Testing Email OTP Service ===\n");

console.log("Environment Variables:");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET (hidden)" : "NOT SET");
console.log("SMTP_FROM:", process.env.SMTP_FROM);
console.log("");

import nodemailer from "nodemailer";

async function testEmailService() {
  try {
    console.log("Creating transporter...");
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug output
      logger: true, // Log to console
    });

    console.log("\n1. Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");

    console.log("2. Sending test OTP email...");
    const testOTP = "123456";
    const testEmail = process.env.SMTP_USER; // Send to yourself for testing

    const info = await transporter.sendMail({
      from: `"Farm Market Test" <${process.env.SMTP_FROM}>`,
      to: testEmail,
      subject: "Test OTP - Farm Market",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2D5F2E; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #2D5F2E; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 Farm Market - Test Email</h1>
            </div>
            <div class="content">
              <h2>Email Service Test</h2>
              <p>This is a test email to verify your OTP email service is working correctly.</p>
              
              <div class="otp-box">${testOTP}</div>
              
              <p><strong>If you received this email, your email service is configured correctly! ✅</strong></p>
              
              <p>Test Details:</p>
              <ul>
                <li>SMTP Host: ${process.env.SMTP_HOST}</li>
                <li>SMTP Port: ${process.env.SMTP_PORT}</li>
                <li>From: ${process.env.SMTP_FROM}</li>
                <li>To: ${testEmail}</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Farm Market - Test Email
        
        This is a test email to verify your OTP email service is working.
        
        Test OTP: ${testOTP}
        
        If you received this email, your email service is configured correctly!
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    
    if (process.env.NODE_ENV !== "production") {
      console.log("\n📧 Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    
    console.log("\n✅ SUCCESS! Check your inbox:", testEmail);
    console.log("⚠️  Also check your SPAM/JUNK folder!");
    
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nFull error:", error);
    
    console.log("\n🔧 Troubleshooting Tips:");
    console.log("1. Check if 2-Factor Authentication is enabled on your Gmail account");
    console.log("2. Verify you're using an App Password (not your regular Gmail password)");
    console.log("3. Generate a new App Password at: https://myaccount.google.com/apppasswords");
    console.log("4. Make sure 'Less secure app access' is NOT needed (App Passwords work without it)");
    console.log("5. Check if your Gmail account has any security blocks");
    console.log("6. Try accessing Gmail from the same network to verify it's not blocked");
  }
}

testEmailService();
