import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  // Use real SMTP if configured, regardless of environment
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log("📧 Using configured SMTP:", process.env.SMTP_HOST);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development fallback - logs to console
  console.log("📧 Using Ethereal (fake) email - SMTP not configured");
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "test@ethereal.email",
      pass: process.env.SMTP_PASS || "test",
    },
  });
};

/**
 * Send OTP email for registration verification
 */
export const sendRegistrationOTP = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Farm Market" <${process.env.SMTP_FROM || "noreply@farmmarket.com"}>`,
      to: email,
      subject: "Verify Your Farm Market Account",
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
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #2D5F2E; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 Farm Market</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${userName}!</h2>
              <p>Thank you for registering with Farm Market. To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p><strong>This OTP will expire in 10 minutes.</strong></p>
              
              <p>If you didn't create an account with Farm Market, please ignore this email.</p>
              
              <p>Best regards,<br>The Farm Market Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Farm Market. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Farm Market, ${userName}!
        
        Your verification OTP is: ${otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't create an account with Farm Market, please ignore this email.
        
        Best regards,
        The Farm Market Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Registration OTP email sent:", info.messageId);
    
    // For development with ethereal, log preview URL
    if (process.env.NODE_ENV !== "production") {
      console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending registration OTP email:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send OTP email for password reset
 */
export const sendPasswordResetOTP = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Farm Market" <${process.env.SMTP_FROM || "noreply@farmmarket.com"}>`,
      to: email,
      subject: "Reset Your Farm Market Password",
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
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 Farm Market</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${userName},</p>
              <p>We received a request to reset your Farm Market account password. Use the OTP below to proceed:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p><strong>This OTP will expire in 10 minutes.</strong></p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
              </div>
              
              <p>Best regards,<br>The Farm Market Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Farm Market. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Farm Market
        
        Hello ${userName},
        
        We received a request to reset your password. Your OTP is: ${otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't request a password reset, please ignore this email.
        
        Best regards,
        The Farm Market Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Password reset OTP email sent:", info.messageId);
    
    // For development with ethereal, log preview URL
    if (process.env.NODE_ENV !== "production") {
      console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset OTP email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
