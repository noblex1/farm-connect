# Password Authentication - Complete Guide

## 📖 Overview

The Farm Market application now uses **email/phone + password authentication** for secure user access.

## 🎯 Key Features

- ✅ Email or phone number login
- ✅ Secure password hashing with bcrypt
- ✅ Password validation (minimum 6 characters)
- ✅ Email uniqueness validation
- ✅ Phone uniqueness validation
- ✅ Role-based access control (Farmer, Buyer, Admin)

## 🚀 Quick Start

### For Users

**Create Account:**
1. Go to `/create-account`
2. Fill in:
   - Full Name
   - Email Address
   - Phone Number
   - Password (min 6 characters)
   - Location
3. Select role (Farmer or Buyer)
4. Click "Create Account"

**Login:**
1. Go to `/login`
2. Enter email OR phone number
3. Enter password
4. Click "Login"

### For Developers

**Test Registration:**
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

**Test Login (with email):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "john@example.com",
    "password": "securePass123"
  }'
```

**Test Login (with phone):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "+233201234567",
    "password": "securePass123"
  }'
```

## 🔐 Security Details

### Password Hashing

Passwords are hashed using **bcrypt** with the following settings:
- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Hash Length**: 60 characters
- **Storage**: Hashed passwords stored in database
- **Comparison**: Secure comparison using bcrypt.compare()

**Example:**
```
Original: MyPassword123
Hashed:   $2a$10$UQj0QeifXsxh5KBl0QrSAu8Vt/STz227V1Dhlc0cBqzgqsc/eUjb.
```

### Password Requirements

**Minimum Requirements:**
- At least 6 characters long
- No maximum length (reasonable limits apply)

**Recommended:**
- At least 8-12 characters
- Mix of uppercase and lowercase
- Include numbers
- Include special characters

### Database Security

**Password Field:**
```javascript
password: {
  type: String,
  required: true,
  minlength: 6,
  select: false  // Never returned in queries by default
}
```

**Querying Users:**
```javascript
// Normal query - password NOT included
const user = await User.findById(userId);
console.log(user.password); // undefined

// Explicit selection - password included
const user = await User.findById(userId).select("+password");
console.log(user.password); // hashed password
```

## 📋 API Reference

### POST /api/auth/register

Register a new user account.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+233201234567",
  "password": "securePassword123",
  "role": "farmer",
  "location": "Accra"
}
```

**Response (Success - 201):**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+233201234567",
    "role": "farmer",
    "location": "Accra",
    "profilePicture": "",
    "whatsappNumber": "+233201234567"
  }
}
```

**Response (Error - 409):**
```json
{
  "message": "Email already registered. Please login instead."
}
```

**Validation Rules:**
- `name`: 2-80 characters
- `email`: Valid email format, unique
- `phoneNumber`: Valid phone format (+?[0-9]{9,15}), unique
- `password`: Minimum 6 characters
- `role`: Must be "farmer" or "buyer"
- `location`: 2-80 characters

### POST /api/auth/login

Login with existing account.

**Request (with email):**
```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "john@example.com",
  "password": "securePassword123"
}
```

**Request (with phone):**
```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "+233201234567",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+233201234567",
    "role": "farmer",
    "location": "Accra",
    "profilePicture": "",
    "whatsappNumber": "+233201234567"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid credentials. Please check your email/phone and password."
}
```

**Validation Rules:**
- `emailOrPhone`: Required, can be email or phone number
- `password`: Required

### GET /api/auth/me

Get current authenticated user (unchanged).

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### PUT /api/auth/me

Update user profile (unchanged).

**Request:**
```http
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=John Doe
location=Accra
email=newemail@example.com
```

## 🎨 UI Components

### Login Form

**Fields:**
1. **Email or Phone Number**
   - Type: text
   - Placeholder: "email@example.com or +233201234567"
   - Icon: Mail
   - Required: Yes

2. **Password**
   - Type: password
   - Placeholder: "Enter your password"
   - Icon: Lock
   - Required: Yes
   - Min Length: 6

**Buttons:**
- Login (primary)
- Create Account (secondary)

### Registration Form

**Fields:**
1. **Full Name**
   - Type: text
   - Icon: UserRound
   - Required: Yes

2. **Email Address**
   - Type: email
   - Icon: Mail
   - Required: Yes

3. **Phone Number**
   - Type: tel
   - Icon: Phone
   - Required: Yes

4. **Password**
   - Type: password
   - Icon: Lock
   - Required: Yes
   - Min Length: 6

5. **Location**
   - Type: text
   - Icon: MapPin
   - Required: Yes

**Buttons:**
- Create Account (primary)
- Login instead (secondary)

## 🧪 Testing

### Manual Testing

**Registration Tests:**
```bash
# Valid registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phoneNumber":"+233201234567","password":"test123","role":"farmer","location":"Accra"}'

# Duplicate email (should fail)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User 2","email":"test@example.com","phoneNumber":"+233209876543","password":"test123","role":"farmer","location":"Accra"}'

# Short password (should fail)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test2@example.com","phoneNumber":"+233201234568","password":"12345","role":"farmer","location":"Accra"}'
```

