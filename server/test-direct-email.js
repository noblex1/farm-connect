// Direct test without dotenv - using hardcoded values
import nodemailer from "nodemailer";

console.log("=== Direct Email Test (Hardcoded Values) ===\n");

async function testDirectEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mrgem156@gmail.com",
        pass: "bulbzknkupoyrwgi",
      },
      debug: true,
      logger: true,
    });

    console.log("1. Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!\n");

    console.log("2. Sending test email...");
    const info = await transporter.sendMail({
      from: '"Farm Market Test" <mrgem156@gmail.com>',
      to: "mrgem156@gmail.com",
      subject: "Test OTP - Farm Market",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2D5F2E; color: white; padding: 20px; text-align: center;">
            <h1>🌾 Farm Market</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px;">
            <h2>Test Email</h2>
            <p>Your OTP is:</p>
            <div style="background: white; border: 2px solid #2D5F2E; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              123456
            </div>
            <p><strong>If you received this, your email service works! ✅</strong></p>
          </div>
        </div>
      `,
      text: "Your OTP is: 123456",
    });

    console.log("\n✅ SUCCESS!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("\n📧 Check your inbox: mrgem156@gmail.com");
    console.log("⚠️  Also check SPAM folder!");

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("\nDetails:", error);
    
    if (error.code === "EAUTH") {
      console.log("\n🔧 Authentication Failed!");
      console.log("This means your Gmail credentials are incorrect or the App Password is invalid.");
      console.log("\nSteps to fix:");
      console.log("1. Go to: https://myaccount.google.com/apppasswords");
      console.log("2. Delete the old 'Farm Market' app password");
      console.log("3. Create a NEW app password");
      console.log("4. Copy the 16-character password (no spaces)");
      console.log("5. Update SMTP_PASS in your .env file");
    } else if (error.code === "ESOCKET") {
      console.log("\n🔧 Connection Failed!");
      console.log("Cannot connect to Gmail SMTP server.");
      console.log("\nPossible causes:");
      console.log("1. Firewall blocking port 587");
      console.log("2. Antivirus blocking connection");
      console.log("3. Network restrictions");
      console.log("4. VPN interfering");
    }
  }
}

testDirectEmail();
