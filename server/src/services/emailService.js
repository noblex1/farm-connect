import nodemailer from "nodemailer";

/** Attach HTTP status for express errorHandler (avoids misreporting mail failures as 500). */
const httpError = (message, statusCode = 503) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const isSmtpConnectionFailure = (error) => {
  const connectionCodes = new Set([
    "ESOCKET",
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ECONNRESET",
    "ENOTFOUND",
    "EPIPE",
    "ECONNCLOSED",
  ]);
  if (connectionCodes.has(error.code)) return true;
  if (error.message && /certificate|SSL|TLS|EPROTO|self signed/i.test(error.message)) return true;
  return false;
};

// Create transporter with improved configuration
const createEmailTransporter = () => {
  // Log all SMTP-related environment variables for debugging
  console.log("=== SMTP Environment Variables Check ===");
  console.log("SMTP_HOST:", process.env.SMTP_HOST || "❌ NOT SET");
  console.log("SMTP_PORT:", process.env.SMTP_PORT || "❌ NOT SET");
  console.log("SMTP_SECURE:", process.env.SMTP_SECURE || "❌ NOT SET");
  console.log("SMTP_USER:", process.env.SMTP_USER || "❌ NOT SET");
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ SET (length: " + process.env.SMTP_PASS.length + ")" : "❌ NOT SET");
  console.log("SMTP_FROM:", process.env.SMTP_FROM || process.env.SMTP_USER || "❌ NOT SET");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("========================================");
  
  // Check if SMTP is configured
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  
  if (!hasSmtpConfig) {
    console.error("❌ SMTP Configuration Missing!");
    console.error("Required environment variables:");
    console.error("  - SMTP_HOST:", process.env.SMTP_HOST ? "✅" : "❌ MISSING");
    console.error("  - SMTP_USER:", process.env.SMTP_USER ? "✅" : "❌ MISSING");
    console.error("  - SMTP_PASS:", process.env.SMTP_PASS ? "✅ (hidden)" : "❌ MISSING");
    console.error("  - SMTP_PORT:", process.env.SMTP_PORT || "587 (default)");
    console.error("  - SMTP_FROM:", process.env.SMTP_FROM || process.env.SMTP_USER || "❌ MISSING");
    
    // In production, throw error instead of returning mock
    if (process.env.NODE_ENV === "production") {
      throw httpError(
        "SMTP configuration is missing. Please configure SMTP environment variables on the server (e.g. Render dashboard).",
        503
      );
    }
    
    // Development fallback - logs to console
    console.log("⚠️  Using mock email transporter for development");
    return {
      sendMail: async (mailOptions) => {
        console.log("📧 [MOCK EMAIL] Would send to:", mailOptions.to);
        console.log("📧 [MOCK EMAIL] Subject:", mailOptions.subject);
        console.log("📧 [MOCK EMAIL] OTP would be in the email body");
        return { 
          messageId: "mock-" + Date.now(),
          response: "250 Mock email logged"
        };
      }
    };
  }

  console.log("✅ SMTP Configuration Complete");
  console.log("📧 Creating nodemailer transporter...");
  
  try {
    // Use nodemailer.createTransport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add timeout and connection settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // Add pool settings for better performance
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      // Add TLS options
      tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
        minVersion: "TLSv1.2",
      },
      // Enable debug in development
      debug: process.env.NODE_ENV !== "production",
      logger: process.env.NODE_ENV !== "production",
    });
    
    console.log("✅ Nodemailer transporter created successfully");
    return transporter;
  } catch (transporterError) {
    console.error("❌ Failed to create nodemailer transporter:");
    console.error("Error:", transporterError.message);
    console.error("Stack:", transporterError.stack);
    throw transporterError;
  }
};

/**
 * Send OTP email for registration verification
 */
