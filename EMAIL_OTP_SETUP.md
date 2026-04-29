# Email OTP Verification Setup Guide

## Overview

This guide explains how to set up and use the email OTP (One-Time Password) verification system for user registration and password reset functionality.

## Features Implemented

### 1. **Registration with Email OTP**
- Users register with email, phone, password, and other details
- System sends a 6-digit OTP to the provided email
- Users must verify OTP before account is created
- OTP expires after 10 minutes
- Resend OTP functionality with 60-second cooldown

### 2. **Password Reset with Email OTP**
- Users request password reset by entering email
- System sends a 6-digit OTP to the email
- Users verify OTP to proceed
- Users create new password after OTP verification
- OTP expires after 10 minutes

### 3. **Password Visibility Toggle**
- Eye icon in password fields to show/hide password
- Available on login, registration, and password reset pages
- Improves user experience and reduces input errors

## Email Configuration

### Environment Variables

Add these variables to your `server/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@farmmarket.com
```

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable 2FA

2. **Generate App Password**
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Farm Market"
   - Copy the 16-character password
   - Use this as `SMTP_PASS` in your .env file

3. **Configure Environment Variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=your-gmail@gmail.com
   ```

### Other Email Providers

#### **SendGrid**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

#### **Mailgun**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

#### **AWS SES**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
SMTP_FROM=noreply@yourdomain.com
```

## API Endpoints

### Registration Flow

#### 1. Register with OTP
```http
POST /api/otp/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+233201234567",
  "password": "password123",
  "role": "farmer",
  "location": "Tamale"
}
```

**Response:**
```json
{
  "message": "OTP sent to your email. Please verify to complete registration.",
  "email": "john@example.com",
  "requiresVerification": true
}
```

#### 2. Verify Registration OTP
```http
POST /api/otp/verify-registration
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "name": "John Doe",
  "phoneNumber": "+233201234567",
  "password": "password123",
  "role": "farmer",
  "location": "Tamale"
}
```

**Response:**
```json
{
  "message": "Registration successful! Your account has been verified.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer",
    ...
  }
}
```

#### 3. Resend Registration OTP
```http
POST /api/otp/resend-registration-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Password Reset Flow

#### 1. Request Password Reset
```http
POST /api/otp/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists with this email, you will receive a password reset OTP.",
  "email": "john@example.com"
}
```

#### 2. Verify Reset OTP
```http
POST /api/otp/verify-reset-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully. You can now reset your password.",
  "resetToken": "507f1f77bcf86cd799439011"
}
```

#### 3. Reset Password
```http
POST /api/otp/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "resetToken": "507f1f77bcf86cd799439011",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

## Frontend Routes

### New Pages

1. **`/verify-otp`** - Verify registration OTP
   - Displays email where OTP was sent
   - 6-digit OTP input field
   - Resend OTP button with cooldown
   - Auto-redirects to dashboard after verification

2. **`/forgot-password`** - Request password reset
   - Email input field
   - Sends OTP to email
   - Redirects to verify-reset-otp page

3. **`/verify-reset-otp`** - Verify password reset OTP
   - Displays email where OTP was sent
   - 6-digit OTP input field
   - Resend OTP button with cooldown
   - Redirects to reset-password page after verification

4. **`/reset-password`** - Create new password
   - New password input with visibility toggle
   - Confirm password input with visibility toggle
   - Password strength validation
   - Redirects to login after successful reset

### Updated Pages

1. **`/create-account`** - Registration page
   - Added password visibility toggle (eye icon)
   - Now sends OTP instead of creating account immediately
   - Redirects to verify-otp page

2. **`/login`** - Login page
   - Added password visibility toggle (eye icon)
   - Added "Forgot password?" link

## User Flow

### Registration Flow

```
1. User fills registration form
   ↓
2. System sends OTP to email
   ↓
3. User enters OTP on verification page
   ↓
4. System verifies OTP and creates account
   ↓
5. User is logged in and redirected to dashboard
```

### Password Reset Flow

```
1. User clicks "Forgot password?" on login page
   ↓
2. User enters email address
   ↓
3. System sends OTP to email
   ↓
4. User enters OTP on verification page
   ↓
5. System verifies OTP
   ↓
6. User creates new password
   ↓
7. User is redirected to login page
```

## Database Models

### OTP Model

