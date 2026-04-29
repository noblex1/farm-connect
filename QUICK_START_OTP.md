# Quick Start: Email OTP Setup

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Gmail (Easiest Option)

1. **Enable 2-Factor Authentication**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" → Turn on

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Farm Market"
   - Copy the 16-character password

3. **Update server/.env**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=your-email@gmail.com
   ```

### Step 3: Start the Application

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

### Step 4: Test It!

1. **Test Registration:**
   - Go to http://localhost:8080/create-account
   - Fill in the form
   - Click "Create Account"
   - Check your email for OTP
   - Enter OTP on verification page
   - ✅ You're logged in!

2. **Test Password Reset:**
   - Go to http://localhost:8080/login
   - Click "Forgot password?"
   - Enter your email
   - Check email for OTP
   - Enter OTP
   - Create new password
   - ✅ Password reset!

3. **Test Password Toggle:**
   - On any password field
   - Click the eye icon 👁️
   - ✅ Password visibility toggles!

## 🎉 That's It!

You now have:
- ✅ Email OTP for registration
- ✅ Email OTP for password reset
- ✅ Password visibility toggle
- ✅ Professional email templates

## 📧 Email Preview

During development, if SMTP is not configured, emails are logged to the console with preview URLs.

## 🔧 Troubleshooting

**OTP not received?**
- Check spam folder
- Verify SMTP credentials in .env
- Check server console for errors

**"Invalid or expired OTP"?**
- OTPs expire after 10 minutes
- Click "Resend OTP" button
- Wait for cooldown (60 seconds)

**Password toggle not working?**
- Check browser console for errors
- Refresh the page
- Try a different browser

## 📚 More Information

- `EMAIL_OTP_SETUP.md` - Complete setup guide
- `OTP_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `PROJECT_DOCUMENTATION.md` - Full project docs

## 🆘 Need Help?

1. Check server logs: `cd server && npm run dev`
2. Check browser console: F12 → Console tab
3. Review the documentation files above
4. Test with a different email provider

## 🎯 Production Deployment

For production, use a dedicated email service:
- **SendGrid** (Recommended)
- **Mailgun**
- **AWS SES**

See `EMAIL_OTP_SETUP.md` for production configuration.

---

**Happy Coding! 🌾**
