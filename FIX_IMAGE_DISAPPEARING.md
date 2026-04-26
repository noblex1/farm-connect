# Fix: Profile Image Disappearing on Refresh

## Problem
Profile image uploads successfully but disappears when the page is refreshed.

## Diagnostic Steps

### Step 1: Use the Diagnostic Page
1. Start your app
2. Login
3. Navigate to `/diagnostic`
4. This page shows:
   - Token status
   - localStorage user data
   - API response data
   - Image display test
   - Console logs

### Step 2: Upload a Profile Picture
1. Go to `/profile`
2. Upload an image
3. Click "Save Profile"
4. **Watch the browser console** for these logs:

```
=== Profile Update Submission ===
Photo file: File { ... }
Calling updateCurrentUser API...
API response: { message: "Profile updated", user: { ... } }
New profilePicture URL: https://res.cloudinary.com/...
```

### Step 3: Check Server Logs
**Server terminal should show:**
```
=== Update Current User Request ===
Has file: true
Processing profile picture upload...
Cloudinary upload successful: https://res.cloudinary.com/...
User saved with profilePicture: https://res.cloudinary.com/...
```

### Step 4: Go to Diagnostic Page
1. Navigate to `/diagnostic`
2. Check all three sections:
   - **localStorage User**: Should have `profilePicture` URL
   - **API Response**: Should have `profilePicture` URL
   - **Image Display Test**: Should show the image

### Step 5: Refresh the Page
1. Press F5 or Ctrl+R
2. **Watch the browser console** for:

```
=== useCurrentUser: Getting placeholder data ===
Cached user from localStorage: { ... }
Cached profilePicture: https://res.cloudinary.com/... (or empty)

=== useCurrentUser: Fetching from API ===
API response user: { ... }
profilePicture from API: https://res.cloudinary.com/... (or empty)
```

3. **Watch the server logs** for:

```
=== Get Current User Request ===
User ID: ...
User found: { id: '...', name: '...', profilePicture: 'https://...' or '' }
Response shape: { id: '...', name: '...', profilePicture: 'https://...' or '' }
```

## Possible Issues & Solutions

### Issue 1: profilePicture is empty in MongoDB
**Symptoms:**
- Server logs show: `User found: { ..., profilePicture: '' }`
- API returns empty profilePicture

**Cause:** Upload to Cloudinary failed or URL wasn't saved

**Solution:**
1. Check server logs during upload for "Cloudinary upload error"
2. Run `npm run test:cloudinary` to verify Cloudinary connection
3. Check MongoDB directly:
   ```bash
   mongosh
   use farm_market
   db.users.findOne({ phoneNumber: "+233..." })
   ```
4. If profilePicture is empty, try uploading again

### Issue 2: profilePicture in MongoDB but not in API response
**Symptoms:**
- MongoDB has URL
- Server logs show: `User found: { ..., profilePicture: 'https://...' }`
- But API response has empty profilePicture

**Cause:** Response service not including the field

**Solution:**
Check `server/src/services/responseService.js`:
```javascript
export const userResponseShape = (userDoc) => ({
  // ... other fields
  profilePicture: userDoc.profilePicture || "",  // ← Should be here
  // ... other fields
});
```

### Issue 3: API returns URL but localStorage doesn't save it
**Symptoms:**
- API response has URL
- Browser console shows: `New profilePicture URL: https://...`
- But localStorage is empty after refresh

**Cause:** localStorage not being updated

**Solution:**
Check `client/src/hooks/useCurrentUser.ts`:
```typescript
queryFn: async () => {
  const response = await fetchCurrentUser(token!);
  sessionStore.setUser(response.user);  // ← Should save to localStorage
  return response;
}
```

### Issue 4: localStorage has URL but component doesn't show it
**Symptoms:**
- localStorage has URL
- API returns URL
- But image doesn't display

**Cause:** Component not reading from the hook correctly

**Solution:**
Check component is using `data?.user?.profilePicture`:
```typescript
const { data } = useCurrentUser();
const profilePicture = data?.user?.profilePicture;
```

### Issue 5: Everything works but image disappears on refresh
**Symptoms:**
- Upload works
- Image shows immediately
- localStorage has URL
- But disappears on refresh

**Cause:** React Query cache issue or API overwriting with empty data

**Solution:**
1. Check if API is returning the URL on refresh (server logs)
2. Check if `placeholderData` is being used correctly
3. Try changing `placeholderData` to `initialData` in the hook
4. Check if `staleTime` is too short

## Quick Fix Attempts

### Fix 1: Force localStorage Sync
In `client/src/hooks/useCurrentUser.ts`, ensure this is present:
```typescript
queryFn: async () => {
  const response = await fetchCurrentUser(token!);
  // Force save to localStorage
  sessionStore.setUser(response.user);
  // Verify it was saved
  const saved = sessionStore.getUser<ApiUser>();
  console.log("Saved to localStorage:", saved?.profilePicture);
  return response;
}
```

### Fix 2: Use initialData instead of placeholderData
Change in `client/src/hooks/useCurrentUser.ts`:
```typescript
// Change from:
placeholderData: () => { ... }

// To:
initialData: () => {
  const cachedUser = sessionStore.getUser<ApiUser>();
  if (cachedUser && token) {
    return { user: cachedUser };
  }
  return undefined;
}
```

### Fix 3: Increase staleTime
```typescript
staleTime: 30 * 60 * 1000, // 30 minutes instead of 5
```

### Fix 4: Add refetchOnMount: false
```typescript
return useQuery({
  // ... other options
  refetchOnMount: false,  // Don't refetch on component mount
  refetchOnWindowFocus: false,  // Don't refetch on window focus
});
```

## Testing Checklist

After applying fixes:

- [ ] Upload a profile picture
- [ ] Check `/diagnostic` - all sections show URL
- [ ] Refresh page
- [ ] Check browser console logs
- [ ] Check server logs
- [ ] Check `/diagnostic` again - URL should still be there
- [ ] Image should be visible in header
- [ ] Image should be visible in dashboard
- [ ] Image should be visible in profile page

## Manual MongoDB Check

```bash
mongosh
use farm_market
db.users.findOne({ phoneNumber: "+233..." })
```

Should show:
```json
{
  "_id": ObjectId("..."),
  "name": "...",
  "phoneNumber": "+233...",
  "profilePicture": "https://res.cloudinary.com/dshhsdkot/image/upload/v.../farm-market/profiles/...",
  ...
}
```

If `profilePicture` is empty or missing, the upload didn't work.

## Next Steps

1. **Go to `/diagnostic`** and check all sections
2. **Upload a new picture** and watch the logs
3. **Refresh** and check if it persists
4. **Share the logs** if issue persists:
   - Browser console logs (all of them)
   - Server terminal logs (from upload and from refresh)
   - Screenshot of `/diagnostic` page

The logs will tell us exactly where the data is being lost!
