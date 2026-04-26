# Password Authentication Migration Guide

## Overview

The authentication system has been upgraded from **phone-only authentication** to **email/phone + password authentication** for enhanced security.

## What Changed

### Before (Phone-Only Auth)
- Users logged in with just their phone number
- No password required
- Less secure

### After (Email/Phone + Password Auth)
- Users must provide email, phone, AND password during registration
- Login requires email/phone AND password
- More secure with bcrypt password hashing

## Breaking Changes

⚠️ **IMPORTANT**: This is a breaking change. Existing users in the database will need to be migrated or re-registered.

### Database Schema Changes

**User Model - New Fields:**
- `email` - Now **required** and **unique** (was optional)
- `password` - New **required** field (hashed with bcrypt)

**User Model - Updated Fields:**
- `phoneNumber` - Still required and unique
- All other fields remain the same

### API Changes

**Registration Endpoint (`POST /api/auth/register`)**

Before:
```json
{
  "name": "John Doe",
  "phoneNumber": "+233201234567",
  "role": "farmer",
  "location": "Accra"
}
```

After:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+233201234567",
  "password": "securePassword123",
  "role": "farmer",
  "location": "Accra"
}
```

**Login Endpoint (`POST /api/auth/login`)**

Before:
```json
{
  "phoneNumber": "+233201234567"
}
```

After:
```json
{
  "emailOrPhone": "john@example.com",
  "password": "securePassword123"
}
```

OR

```json
{
  "emailOrPhone": "+233201234567",
  "password": "securePassword123"
}
```

## Migration Steps

### 1. Backup Your Database

```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=./backup
```

### 2. Install Dependencies

Server dependencies are already updated. Run:

```bash
cd server
npm install
```

This installs `bcryptjs` for password hashing.

### 3. Handle Existing Users

You have three options:

#### Option A: Drop Existing Users (Development Only)

```javascript
// In MongoDB shell or script
db.users.drop()
```

Then have all users re-register with the new system.

#### Option B: Migrate Existing Users (Recommended for Production)

Create a migration script to add email and password to existing users:

```javascript
// server/src/utils/migrateUsers.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function migrateUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const users = await User.find({ email: { $exists: false } });
  
  for (const user of users) {
    // Generate email from phone number
    const email = `user${user.phoneNumber.replace(/\+/g, '')}@farmmarket.temp`;
    
    // Set a temporary password (users should change this)
    const tempPassword = "ChangeMe123!";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);
    
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          email: email,
          password: hashedPassword
        }
      }
    );
    
    console.log(`Migrated user: ${user.name} - Email: ${email}`);
  }
  
  console.log(`Migrated ${users.length} users`);
  await mongoose.disconnect();
}

migrateUsers().catch(console.error);
```

Run the migration:
```bash
node server/src/utils/migrateUsers.js
```

**Important**: Notify users to:
1. Login with their temporary email and password
2. Update their email in profile settings
3. Change their password

#### Option C: Add Password Reset Flow

Implement a "forgot password" or "set password" flow for existing users.

### 4. Update Environment Variables

No new environment variables needed. Existing JWT configuration works.

### 5. Test the Changes

```bash
# Start server
cd server
npm start

