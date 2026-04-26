# Authentication System Guide

## Overview

This application uses a **phone number-based authentication system** with JWT tokens. Users can register and login using only their phone number - no password required.

## Architecture

### Client-Side Components

1. **Session Management** (`client/src/lib/session.ts`)
   - Stores JWT token and user data in localStorage
   - Provides utilities for session management
   - Methods: `getToken()`, `setToken()`, `clearSession()`, `isAuthenticated()`

2. **Auth Utilities** (`client/src/lib/auth.ts`)
   - `logout()` - Clear session and redirect to login
   - `hasRole(role)` - Check if user has specific role
   - `getCurrentRole()` - Get current user's role
   - `isTokenLikelyExpired()` - Check if JWT token is expired

3. **Protected Routes** (`client/src/components/auth/RequireAuth.tsx`)
   - Wraps routes that require authentication
   - Checks for valid token and user session
   - Validates user roles against allowed roles
   - Redirects to login if unauthorized

4. **Login Page** (`client/src/pages/FarmerLogin.tsx`)
   - Phone number input with validation
   - Role-based login (farmer/buyer)
   - Redirects to appropriate dashboard after login

5. **Registration Page** (`client/src/pages/FarmerCreateAccount.tsx`)
   - Collects: name, phone number, location
   - Role selection (farmer/buyer)
   - Creates account and auto-logs in user

### Server-Side Components

1. **Auth Controller** (`server/src/controllers/authController.js`)
   - `registerUser` - Create new user account
   - `loginUser` - Authenticate existing user
   - `getCurrentUser` - Get authenticated user details
   - `updateCurrentUser` - Update user profile

2. **Auth Middleware** (`server/src/middlewares/authMiddleware.js`)
   - `protect` - Verify JWT token and attach user to request
   - `authorize(...roles)` - Check if user has required role

3. **User Model** (`server/src/models/User.js`)
   - Fields: name, phoneNumber, role, location, profilePicture, email, whatsappNumber
   - Roles: farmer, buyer, admin
   - Phone number is unique identifier

## Authentication Flow

### Registration Flow

1. User fills registration form (name, phone, location, role)
2. Client validates input using Zod schema
3. Client sends POST request to `/api/auth/register`
4. Server validates input using express-validator
5. Server checks if phone number already exists
6. Server creates new user in database
7. Server generates JWT token
8. Server returns token and user data
9. Client stores token and user in localStorage
10. Client redirects to role-specific dashboard

### Login Flow

1. User enters phone number
2. Client validates phone number format
3. Client sends POST request to `/api/auth/login`
4. Server validates phone number
5. Server finds user by phone number
6. Server generates JWT token
7. Server returns token and user data
8. Client stores token and user in localStorage
9. Client redirects to role-specific dashboard

### Protected Route Access

1. User navigates to protected route
2. `RequireAuth` component checks for token and user
3. Component validates token expiration
4. Component checks user role against allowed roles
5. If valid: render route content
6. If invalid: redirect to login with return URL

### API Request Authentication

1. Client retrieves token from localStorage
2. Client adds `Authorization: Bearer <token>` header
3. Server `protect` middleware extracts token
4. Server verifies token signature and expiration
5. Server loads user from database
6. Server attaches user to request object
7. Request proceeds to controller

## Security Features

### Implemented

✅ **JWT Token Authentication**
- Tokens expire after 14 days (configurable)
- Tokens include user ID, role, and phone number
- Server validates token signature on every request

✅ **Role-Based Access Control (RBAC)**
- Three roles: farmer, buyer, admin
- Routes protected by role requirements
- Middleware enforces role permissions

✅ **Input Validation**
- Client-side validation with Zod
- Server-side validation with express-validator
- Phone number format validation
- Field length and type validation

✅ **Session Management**
- Automatic token expiration detection
- Session cleanup on logout
- Invalid token handling with redirect

✅ **Error Handling**
- Specific error messages for different scenarios
- 401 errors trigger automatic logout
- User-friendly error messages

### Security Considerations

⚠️ **No Password Authentication**
- Current system uses phone number only
- Anyone with a phone number can login
- Consider adding SMS OTP verification for production

⚠️ **Token Storage**
- Tokens stored in localStorage (vulnerable to XSS)
- Consider using httpOnly cookies for production

⚠️ **No Token Refresh**
- Tokens expire after 14 days
- Users must login again after expiration
- Consider implementing refresh token mechanism

⚠️ **No Rate Limiting on Auth Endpoints**
- Login/register endpoints not rate-limited
- Vulnerable to brute force attacks
- Rate limiter exists but not applied to auth routes

