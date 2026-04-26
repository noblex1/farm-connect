# Authentication System

> Phone number-based authentication with JWT tokens and role-based access control

## 🚀 Quick Start

### For Users

**Register:**
1. Go to `/create-account`
2. Enter your name, phone number, and location
3. Select your role (Farmer or Buyer)
4. Click "Create Account"

**Login:**
1. Go to `/login`
2. Enter your phone number
3. Click "Login"

**Logout:**
- Click the logout button in the navigation

### For Developers

**Add logout button:**
```tsx
import { LogoutButton } from "@/components/LogoutButton";
<LogoutButton />
```

**Check user role:**
```tsx
import { hasRole } from "@/lib/auth";
if (hasRole("farmer")) {
  // Farmer-specific code
}
```

**Protect a route:**
```tsx
import { RequireAuth } from "@/components/auth/RequireAuth";
<Route element={<RequireAuth allowedRoles={["farmer"]} />}>
  <Route path="/farmer" element={<FarmerDashboard />} />
</Route>
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md) | Quick code snippets and common tasks |
| [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) | Complete system documentation |
| [AUTH_FLOW_DIAGRAM.md](AUTH_FLOW_DIAGRAM.md) | Visual flow diagrams |
| [AUTH_TEST_CHECKLIST.md](AUTH_TEST_CHECKLIST.md) | Testing checklist |
| [AUTHENTICATION_IMPROVEMENTS.md](AUTHENTICATION_IMPROVEMENTS.md) | What changed and why |
| [AUTHENTICATION_SUMMARY.md](AUTHENTICATION_SUMMARY.md) | Complete summary |

## 🎯 Features

- ✅ Phone number-based authentication
- ✅ JWT token management
- ✅ Role-based access control (Farmer, Buyer, Admin)
- ✅ Protected routes
- ✅ Automatic token expiration handling
- ✅ Session management
- ✅ Loading states and error handling
- ✅ Logout confirmation

## 🔐 Security

- JWT tokens with 14-day expiration
- Role-based route protection
- Automatic session cleanup on token expiration
- Input validation on client and server
- Secure token storage in localStorage

## 🎨 User Roles

| Role | Permissions |
|------|-------------|
| **Farmer** | Post produce, manage listings |
| **Buyer** | Browse marketplace, view listings |
| **Admin** | Full access to all features |

## 🛠️ Tech Stack

- **Client**: React, TypeScript, React Router, Zod
- **Server**: Node.js, Express, JWT, MongoDB
- **Testing**: Vitest

## 📦 Installation

Already installed! The authentication system is integrated into the application.

## 🧪 Testing

```bash
# Run unit tests
cd client
npm run test auth.test.ts

# Manual testing
# See AUTH_TEST_CHECKLIST.md
```

## 🔧 Configuration

### Server Environment Variables
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=14d
MONGO_URI=mongodb://...
```

### Client Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📖 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login existing user |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/me` | PUT | Update user profile |

## 🐛 Common Issues

**"Authorization token is required"**
- Solution: Login again to get a new token

**"Session expired"**
- Solution: Token has expired, login again

**"Phone number already registered"**
- Solution: Use login instead of register

See [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md) for more troubleshooting.

## 🚀 Production Recommendations

1. **Add SMS OTP verification** - Verify phone numbers
2. **Implement rate limiting** - Prevent brute force attacks
3. **Use HTTP-only cookies** - More secure than localStorage
4. **Add refresh tokens** - Better token management

See [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for detailed recommendations.

## 📝 Code Examples

### Logout
```tsx
import { logout } from "@/lib/auth";

function handleLogout() {
  logout(); // Clears session and redirects
}
```

### Check Authentication
```tsx
import { sessionStore } from "@/lib/session";

if (sessionStore.isAuthenticated()) {
  // User is logged in
}
```

### Get Current User
```tsx
import { useCurrentUser } from "@/hooks/useCurrentUser";

function Profile() {
  const { data, isLoading } = useCurrentUser();
  return <div>Welcome {data?.user.name}!</div>;
}
```

## 🤝 Contributing

1. Read the documentation
2. Follow existing patterns
3. Add tests for new features
4. Update documentation
5. Test thoroughly

## 📞 Support

1. Check [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md)
2. Read [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)
3. Review error messages in console
4. Check server logs

## ✨ What's New

- Enhanced session management
- New auth utilities module
- LogoutButton component
- Loading states in forms
- Better error handling
- Token expiration checking
- Comprehensive documentation
- Unit tests

## 📊 Status

- ✅ Registration working
- ✅ Login working
- ✅ Logout working
- ✅ Protected routes working
- ✅ Role-based access working
- ✅ Session management working
- ✅ Error handling working
- ✅ Tests passing
- ✅ Build passing

## 🎓 Learning Path

1. **Start here** - Read this README
2. **Quick tasks** - [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md)
3. **Deep dive** - [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)
4. **Visual learning** - [AUTH_FLOW_DIAGRAM.md](AUTH_FLOW_DIAGRAM.md)
5. **Testing** - [AUTH_TEST_CHECKLIST.md](AUTH_TEST_CHECKLIST.md)

## 📄 License

Part of the Farm Market application.

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-26  
**Status**: ✅ Production Ready
