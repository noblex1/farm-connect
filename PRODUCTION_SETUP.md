# Production Setup Guide - Fixing OTP Email Issue

## Problem
OTP emails work on localhost but fail in production with error: "Cannot connect to email server. Please check your internet connection."

## Root Cause
The Render deployment is missing SMTP environment variables needed to send emails.

## Solution

### Step 1: Update render.yaml (Already Done ✅)
The `server/render.yaml` file has been updated to include SMTP environment variables.

### Step 2: Configure Environment Variables on Render

1. **Log in to Render Dashboard**
   - Go to: https://dashboard.render.com/
   - Navigate to your `farm-market-api` service

2. **Add SMTP Environment Variables**
   - Click on "Environment" in the left sidebar
   - Add the following environment variables:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=mrgem156@gmail.com
   SMTP_PASS=ljwdjcfitdhvvbjr
   SMTP_FROM=mrgem156@gmail.com
   ```

   **Important Notes:**
   - The `SMTP_PASS` value above is your Gmail App Password (already in your local .env)
   - If you need to regenerate it: https://myaccount.google.com/apppasswords
   - Make sure 2FA is enabled on your Gmail account

3. **Save and Deploy**
   - Click "Save Changes"
   - Render will automatically redeploy your service
   - Wait for the deployment to complete (usually 2-3 minutes)

### Step 3: Verify the Fix

1. **Check Deployment Logs**
   - In Render dashboard, go to "Logs" tab
   - Look for: `📧 Using configured SMTP: smtp.gmail.com`
   - This confirms SMTP is properly configured

2. **Test OTP Functionality**
   - Go to your production site: https://farm-connect-one-navy.vercel.app
   - Try the "Forgot Password" flow
   - You should receive an OTP email within seconds

3. **Monitor for Errors**
   - If still failing, check logs for specific error messages
   - Common issues:
     - Wrong App Password → Error: "Email authentication failed"
     - Firewall blocking port 587 → Error: "Cannot connect to email server"
     - Invalid email format → Error: "Invalid email address format"

## Alternative: Using Environment Variables from Dashboard

If you prefer not to use `render.yaml`, you can manually add environment variables:

1. Go to Render Dashboard → Your Service → Environment
2. Click "Add Environment Variable"
3. Add each SMTP variable one by one
4. Click "Save Changes"

## Troubleshooting

### Issue: Still getting connection errors
**Solution:** 
- Verify the App Password is correct (no spaces)
- Check if Gmail is blocking the connection
- Try regenerating the App Password

### Issue: Authentication failed
**Solution:**
- Ensure 2FA is enabled on Gmail
- Generate a new App Password
- Update `SMTP_PASS` in Render

### Issue: Emails going to spam
**Solution:**
- This is normal for new sending domains
- Users should check spam folder
- Consider using a dedicated email service (SendGrid, Mailgun) for production

## Production Best Practices

1. **Use Dedicated Email Service**
   - For production, consider using:
     - SendGrid (free tier: 100 emails/day)
     - Mailgun (free tier: 5,000 emails/month)
     - AWS SES (very cheap, reliable)
   
2. **Monitor Email Delivery**
   - Set up logging for failed emails
   - Track delivery rates
   - Monitor bounce rates

3. **Rate Limiting**
   - Gmail has sending limits (500 emails/day for free accounts)
   - Implement rate limiting on OTP requests
   - Consider caching OTPs to prevent abuse

4. **Security**
   - Never commit SMTP credentials to git
   - Rotate App Passwords periodically
   - Use environment variables for all secrets

## Next Steps

1. ✅ Update render.yaml (completed)
2. ⏳ Add SMTP environment variables in Render Dashboard
3. ⏳ Deploy and test
4. ⏳ Monitor logs for successful email sending

## Support

If you continue to experience issues:
1. Check Render logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test SMTP connection using `server/test-email-otp.js` locally
4. Consider switching to a dedicated email service for production