## API Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "Amina Yakubu",
  "phoneNumber": "+233201234567",
  "role": "farmer",
  "location": "Tamale"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Amina Yakubu",
    "phoneNumber": "+233201234567",
    "role": "farmer",
    "location": "Tamale",
    "profilePicture": "",
    "email": "",
    "whatsappNumber": "+233201234567"
  }
}
```

### POST /api/auth/login
Login with existing account.

**Request Body:**
```json
{
  "phoneNumber": "+233201234567"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Amina Yakubu",
    "phoneNumber": "+233201234567",
    "role": "farmer",
    "location": "Tamale",
    "profilePicture": "",
    "email": "",
    "whatsappNumber": "+233201234567"
  }
}
```

### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Amina Yakubu",
    "phoneNumber": "+233201234567",
    "role": "farmer",
    "location": "Tamale",
    "profilePicture": "https://cloudinary.com/...",
    "email": "amina@example.com",
    "whatsappNumber": "+233201234567"
  }
}
```

### PUT /api/auth/me
Update current user profile.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- name (optional)
- location (optional)
- email (optional)
- whatsappNumber (optional)
- profilePicture (optional, file)

## Usage Examples

### Using LogoutButton Component

```tsx
import { LogoutButton } from "@/components/LogoutButton";

function Header() {
  return (
    <header>
      <LogoutButton variant="outline" size="default" />
    </header>
  );
}
```

### Checking User Role

```tsx
import { hasRole, getCurrentRole } from "@/lib/auth";

function AdminPanel() {
  if (!hasRole("admin")) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}

function Dashboard() {
  const role = getCurrentRole();
  
  return (
    <div>
      <h1>Welcome {role}!</h1>
    </div>
  );
}
```

### Protected Routes

```tsx
import { RequireAuth } from "@/components/auth/RequireAuth";

<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/create-account" element={<CreateAccount />} />
  
  {/* Farmer-only routes */}
  <Route element={<RequireAuth allowedRoles={["farmer"]} />}>
    <Route path="/farmer" element={<FarmerDashboard />} />
    <Route path="/post" element={<PostProduce />} />
  </Route>
  
  {/* Buyer-only routes */}
  <Route element={<RequireAuth allowedRoles={["buyer"]} />}>
    <Route path="/buyer" element={<BuyerMarketplace />} />
  </Route>
  
  {/* Multi-role routes */}
  <Route element={<RequireAuth allowedRoles={["farmer", "buyer", "admin"]} />}>
    <Route path="/profile" element={<UserProfile />} />
  </Route>
</Routes>
```

### Manual Logout

```tsx
import { logout } from "@/lib/auth";

function handleLogout() {
  if (confirm("Are you sure?")) {
    logout(); // Clears session and redirects to login
  }
}
```

## Testing

Run authentication tests:

```bash
cd client
npm run test auth.test.ts
```

Tests cover:
- Session storage and retrieval
- Token validation
- Role checking
- Expiration detection

## Recommendations for Production

1. **Add SMS OTP Verification**
   - Send verification code to phone number
   - Verify code before creating account or logging in
   - Use services like Twilio, AWS SNS, or Africa's Talking

2. **Implement Refresh Tokens**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (30 days)
   - Automatic token refresh before expiration

3. **Use HTTP-Only Cookies**
   - Store tokens in secure, httpOnly cookies
   - Prevents XSS attacks
   - Requires CORS configuration

4. **Add Rate Limiting**
   - Limit login attempts per IP
   - Limit registration attempts per IP
   - Prevent brute force attacks

5. **Add Account Verification**
   - Email verification for email field
   - Phone verification via SMS
   - Verified badge on profiles

6. **Implement Password Option**
   - Allow users to set optional password
   - Two-factor authentication
   - More secure than phone-only

7. **Add Session Management**
   - Track active sessions
   - Allow users to view/revoke sessions
   - Detect suspicious login locations

8. **Enhance Logging**
   - Log all authentication attempts
   - Track failed login attempts
   - Monitor for suspicious activity

## Environment Variables

Required environment variables:

**Server (.env):**
```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=14d
MONGO_URI=mongodb://...
PORT=5000
CLIENT_ORIGIN=http://localhost:8080
```

**Client (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Troubleshooting

### "Authorization token is required"
- Token not in localStorage
- Token not sent in Authorization header
- Solution: Login again

### "Session expired. Please login again."
- JWT token has expired
- Solution: Login again to get new token

### "User account no longer exists"
- User was deleted from database
- Solution: Create new account

### "This number is registered as [role]"
- Trying to login with wrong role
- Solution: Use correct login page for your role

### Token expires too quickly
- Adjust JWT_EXPIRES_IN in server .env
- Default is 14 days
- Example: JWT_EXPIRES_IN=30d

## Support

For issues or questions about authentication:
1. Check this guide first
2. Review error messages in browser console
3. Check server logs for detailed errors
4. Verify environment variables are set correctly