```javascript
{
  email: String,           // User's email address
  otp: String,            // 6-digit OTP code
  type: String,           // "registration" or "password-reset"
  verified: Boolean,      // Whether OTP has been verified
  expiresAt: Date,        // Expiration timestamp (10 minutes)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

**Indexes:**
- `email` - For quick lookup
- `expiresAt` - TTL index for automatic deletion

**Features:**
- Automatic deletion after expiration (MongoDB TTL index)
- One OTP per email per type
- Old OTPs deleted when new one is requested

## Email Templates

### Registration OTP Email

**Subject:** Verify Your Farm Market Account

**Content:**
- Welcome message with user's name
- 6-digit OTP in large, centered box
- Expiration notice (10 minutes)
- Security notice about ignoring if not requested
- Farm Market branding

### Password Reset OTP Email

**Subject:** Reset Your Farm Market Password

**Content:**
- Greeting with user's name
- 6-digit OTP in large, centered box
- Expiration notice (10 minutes)
- Security warning about unauthorized access
- Farm Market branding

## Security Features

### OTP Security

1. **Expiration:** OTPs expire after 10 minutes
2. **Single Use:** OTPs are marked as verified after use
3. **Type Specific:** Separate OTPs for registration and password reset
4. **Rate Limiting:** API rate limiting prevents abuse
5. **Automatic Cleanup:** Expired OTPs automatically deleted from database

### Password Security

1. **Visibility Toggle:** Eye icon to show/hide password
2. **Minimum Length:** 6 characters required
3. **Bcrypt Hashing:** Passwords hashed before storage
4. **Confirmation:** Password confirmation on reset

### Email Security

1. **No Email Enumeration:** Same response whether email exists or not
2. **Secure SMTP:** TLS encryption for email transmission
3. **App Passwords:** Recommended for Gmail (not regular password)

## Testing

### Development Testing

For development, the system uses Ethereal Email (fake SMTP) if production SMTP is not configured:

1. OTP emails are logged to console
2. Preview URLs are provided in console
3. No actual emails are sent
4. Perfect for testing without email setup

### Production Testing

1. **Test Registration:**
   - Register with real email
   - Check inbox for OTP
   - Verify OTP works
   - Check account is created

2. **Test Password Reset:**
   - Request password reset
   - Check inbox for OTP
   - Verify OTP works
   - Reset password successfully
   - Login with new password

3. **Test Resend:**
   - Request OTP
   - Wait for cooldown
   - Click resend
   - Verify new OTP received

## Troubleshooting

### OTP Not Received

**Possible Causes:**
1. Email in spam folder
2. Wrong SMTP credentials
3. Email provider blocking
4. Network issues

**Solutions:**
1. Check spam/junk folder
2. Verify SMTP credentials in .env
3. Check email provider settings
4. Check server logs for errors

### "Invalid or expired OTP"

**Possible Causes:**
1. OTP expired (>10 minutes old)
2. Wrong OTP entered
3. OTP already used
4. Database connection issue

**Solutions:**
1. Request new OTP
2. Double-check OTP from email
3. Use resend OTP button
4. Check database connection

### Email Sending Fails

**Possible Causes:**
1. Invalid SMTP credentials
2. Port blocked by firewall
3. Email provider restrictions
4. Network connectivity

**Solutions:**
1. Verify SMTP settings
2. Check firewall rules
3. Use app password (Gmail)
4. Check server logs

### Password Visibility Toggle Not Working

**Possible Causes:**
1. JavaScript error
2. Component not imported
3. State not updating

**Solutions:**
1. Check browser console
2. Verify Eye/EyeOff icons imported
3. Check useState hook

## Best Practices

### For Development

1. Use Gmail with app password for easy setup
2. Test with real email addresses
3. Check spam folder during testing
4. Monitor server logs for email sending

### For Production

1. Use dedicated email service (SendGrid, Mailgun, AWS SES)
2. Set up SPF, DKIM, DMARC records
3. Use custom domain for sender email
4. Monitor email delivery rates
5. Implement email queue for reliability
6. Add retry logic for failed sends

### For Users

1. Clear instructions on OTP page
2. Show email where OTP was sent
3. Provide resend option
4. Show expiration time
5. Handle errors gracefully
6. Provide support contact

## Future Enhancements

1. **SMS OTP:** Add SMS as alternative to email
2. **Email Queue:** Use Bull or similar for email queue
3. **Email Templates:** Use template engine (Handlebars, Pug)
4. **Email Tracking:** Track open rates and delivery
5. **Multi-language:** Support multiple languages
6. **Branding:** Custom email templates per tenant
7. **Rate Limiting:** Per-user rate limiting for OTP requests
8. **Analytics:** Track OTP success/failure rates

## Support

For issues or questions:
1. Check server logs for errors
2. Verify SMTP configuration
3. Test with different email providers
4. Check database for OTP records
5. Review email provider documentation

## License

This OTP system is part of the Farm Market project and follows the same license.
