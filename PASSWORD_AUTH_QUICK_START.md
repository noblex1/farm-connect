# Password Authentication - Quick Start

## 🚀 For Users

### Register
1. Go to `/create-account`
2. Fill in:
   - Name
   - **Email** (new)
   - Phone
   - **Password** (new, min 6 chars)
   - Location
3. Click "Create Account"

### Login
1. Go to `/login`
2. Enter **email OR phone**
3. Enter **password**
4. Click "Login"

## 💻 For Developers

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+233201234567",
    "password": "securePass123",
    "role": "farmer",
    "location": "Accra"
  }'
```

### Test Login (Email)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "john@example.com",
    "password": "securePass123"
  }'
```

### Test Login (Phone)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "+233201234567",
    "password": "securePass123"
  }'
```

## 🔧 Setup

### Install Dependencies
```bash
cd server && npm install  # Installs bcryptjs
cd client && npm install
```

### Start Development
```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm run dev
```

### Test Password Hashing
```bash
node server/test-password-auth.js
```

## 🔄 Migration (Existing Users)

### Run Migration Script
```bash
node server/src/utils/migrateUsersToPasswordAuth.js
```

This creates:
- Temporary emails: `user{phone}@farmmarket.temp`
- Default password: `ChangeMe123!`

**Tell users to:**
1. Login with temporary credentials
2. Update email in profile
3. Change password

## 📋 What Changed

| Before | After |
|--------|-------|
| Phone only | Email/Phone + Password |
| No password | Password required (min 6 chars) |
| Email optional | Email required & unique |

## 🔐 Security

- ✅ Passwords hashed with bcrypt
- ✅ 10 salt rounds
- ✅ Passwords never in plain text
- ✅ Passwords excluded from queries
- ✅ Secure comparison

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Email already registered" | Use different email or login |
| "Password must be at least 6 characters" | Use longer password |
| "Invalid credentials" | Check email/phone and password |
| Existing users can't login | Run migration script |

## 📚 Documentation

- **PASSWORD_AUTH_GUIDE.md** - Complete guide
- **PASSWORD_AUTH_MIGRATION.md** - Migration steps
- **AUTH_SYSTEM_COMPLETE.md** - Full summary

## ✅ Checklist

### Before Deployment
- [ ] Install dependencies
- [ ] Test registration
- [ ] Test login (email)
- [ ] Test login (phone)
- [ ] Run migration (if needed)
- [ ] Test password hashing
- [ ] Backup database

### After Deployment
- [ ] Notify users about changes
- [ ] Monitor for errors
- [ ] Help users with migration
- [ ] Update user documentation

## 🎯 Quick Test

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phoneNumber":"+233201234567","password":"test123","role":"farmer","location":"Accra"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@test.com","password":"test123"}'

# 3. Should return token and user data
```

## 📞 Need Help?

1. Check **PASSWORD_AUTH_GUIDE.md**
2. Review error messages
3. Check server logs
4. Test with curl/Postman

---

**Version**: 2.0.0  
**Status**: ✅ Ready  
**Breaking Change**: Yes
