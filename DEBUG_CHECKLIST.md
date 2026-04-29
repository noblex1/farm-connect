# 🔍 Debug Checklist - OTP Not Received

## Quick Diagnosis

Run these commands in order and report what you see:

### 1. Test Direct Email (Should Work)
```bash
cd server
node test-direct-email.js
```

**Expected:** ✅ Email received in inbox or SPAM

---

### 2. Test Registration OTP Flow
```bash
cd server
node test-registration-otp.js
```

**Watch for:**
- ✅ OTP Generated
- ✅ Email sent to YOUR address
- ❌ Email sent to different address (may fail)

---

### 3. Start Server and Watch Logs
```bash
cd server
npm run dev
```

**Look for:**
```
📧 Using configured SMTP: smtp.gmail.com
📧 SMTP User: mrgem156@gmail.com
```

---

### 4. Test Registration in Browser

1. Go to http://localhost:8080/create-account
2. Fill form with **YOUR email** (mrgem156@gmail.com)
3. Submit
4. **Watch server console carefully**

**You should see:**
```
📧 Generated OTP for registration: 123456
📧 Sending to email: mrgem156@gmail.com
📧 User name: Your Name
✅ OTP stored in database
📧 Attempting to send registration OTP email...
📧 Attempting to send registration OTP to: mrgem156@gmail.com
✅ Registration OTP email sent successfully!
📧 Message ID: <abc@gmail.com>
📧 Response: 250 2.0.0 OK
```

---

## Diagnosis Results

### Scenario A: Test Email Works, Registration Doesn't

**Symptoms:**
- ✅ `test-direct-email.js` sends successfully
- ❌ Registration OTP never arrives
- ✅ Server logs show "email sent successfully"

**Likely Causes:**
1. Gmail blocking non-Gmail addresses
2. Rate limiting (too many emails)
3. Email going to SPAM (check thoroughly!)
4. Recipient's email provider blocking

**Solutions:**
1. Test with Gmail addresses ONLY
2. Wait 24 hours if rate limited
3. Check SPAM folder on recipient's email
4. Use SendGrid for production

---

### Scenario B: Server Shows Errors

**Symptoms:**
- ❌ Server logs show error messages
- ❌ User sees error on screen

**Check Error Code:**

**EAUTH:**
```
❌ Error: Authentication failed
```
**Fix:** Invalid App Password
1. Generate new App Password
2. Update SMTP_PASS in .env
3. Restart server

**ETIMEDOUT:**
```
❌ Error: Connection timeout
```
**Fix:** Network/firewall issue
1. Check firewall
2. Try different network
3. Disable antivirus temporarily

**ESOCKET:**
```
❌ Error: Cannot connect
```
**Fix:** Port blocked
1. Check if port 587 is open
2. Try port 465 with SMTP_SECURE=true

---

### Scenario C: No Logs at All

**Symptoms:**
- ❌ No email logs in console
- ❌ No "Generated OTP" messages
- ❌ No "Attempting to send" messages

**Likely Causes:**
1. Code not updated
2. Server not restarted
3. Wrong endpoint being called

**Solutions:**
1. Pull latest code
2. Restart server completely
3. Clear browser cache
4. Check network tab in browser

---

## Gmail Limitations

### Known Issues with Gmail SMTP

1. **Rate Limits:**
   - 500 emails per day
   - 100 emails per hour
   - Blocks after limit reached

2. **Recipient Restrictions:**
   - May block non-Gmail addresses
   - May block certain domains
   - May block bulk sending

3. **Content Filtering:**
   - Scans email content
   - May block certain keywords
   - May block HTML emails

4. **Security:**
   - Requires App Password
   - May block suspicious activity
   - May require CAPTCHA

### Workarounds

1. **Test with Gmail addresses only**
   - Use Gmail for testing
   - Verify it works with Gmail
   - Then test other providers