# Start client (in another terminal)
cd client
npm run dev
```

Test:
1. Register a new user with email, phone, and password
2. Login with email and password
3. Login with phone and password
4. Try invalid credentials (should fail)
5. Test protected routes

## Security Improvements

### Password Hashing
- Uses bcryptjs with salt rounds of 10
- Passwords are never stored in plain text
- Passwords are excluded from queries by default (`select: false`)

### Password Validation
- Minimum 6 characters (configurable)
- Validated on both client and server
- Clear error messages

### Login Security
- Accepts email OR phone number
- Generic error messages to prevent user enumeration
- Password comparison using bcrypt

## Client-Side Changes

### Login Form
- Now requires email/phone AND password
- Updated validation schema
- New password input field with type="password"

### Registration Form
- Added email field (required)
- Added password field (required)
- Updated validation schema
- Better error handling

### API Client
- Updated `registerUser()` to include email and password
- Updated `loginUser()` to use emailOrPhone and password
- All other API functions unchanged

## Testing

### Manual Testing Checklist

- [ ] Register with email, phone, and password
- [ ] Login with email and password
- [ ] Login with phone and password
- [ ] Try to register with existing email (should fail)
- [ ] Try to register with existing phone (should fail)
- [ ] Try to login with wrong password (should fail)
- [ ] Try to login with non-existent user (should fail)
- [ ] Verify password is not returned in API responses
- [ ] Verify password is hashed in database
- [ ] Test all protected routes still work
- [ ] Test profile updates still work

### Automated Testing

Update existing tests to include password:

```typescript
// Example test update
const testUser = {
  name: "Test User",
  email: "test@example.com",
  phoneNumber: "+233201234567",
  password: "testPassword123",
  role: "farmer",
  location: "Accra"
};
```

## Rollback Plan

If you need to rollback:

1. Restore database from backup
2. Revert code changes:
   ```bash
   git revert <commit-hash>
   ```
3. Reinstall dependencies:
   ```bash
   cd server && npm install
   cd client && npm install
   ```

## Common Issues

### Issue: "Email already registered"
**Solution**: Email must be unique. Use a different email or login instead.

### Issue: "Password must be at least 6 characters"
**Solution**: Use a longer password (minimum 6 characters).

### Issue: "Invalid credentials"
**Solution**: Check email/phone and password are correct. Passwords are case-sensitive.

### Issue: Existing users can't login
**Solution**: Run the migration script or have users re-register.

### Issue: Password field not in database
**Solution**: Ensure you've run `npm install` in the server directory and restarted the server.

## Production Recommendations

### Immediate
1. ✅ Use strong passwords (minimum 8-12 characters)
2. ✅ Implement password strength indicator on client
3. ✅ Add "forgot password" functionality
4. ✅ Add "change password" in user profile

### Short Term
5. ✅ Implement rate limiting on login endpoint
6. ✅ Add account lockout after failed attempts
7. ✅ Log authentication attempts
8. ✅ Add email verification

### Long Term
9. ✅ Implement two-factor authentication (2FA)
10. ✅ Add OAuth/social login options
11. ✅ Implement session management (view/revoke sessions)
12. ✅ Add security audit logs

## Updated Documentation

The following documentation files need to be updated:
- ✅ `AUTHENTICATION_GUIDE.md` - Update with password auth
- ✅ `AUTH_QUICK_REFERENCE.md` - Update API examples
- ✅ `AUTH_FLOW_DIAGRAM.md` - Update flow diagrams
- ✅ `AUTH_TEST_CHECKLIST.md` - Update test cases

## Support

### For Developers
- Review `server/src/models/User.js` for schema changes
- Review `server/src/controllers/authController.js` for logic changes
- Review `client/src/pages/FarmerLogin.tsx` for UI changes
- Review `client/src/pages/FarmerCreateAccount.tsx` for UI changes

### For Users
- Users will need to create new accounts with email and password
- Existing users (if migrated) will receive temporary credentials
- Users should update their email and password after first login

## Timeline

1. **Development**: ✅ Complete
2. **Testing**: In Progress
3. **Migration Script**: Create if needed
4. **User Communication**: Before deployment
5. **Deployment**: After testing
6. **Monitoring**: After deployment

## Questions?

- Check the updated `AUTHENTICATION_GUIDE.md`
- Review error messages in browser console
- Check server logs for detailed errors
- Test with Postman/curl to isolate issues

---

**Migration Date**: 2026-04-26  
**Version**: 2.0.0  
**Breaking Change**: Yes  
**Rollback Available**: Yes (with database backup)
