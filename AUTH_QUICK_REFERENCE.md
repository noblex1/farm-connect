# Authentication Quick Reference

## Common Tasks

### Logout User
```tsx
import { logout } from "@/lib/auth";

logout(); // Clears session and redirects to login
```

### Check User Role
```tsx
import { hasRole, getCurrentRole } from "@/lib/auth";

// Check single role
if (hasRole("farmer")) {
  // Show farmer content
}

// Check multiple roles
if (hasRole(["farmer", "buyer"])) {
  // Show content for farmers or buyers
}

// Get current role
const role = getCurrentRole(); // Returns "farmer" | "buyer" | "admin" | null
```

### Add Logout Button
```tsx
import { LogoutButton } from "@/components/LogoutButton";

<LogoutButton variant="outline" size="default" />
```

### Protect Routes
```tsx
import { RequireAuth } from "@/components/auth/RequireAuth";

<Route element={<RequireAuth allowedRoles={["farmer"]} />}>
  <Route path="/farmer" element={<FarmerDashboard />} />
</Route>
```

### Get Current User
```tsx
import { useCurrentUser } from "@/hooks/useCurrentUser";

function Profile() {
  const { data, isLoading, error } = useCurrentUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  
  return <div>Welcome {data?.user.name}!</div>;
}
```

### Make Authenticated API Request
```tsx
import { apiRequest } from "@/services/apiClient";
import { sessionStore } from "@/lib/session";

const token = sessionStore.getToken();
const data = await apiRequest("/some-endpoint", { token });
```

### Check Authentication Status
```tsx
import { sessionStore } from "@/lib/session";

if (sessionStore.isAuthenticated()) {
  // User is logged in
}
```

### Clear Session
```tsx
import { sessionStore } from "@/lib/session";

sessionStore.clearSession(); // Clears token, user, and profile data
```

## API Endpoints

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "phoneNumber": "+233201234567",
  "role": "farmer",
  "location": "Accra"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "phoneNumber": "+233201234567"
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
```bash
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=John Doe
location=Accra
email=john@example.com
whatsappNumber=+233201234567
profilePicture=<file>
```

## User Roles

- **farmer** - Can post produce, manage listings
- **buyer** - Can browse marketplace, view listings
- **admin** - Full access to all features

## Error Codes

- **400** - Bad request (validation error)
- **401** - Unauthorized (invalid/expired token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found (user doesn't exist)
- **409** - Conflict (phone number already registered)

## Environment Variables

### Server
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=14d
```

### Client
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Testing

```bash
# Run auth tests
cd client
npm run test auth.test.ts

# Run all tests
npm run test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authorization token is required" | Login again to get new token |
| "Session expired" | Token expired, login again |
| "User not found" | Account deleted, create new account |
| "Phone number already registered" | Use login instead of register |
| "Invalid role" | Use correct login page for your role |

## Best Practices

✅ Always use `logout()` instead of manually clearing localStorage
✅ Use `hasRole()` for role checking instead of direct comparison
✅ Use `RequireAuth` component for protected routes
✅ Use `LogoutButton` component for consistent logout UI
✅ Check `isAuthenticated()` before making auth-required API calls
✅ Handle loading and error states in components using auth

❌ Don't store sensitive data in localStorage
❌ Don't manually manipulate token or user data
❌ Don't skip role validation on protected routes
❌ Don't ignore authentication errors
❌ Don't hardcode role strings, use constants

## Quick Debug

```tsx
// Check current auth state
console.log("Token:", sessionStore.getToken());
console.log("User:", sessionStore.getUser());
console.log("Authenticated:", sessionStore.isAuthenticated());
console.log("Role:", getCurrentRole());
console.log("Token expired:", isTokenLikelyExpired());
```

## Need More Help?

See `AUTHENTICATION_GUIDE.md` for comprehensive documentation.
