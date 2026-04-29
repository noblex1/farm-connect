# 🚀 Quick Fix Guide - OTP Email Not Working in Production

## The Problem
❌ OTP emails fail on production site
✅ OTP emails work on localhost

## The Solution (5 Minutes)

### Step 1: Go to Render Dashboard
🔗 https://dashboard.render.com/

### Step 2: Select Your Service
Click on: **farm-market-api**

### Step 3: Add Environment Variables
1. Click **"Environment"** in the left sidebar
2. Click **"Add Environment Variable"** button
3. Add these 6 variables:

| Variable Name | Value |
|--------------|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `mrgem156@gmail.com` |
| `SMTP_PASS` | `ljwdjcfitdhvvbjr` |
| `SMTP_FROM` | `mrgem156@gmail.com` |

### Step 4: Save and Deploy
1. Click **"Save Changes"**
2. Wait 2-3 minutes for auto-deployment
3. ✅ Done!

## Test It Works

1. Go to: https://farm-connect-one-navy.vercel.app
2. Click "Forgot Password"
3. Enter your email
4. Click "Send Reset Code"
5. Check your email inbox
6. ✅ You should receive OTP within 10 seconds

## What If It Still Doesn't Work?

### Check Render Logs
1. In Render dashboard, click **"Logs"** tab
2. Look for: `📧 Using configured SMTP: smtp.gmail.com`
3. If you see this → SMTP is configured ✅
4. If you don't see this → Variables not loaded, try redeploying

### Verify Variables Are Set
1. Go to **Environment** tab in Render
2. You should see all 6 SMTP variables listed
3. If any are missing, add them again

### Still Not Working?
Run the verification script locally:
```bash
cd server
node verify-smtp-config.js
```

This will test your SMTP connection and show any errors.

## Why This Happened

Your local `.env` file has SMTP configuration, but Render didn't have these environment variables set. The code needs these variables to connect to Gmail's SMTP server and send emails.

## Files Updated

- ✅ `server/render.yaml` - Added SMTP variables
- ✅ `server/.env.example` - Updated with instructions
- ✅ `server/verify-smtp-config.js` - New verification tool

## Need More Help?

📖 Read the detailed guide: `PRODUCTION_SETUP.md`
📋 Full summary: `OTP_FIX_SUMMARY.md`

---

**Time to Fix**: 5 minutes
**Difficulty**: Easy
**Impact**: Fixes OTP emails for all users