export const sendRegistrationOTP = async (email, otp, userName) => {
  try {
    console.log(`📧 Attempting to send registration OTP to: ${email}`);
    console.log(`📧 OTP: ${otp}`);
    console.log(`📧 User: ${userName}`);
    
    // Create transporter (this might throw if SMTP not configured)
    let transporter;
    try {
      transporter = createEmailTransporter();
    } catch (transporterError) {
      console.error("❌ Failed to create email transporter:");
      console.error("Error:", transporterError.message);
      if (transporterError.statusCode) {
        throw transporterError;
      }
      throw httpError("Email service is not configured. Please contact support.", 503);
    }

    const mailOptions = {
      from: `"Farm Market" <${process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@farmmarket.com"}>`,
      to: email,
      subject: "Verify Your Farm Market Account - OTP Inside",
      // Add headers to improve deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Farm Market Platform'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2D5F2E; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
            .otp-box { background: white; border: 3px solid #2D5F2E; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 20px 0; border-radius: 8px; color: #2D5F2E; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .highlight { color: #2D5F2E; font-weight: bold; }
            @media only screen and (max-width: 600px) {
              .otp-box { font-size: 28px; letter-spacing: 6px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🌾 Farm Market</h1>
              <p style="margin: 5px 0 0 0;">Connecting Farmers & Buyers</p>
            </div>
            <div class="content">
              <h2 style="color: #2D5F2E;">Welcome, ${userName}!</h2>
              <p>Thank you for registering with <strong>Farm Market</strong>. To complete your registration and verify your email address, please use the One-Time Password (OTP) below:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p><strong class="highlight">⏰ This OTP will expire in 10 minutes.</strong></p>
              
              <p style="margin-top: 20px;">If you didn't create an account with Farm Market, please ignore this email. Your email address will not be used without your confirmation.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              
              <p style="margin-bottom: 0;">Best regards,<br><strong>The Farm Market Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Farm Market. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Farm Market - Email Verification

Welcome, ${userName}!

Thank you for registering with Farm Market. To complete your registration, please use the OTP below:

Your OTP: ${otp}

⏰ This OTP will expire in 10 minutes.

If you didn't create an account with Farm Market, please ignore this email.

Best regards,
The Farm Market Team

---
This is an automated email. Please do not reply.
© ${new Date().getFullYear()} Farm Market. All rights reserved.
      `,
    };

    console.log("📧 Sending email with options:");
    console.log("  From:", mailOptions.from);
    console.log("  To:", mailOptions.to);
    console.log("  Subject:", mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Registration OTP email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 Response:", info.response);
    
    // For development with ethereal, log preview URL
    if (process.env.NODE_ENV !== "production" && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("📧 Preview URL:", previewUrl);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending registration OTP email:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    if (error.statusCode) {
      throw error;
    }
    if (error.code === "EAUTH") {
      throw httpError(
        "Email could not be sent: SMTP authentication failed. Update SMTP_USER / SMTP_PASS on the server.",
        502
      );
    }
    if (error.code === "EENVELOPE") {
      throw httpError("Invalid email address format.", 400);
    }
    if (isSmtpConnectionFailure(error)) {
      throw httpError(
        "We could not reach the mail server from our backend. This is usually a server SMTP or firewall issue, not your device. Please try again later or contact support.",
        503
      );
    }
    if (error.message && error.message.includes("not configured")) {
      throw httpError(error.message, 503);
    }
    throw httpError("Failed to send verification email. Please try again later.", 503);
  }
};

/**
 * Send OTP email for password reset
 */
export const sendPasswordResetOTP = async (email, otp, userName) => {
  try {
    console.log(`📧 Attempting to send password reset OTP to: ${email}`);
    console.log(`📧 OTP: ${otp}`);
    console.log(`📧 User: ${userName}`);
    
    // Create transporter (this might throw if SMTP not configured)
    let transporter;
    try {
      transporter = createEmailTransporter();
    } catch (transporterError) {
      console.error("❌ Failed to create email transporter:");
      console.error("Error:", transporterError.message);
      if (transporterError.statusCode) {
        throw transporterError;
      }
      throw httpError("Email service is not configured. Please contact support.", 503);
    }

    const mailOptions = {
      from: `"Farm Market" <${process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@farmmarket.com"}>`,
      to: email,
      subject: "Reset Your Farm Market Password - OTP Inside",
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'Farm Market Platform'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2D5F2E; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
            .otp-box { background: white; border: 3px solid #2D5F2E; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 20px 0; border-radius: 8px; color: #2D5F2E; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .highlight { color: #2D5F2E; font-weight: bold; }
            @media only screen and (max-width: 600px) {
              .otp-box { font-size: 28px; letter-spacing: 6px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🌾 Farm Market</h1>
              <p style="margin: 5px 0 0 0;">Connecting Farmers & Buyers</p>
            </div>
            <div class="content">
              <h2 style="color: #2D5F2E;">Password Reset Request</h2>
              <p>Hello <strong>${userName}</strong>,</p>
              <p>We received a request to reset your Farm Market account password. Use the One-Time Password (OTP) below to proceed:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p><strong class="highlight">⏰ This OTP will expire in 10 minutes.</strong></p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure. Your password will not be changed without entering this OTP.
              </div>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              
              <p style="margin-bottom: 0;">Best regards,<br><strong>The Farm Market Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Farm Market. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Farm Market - Password Reset Request

Hello ${userName},

We received a request to reset your password. Your OTP is: ${otp}

⏰ This OTP will expire in 10 minutes.

⚠️ Security Notice: If you didn't request a password reset, please ignore this email.

Best regards,
The Farm Market Team

---
This is an automated email. Please do not reply.
© ${new Date().getFullYear()} Farm Market. All rights reserved.
      `,
    };

    console.log("📧 Sending email with options:");
    console.log("  From:", mailOptions.from);
    console.log("  To:", mailOptions.to);
    console.log("  Subject:", mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Password reset OTP email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 Response:", info.response);
    
    // For development with ethereal, log preview URL
    if (process.env.NODE_ENV !== "production" && nodemailer.getTestMessageUrl) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("📧 Preview URL:", previewUrl);
      }
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset OTP email:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    if (error.statusCode) {
      throw error;
    }
    if (error.code === "EAUTH") {
      throw httpError(
        "Email could not be sent: SMTP authentication failed. Update SMTP_USER / SMTP_PASS on the server.",
        502
      );
    }
    if (error.code === "EENVELOPE") {
      throw httpError("Invalid email address format.", 400);
    }
    if (isSmtpConnectionFailure(error)) {
      throw httpError(
        "We could not reach the mail server from our backend. This is usually a server SMTP or firewall issue, not your device. Please try again later or contact support.",
        503
      );
    }
    if (error.message && error.message.includes("not configured")) {
      throw httpError(error.message, 503);
    }
    throw httpError("Failed to send password reset email. Please try again later.", 503);
  }
};

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
