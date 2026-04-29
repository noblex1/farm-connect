# Email OTP Troubleshooting Guide

## ✅ Issue Resolved!

### The Problem
The email service was checking for `NODE_ENV === "production"` before using your Gmail SMTP settings. Since you're in development mode (`NODE_ENV=development`), it was falling back to a fake email service (Ethereal) instead of sending real emails.

### The Fix
Updated `server/src/services/emailService.js` to use your configured SMTP settings regardless of environment, as long as the SMTP credentials are provided.

---

## 🧪 Testing Your Email Service

### Quick Test
Run this command to test email sending:

```bash
cd server
node test-direct-email.js
```

**Expected Result:**
- ✅ SMTP connection verified
- ✅ Email sent successfully
- 📧 Check your inbox: mrgem156@gmail.com
- ⚠️ Also check SPAM folder!

---

## 🚀 Now Test the Full App

### 1. Start the Server
```bash
cd server
npm run dev
```

**Look for this in the console:**
```
📧 Using configured SMTP: smtp.gmail.com
```

### 2. Start the Client
```bash
cd client
npm run dev
```

### 3. Test Registration
1. Go to http://localhost:8080/create-account
2. Fill in the registration form
3. Click "Create Account"
4. **Check your email** (mrgem156@gmail.com)
5. **Check SPAM folder** if not in inbox
6. Enter the 6-digit OTP
7. You should be logged in!

### 4. Test Password Reset
1. Go to http://localhost:8080/login
2. Click "Forgot password?"
3. Enter your email
4. **Check your email** for OTP
5. Enter OTP
6. Create new password
7. Login with new password

---

## 📧 Email Delivery Checklist

### If Email Still Not Received

- [ ] **Check SPAM/Junk folder** - Gmail often marks automated emails as spam
- [ ] **Check Promotions tab** - Gmail may categorize it there
- [ ] **Check All Mail** - Search for "Farm Market" or "OTP"
- [ ] **Wait 1-2 minutes** - Sometimes there's a delay
- [ ] **Check server console** - Look for email sending logs
- [ ] **Verify email address** - Make sure you're using the correct email

### Server Console Should Show

When OTP is sent, you should see:
```
📧 Using configured SMTP: smtp.gmail.com
✅ Registration OTP email sent: <message-id>
```

If you see:
```
📧 Using Ethereal (fake) email - SMTP not configured
```
Then your .env file is not being loaded correctly.

---

## 🔧 Common Issues & Solutions

### Issue 1: "Using Ethereal (fake) email"

**Cause:** Environment variables not loaded

**Solution:**
1. Check `server/.env` file exists
2. Verify SMTP variables are set:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=mrgem156@gmail.com
   SMTP_PASS=bulbzknkupoyrwgi
   SMTP_FROM=mrgem156@gmail.com
   ```
3. Restart the server

### Issue 2: "Authentication Failed"

**Cause:** Invalid Gmail App Password

**Solution:**
1. Go to https://myaccount.google.com/apppasswords
2. Delete old "Farm Market" app password
3. Create NEW app password
4. Copy the 16-character password (no spaces)
5. Update `SMTP_PASS` in `.env`
6. Restart server

### Issue 3: Email in SPAM

**Cause:** Gmail marks automated emails as spam

**Solution:**
1. Check SPAM folder
2. Mark email as "Not Spam"
3. Add sender to contacts
4. For production, use dedicated email service (SendGrid, Mailgun)

### Issue 4: "Connection Refused"

**Cause:** Firewall or antivirus blocking port 587

**Solution:**
1. Temporarily disable firewall/antivirus
2. Check if port 587 is open
3. Try using port 465 with `SMTP_SECURE=true`
4. Check VPN settings

### Issue 5: OTP Expired

**Cause:** OTP expires after 10 minutes

**Solution:**
1. Click "Resend OTP" button
2. Wait for new email
3. Enter new OTP within 10 minutes

---

## 📊 Email Service Status

### Your Current Configuration

```env
SMTP_HOST=smtp.gmail.com          ✅ Correct
SMTP_PORT=587                     ✅ Correct
SMTP_SECURE=false                 ✅ Correct (STARTTLS)
SMTP_USER=mrgem156@gmail.com      ✅ Set
SMTP_PASS=bulbzknkupoyrwgi        ✅ Set (App Password)
SMTP_FROM=mrgem156@gmail.com      ✅ Set
```

### Test Results

✅ **Direct Email Test:** PASSED
- SMTP connection verified
- Email sent successfully
- Gmail accepted the email

✅ **Configuration:** CORRECT
- All SMTP variables set
- App Password valid
- Port and security settings correct

---

## 🎯 Next Steps

1. **Restart your server** to load the fixed email service
2. **Test registration** with a real email
3. **Check inbox and SPAM** for OTP email
4. **Test password reset** flow
5. **Celebrate!** 🎉

---

## 📝 Email Template Preview

### Registration OTP Email

```
From: Farm Market <mrgem156@gmail.com>
To: your-email@example.com
Subject: Verify Your Farm Market Account

🌾 Farm Market

Welcome, John Doe!

Thank you for registering with Farm Market. 
To complete your registration, please verify 
your email address using the OTP below:

┌─────────────────┐
│   1 2 3 4 5 6   │
└─────────────────┘

This OTP will expire in 10 minutes.

If you didn't create an account with Farm Market, 
please ignore this email.

Best regards,
The Farm Market Team
```

### Password Reset OTP Email

```
From: Farm Market <mrgem156@gmail.com>
To: your-email@example.com
Subject: Reset Your Farm Market Password

🌾 Farm Market

Password Reset Request

Hello John Doe,

We received a request to reset your Farm Market 
account password. Use the OTP below to proceed:

┌─────────────────┐
│   1 2 3 4 5 6   │
└─────────────────┘

This OTP will expire in 10 minutes.

⚠️ Security Notice: If you didn't request a 
password reset, please ignore this email and 
ensure your account is secure.

Best regards,
The Farm Market Team
```

---

## 🆘 Still Having Issues?

### Debug Steps

1. **Check server logs:**
   ```bash
   cd server
   npm run dev
   ```
   Look for email-related messages

2. **Test email directly:**
   ```bash
   node test-direct-email.js
   ```

3. **Verify environment variables:**
   ```bash
   node -e "require('dotenv').config(); console.log(process.env.SMTP_HOST)"
   ```

4. **Check Gmail account:**
   - 2FA enabled?
   - App Password valid?
   - No security blocks?

5. **Try different email:**
   - Test with another Gmail account
   - Test with different email provider

---

## 📚 Additional Resources

- **Gmail App Passwords:** https://myaccount.google.com/apppasswords
- **Gmail Security:** https://myaccount.google.com/security
- **Nodemailer Docs:** https://nodemailer.com/
- **SMTP Troubleshooting:** https://nodemailer.com/smtp/

---

## ✅ Success Checklist

- [x] SMTP configuration correct
- [x] Email service fixed
- [x] Direct email test passed
- [ ] Server restarted with new code
- [ ] Registration OTP received
- [ ] Password reset OTP received
- [ ] All features working

---

**Your email service is now configured correctly! 🎉**

Just restart your server and test the registration flow.