**Login Tests:**
```bash
# Valid login with email
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"test123"}'

# Valid login with phone
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"+233201234567","password":"test123"}'

# Wrong password (should fail)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"wrongpass"}'
```

### Automated Testing

**Test Password Hashing:**
```bash
node server/test-password-auth.js
```

Expected output:
```
✅ PASS - Correct password accepted
✅ PASS - Wrong password rejected
✅ PASS - Case sensitivity works
```

## 🔄 Migration

### For Existing Users

If you have existing users without passwords, run the migration script:

```bash
node server/src/utils/migrateUsersToPasswordAuth.js
```

This will:
1. Generate temporary emails for users without email
2. Set default password: `ChangeMe123!`
3. Update all user records

**After Migration:**
- Notify users about their temporary credentials
- Ask users to login and change their password
- Ask users to update their email address

### Migration Output Example

```
🔄 Starting user migration to password authentication...

✅ Connected to database

📊 Found 5 users to migrate

✅ Migrated: John Farmer
   Email: user233201234567@farmmarket.temp
   Password: ChangeMe123!
   Role: farmer

✅ Migrated: Jane Buyer
   Email: user233209876543@farmmarket.temp
   Password: ChangeMe123!
   Role: buyer

...

📊 Migration Summary
✅ Successfully migrated: 5 users
❌ Failed: 0 users
📧 Default password: ChangeMe123!
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Email already registered"**
- **Cause**: Email is already in use
- **Solution**: Use a different email or login instead

**Issue: "Phone number already registered"**
- **Cause**: Phone number is already in use
- **Solution**: Use a different phone or login instead

**Issue: "Password must be at least 6 characters"**
- **Cause**: Password is too short
- **Solution**: Use a longer password (minimum 6 characters)

**Issue: "Invalid credentials"**
- **Cause**: Wrong email/phone or password
- **Solution**: Check your credentials. Passwords are case-sensitive.

**Issue: "User not found"**
- **Cause**: Account doesn't exist
- **Solution**: Create an account first

**Issue: Password not working after migration**
- **Cause**: Using old credentials
- **Solution**: Use temporary password `ChangeMe123!` and change it

### Debug Mode

**Check if password is hashed:**
```javascript
// In MongoDB shell
db.users.findOne({ email: "test@example.com" })
// password field should start with $2a$ or $2b$
```

**Check password comparison:**
```javascript
import bcrypt from "bcryptjs";

const password = "test123";
const hash = "$2a$10$..."; // from database

const isValid = await bcrypt.compare(password, hash);
console.log(isValid); // should be true
```

## 📊 Database Schema

### User Document

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "+233201234567",
  password: "$2a$10$UQj0QeifXsxh5KBl0QrSAu8Vt/STz227V1Dhlc0cBqzgqsc/eUjb.",
  role: "farmer",
  location: "Accra",
  profilePicture: "",
  whatsappNumber: "+233201234567",
  createdAt: ISODate("2026-04-26T10:00:00.000Z")
}
```

### Indexes

```javascript
// Unique indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phoneNumber: 1 }, { unique: true })

// Regular indexes
db.users.createIndex({ role: 1 })
db.users.createIndex({ location: 1 })
```

## 🚀 Best Practices

### For Users

1. **Use Strong Passwords**
   - At least 8-12 characters
   - Mix of letters, numbers, symbols
   - Don't reuse passwords

2. **Keep Credentials Safe**
   - Don't share your password
   - Don't write it down
   - Use a password manager

3. **Update Regularly**
   - Change password periodically
   - Update email if needed
   - Keep profile information current

### For Developers

1. **Never Log Passwords**
   ```javascript
   // ❌ BAD
   console.log("Password:", user.password);
   
   // ✅ GOOD
   console.log("User:", { ...user, password: "[REDACTED]" });
   ```

2. **Always Hash Passwords**
   ```javascript
   // ❌ BAD
   user.password = plainPassword;
   
   // ✅ GOOD
   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(plainPassword, salt);
   ```

3. **Use select: false**
   ```javascript
   // ❌ BAD
   const user = await User.findById(id);
   res.json(user); // includes password!
   
   // ✅ GOOD
   const user = await User.findById(id); // password excluded by default
   res.json(user); // safe
   ```

4. **Generic Error Messages**
   ```javascript
   // ❌ BAD
   if (!user) return res.status(401).json({ message: "Email not found" });
   if (!isValid) return res.status(401).json({ message: "Wrong password" });
   
   // ✅ GOOD
   if (!user || !isValid) {
     return res.status(401).json({ message: "Invalid credentials" });
   }
   ```

## 📚 Additional Resources

- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🎯 Next Steps

### Immediate
1. Test registration and login
2. Verify password hashing
3. Test all user flows

### Short Term
4. Implement "Forgot Password"
5. Add "Change Password" feature
6. Add password strength indicator
7. Implement email verification

### Long Term
8. Add two-factor authentication
9. Implement OAuth/social login
10. Add session management
11. Implement account lockout

## 📞 Support

For issues or questions:
1. Check this guide
2. Review error messages
3. Check server logs
4. Test with curl/Postman
5. Review migration guide

---

**Version**: 2.0.0  
**Last Updated**: 2026-04-26  
**Status**: ✅ Production Ready