2. **Wait between sends**
   - Don't send too many at once
   - Wait 1-2 minutes between tests
   - Reset after 24 hours

3. **Use SendGrid for production**
   - No rate limits (100/day free)
   - Better deliverability
   - Works with all email providers

---

## Email Provider Comparison

### Gmail SMTP
- ✅ Free
- ✅ Easy setup
- ❌ Rate limited
- ❌ May block non-Gmail
- ❌ Can be marked as SPAM
- **Use for:** Testing only

### SendGrid
- ✅ 100 emails/day free
- ✅ Excellent deliverability
- ✅ Works with all providers
- ✅ Email analytics
- ✅ No SPAM issues
- **Use for:** Production

### Mailgun
- ✅ 5,000 emails/month free
- ✅ Good deliverability
- ✅ Email tracking
- ❌ Requires credit card
- **Use for:** Production

---

## Step-by-Step Debugging

### Step 1: Verify SMTP Works
```bash
node test-direct-email.js
```
- ✅ If works: SMTP is configured correctly
- ❌ If fails: Fix SMTP configuration first

### Step 2: Test OTP Generation
```bash
node test-registration-otp.js
```
- ✅ If OTP generated: Code is working
- ❌ If fails: Check imports

### Step 3: Test with YOUR Email
- Register with mrgem156@gmail.com
- Watch server logs
- Check inbox AND SPAM
- ✅ If received: Gmail SMTP works
- ❌ If not received: Check logs for errors

### Step 4: Test with Different Email
- Register with another email
- Watch server logs
- Check inbox AND SPAM
- ✅ If received: Everything works!
- ❌ If not received: Gmail blocking non-Gmail addresses

### Step 5: Check Rate Limits
- How many emails sent today?
- Wait 24 hours if over limit
- Use SendGrid for production

---

## Common Mistakes

### 1. Not Checking SPAM
**Problem:** Email is in SPAM folder
**Solution:** Always check SPAM first!

### 2. Using Wrong Email
**Problem:** Testing with non-Gmail address
**Solution:** Test with Gmail first

### 3. Not Restarting Server
**Problem:** Old code still running
**Solution:** Restart server after code changes

### 4. Rate Limited
**Problem:** Sent too many emails
**Solution:** Wait 24 hours

### 5. Wrong Environment
**Problem:** Testing production, not localhost
**Solution:** Make sure you're on localhost

---

## Production Checklist

Before deploying to production:

- [ ] Test with Gmail addresses
- [ ] Test with non-Gmail addresses
- [ ] Check SPAM folder
- [ ] Verify error handling
- [ ] Set up SendGrid account
- [ ] Update SMTP credentials
- [ ] Test on production
- [ ] Monitor email delivery
- [ ] Set up error alerts

---

## Quick Reference

### Test Commands
```bash
# Test direct email
node test-direct-email.js

# Test registration OTP
node test-registration-otp.js

# Start server
npm run dev
```

### Check Logs For
```
✅ Good: "Using configured SMTP: smtp.gmail.com"
✅ Good: "Registration OTP email sent successfully!"
❌ Bad:  "SMTP not configured"
❌ Bad:  "Error sending registration OTP email"
```

### Where to Check
1. Server console (terminal)
2. Browser console (F12)
3. Email inbox
4. Email SPAM folder
5. Email Promotions tab (Gmail)
6. Email All Mail (search "Farm Market")

---

## Need Help?

### Information to Provide

1. **Test results:**
   - Does `test-direct-email.js` work?
   - Does `test-registration-otp.js` work?

2. **Server logs:**
   - Copy full logs from registration attempt
   - Include any error messages

3. **Email details:**
   - What email address are you testing with?
   - Is it Gmail or another provider?
   - Did you check SPAM folder?

4. **Environment:**
   - Localhost or production?
   - What hosting platform?
   - Are environment variables set?

---

**Start with Step 1 and work through each step systematically.** 🔍
