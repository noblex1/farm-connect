# Authentication State Fixes

## Issues Fixed

### 1. ❌ Mobile Navbar Disappears After Login
**Problem**: After logging in, the mobile bottom navigation bar disappeared completely on refresh.

**Root Cause**: The navbar was conditionally rendered with `{!isLoggedIn && (` which only showed it for guests.

**Solution**: Changed condition to `{isLoggedIn && (` to show navbar for authenticated users.

**File**: `client/src/components/FarmShell.tsx`

---

### 2. ❌ Header Doesn't Update After Login
**Problem**: After successful login, "Sign In" and "Create Account" buttons remained visible instead of showing the user profile button.

**Root Cause**: The React Query cache wasn't being invalidated after login, so the `useCurrentUser` hook continued to return stale data (no user).

**Solution**: 
- Added `useQueryClient` to login and registration flows
- Invalidate queries after successful authentication
- Set query data immediately with new user info
- Force page reload with `window.location.href` to ensure all components re-render

**Files Modified**:
- `client/src/pages/FarmerLogin.tsx`
- `client/src/pages/VerifyOTP.tsx`

---

## Changes Made

### FarmShell.tsx
```typescript
// BEFORE: Navbar only for guests
{!isLoggedIn && (
  <nav>...</nav>
)}

// AFTER: Navbar for authenticated users
{isLoggedIn && (
  <nav>...</nav>
)}
```

### FarmerLogin.tsx
```typescript
// Added imports
import { useQueryClient } from "@tanstack/react-query";

// In component
const queryClient = useQueryClient();

// After successful login
sessionStore.setToken(response.token);
sessionStore.setUser(response.user);

// NEW: Invalidate and update query cache
queryClient.invalidateQueries({ queryKey: ["currentUser"] });
queryClient.setQueryData(["currentUser", response.token], { user: response.user });

// NEW: Force page reload for complete UI refresh
window.location.href = targetRoute;
```

### VerifyOTP.tsx
Same pattern as FarmerLogin.tsx - added query invalidation and forced reload after successful OTP verification.

---

## Testing Checklist

✅ **Login Flow**:
1. Go to login page
2. Enter credentials and submit
3. Page should automatically refresh
4. Header should show user profile button (not "Sign In" / "Create Account")
5. Mobile navbar should be visible at bottom

✅ **Registration Flow**:
1. Create new account
2. Verify OTP
3. Page should automatically refresh
4. Header should show user profile button
5. Mobile navbar should be visible at bottom

✅ **Page Refresh**:
1. After logging in, manually refresh the page
2. Mobile navbar should remain visible
3. User profile button should remain in header

---

## Technical Details

### Why Force Reload?
Using `window.location.href` instead of `navigate()` ensures:
- All React components unmount and remount
- All hooks re-initialize with fresh data
- Service workers sync properly
- No stale state from previous renders

### Query Cache Management
- `invalidateQueries`: Marks data as stale and triggers refetch
- `setQueryData`: Immediately updates cache with new data
- Both together ensure instant UI update + background validation

---

## Deployment

Changes pushed to `main` branch. Vercel will automatically deploy the client updates.

**Commit**: `Fix auth state: show navbar after login and auto-refresh UI`
