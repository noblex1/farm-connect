# Fix: Preview Disappearing on Save

## Problem
When uploading a profile picture:
1. Preview shows correctly ✅
2. Click "Save Profile"
3. Preview disappears immediately ❌
4. Image doesn't show (even though upload succeeded)

## Root Cause

The issue was a **race condition** in the save flow:

```typescript
// OLD CODE (BROKEN)
await updateCurrentUser(...);  // Upload to server
sessionStore.setUser(response.user);  // Update localStorage
await queryClient.invalidateQueries(...);  // Mark cache as stale

setPhotoPreview("");  // ❌ Clear preview immediately
// But the query hasn't refetched yet!
// So avatarSrc = "" || profile.profilePicture (old value) = old value or empty
```

The preview was cleared **before** the query had a chance to refetch the new data from the API. This left a gap where:
- `photoPreview` = "" (cleared)
- `profile.profilePicture` = old value (not updated yet)
- Result: No image displayed

## Solution

Wait for the query to refetch **before** clearing the preview:

```typescript
// NEW CODE (FIXED)
await updateCurrentUser(...);  // Upload to server
sessionStore.setUser(response.user);  // Update localStorage
await queryClient.invalidateQueries(...);  // Mark cache as stale
await queryClient.refetchQueries(...);  // ✅ Wait for refetch to complete

// Now the query has fresh data with the new profilePicture URL
setPhotoPreview("");  // Safe to clear preview now
// avatarSrc = "" || profile.profilePicture (NEW value) = NEW value ✅
```

## Changes Made

### 1. Added `refetchQueries` await
**File**: `client/src/pages/UserProfile.tsx`

```typescript
// Invalidate cache
await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

// Wait for refetch to complete
await queryClient.refetchQueries({ queryKey: ["currentUser"] });

// Now safe to clear preview
setPhotoPreview("");
```

### 2. Added loading state
```typescript
const [isSaving, setIsSaving] = useState(false);

// During save
setIsSaving(true);
try {
  // ... save logic
} finally {
  setIsSaving(false);
}

// Button shows "Saving..." while uploading
<Button disabled={isSaving}>
  {isSaving ? "Saving..." : "Save Profile"}
</Button>
```

### 3. Added debug logging
```typescript
console.log("=== Avatar Display ===");
console.log("photoPreview:", photoPreview);
console.log("profile.profilePicture:", profile.profilePicture);
console.log("avatarSrc (final):", avatarSrc);
```

## How It Works Now

### Upload Flow
```
1. User selects image
   → photoPreview = blob URL
   → Image shows (from preview)

2. User clicks "Save Profile"
   → Button shows "Saving..."
   → Upload to Cloudinary
   → Save URL to MongoDB
   → API returns new user data with profilePicture URL

3. Update frontend state
   → Save to localStorage
   → Invalidate React Query cache
   → Refetch from API (gets new profilePicture URL)
   → Wait for refetch to complete ✅

4. Clear preview
   → photoPreview = ""
   → avatarSrc = profile.profilePicture (NEW URL from API)
   → Image shows (from Cloudinary URL) ✅
```

## Testing

### Test 1: Upload and Save
1. Go to `/profile`
2. Select an image
3. **Verify**: Preview shows below file input
4. Click "Save Profile"
5. **Verify**: Button shows "Saving..."
6. **Verify**: Image stays visible (doesn't disappear)
7. **Verify**: Success message appears
8. **Verify**: Image is now from Cloudinary (not blob URL)

### Test 2: Check Console Logs
After clicking "Save Profile", console should show:
```
=== Profile Update Submission ===
Calling updateCurrentUser API...
API response: { ... }
New profilePicture URL: https://res.cloudinary.com/...
=== useCurrentUser: Fetching from API ===
API response user: { ..., profilePicture: "https://..." }
Saved to localStorage
Query refetched, clearing preview
=== Avatar Display ===
photoPreview: 
profile.profilePicture: https://res.cloudinary.com/...
avatarSrc (final): https://res.cloudinary.com/...
```

### Test 3: Refresh Page
1. After saving, refresh the page (F5)
2. **Verify**: Image still shows
3. **Verify**: Image is from Cloudinary URL (not blob)

## What to Check If It Still Fails

### Check 1: API Response
Look for this in console:
```
New profilePicture URL: https://res.cloudinary.com/...
```

If it's empty, the upload to Cloudinary failed. Check server logs.

### Check 2: Query Refetch
Look for this in console:
```
=== useCurrentUser: Fetching from API ===
profilePicture from API: https://res.cloudinary.com/...
```

If it's empty, the API isn't returning the URL. Check server logs.

### Check 3: Avatar Display
Look for this in console:
```
=== Avatar Display ===
avatarSrc (final): https://res.cloudinary.com/...
```

If it's empty, the data isn't reaching the component. Check the hook.

## Before vs After

### Before (Broken)
```
Upload → Save → Clear preview immediately
                ↓
                No image (race condition)
```

### After (Fixed)
```
Upload → Save → Refetch → Wait → Clear preview
                          ↓
                          Image shows (from API)
```

## Summary

The fix ensures that:
1. ✅ Preview shows when file is selected
2. ✅ Preview stays visible during upload
3. ✅ Query refetches new data before clearing preview
4. ✅ Image transitions smoothly from preview to Cloudinary URL
5. ✅ No visual gap or disappearing image
6. ✅ Image persists on page refresh

The key was **waiting for the refetch to complete** before clearing the preview state.
