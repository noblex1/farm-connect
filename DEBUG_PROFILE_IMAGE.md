# Profile Image Upload Debugging Guide

## Changes Made

### Backend Enhancements
1. **Added detailed logging** in `server/src/services/uploadService.js`:
   - Logs file details (name, type, size, buffer)
   - Logs Cloudinary configuration status
   - Logs upload success/failure with full error details

2. **Added detailed logging** in `server/src/controllers/authController.js`:
   - Logs incoming request details
   - Logs file information
   - Logs upload result
   - Logs final saved profilePicture URL

### Frontend Enhancements
1. **Added file validation** in `client/src/pages/UserProfile.tsx`:
   - Validates file type (JPEG, PNG, WebP only)
   - Validates file size (max 5MB)
   - Shows error messages for invalid files

2. **Added visual preview**:
   - Shows "New photo preview" section when file is selected
   - Displays preview image before upload

3. **Added detailed logging**:
   - Logs file selection
   - Logs form data
   - Logs API response
   - Logs errors

## How to Debug

### Step 1: Check Server Logs
1. Start the server with logging:
   ```bash
   cd server
   npm run dev
   ```

2. Watch for these log messages when uploading:
   ```
   === Update Current User Request ===
   User ID: ...
   Request body: { name: '...', location: '...', ... }
   Has file: true
   File details: { fieldname: 'profilePicture', originalname: '...', mimetype: 'image/jpeg', size: 12345 }
   Current user profilePicture: ...
   Processing profile picture upload...
   Attempting to upload profile image: { ... }
   Cloudinary configured: { cloudName: '...', hasApiKey: true, hasApiSecret: true }
   Starting Cloudinary upload...
   Cloudinary upload successful: https://res.cloudinary.com/...
   Upload result: https://res.cloudinary.com/...
   User saved with profilePicture: https://res.cloudinary.com/...
   ```

### Step 2: Check Browser Console
1. Open DevTools → Console
2. Upload a profile picture
3. Look for these logs:
   ```
   File selected: File { name: "photo.jpg", size: 12345, type: "image/jpeg" }
   File is valid, creating preview
   Preview URL created: blob:http://localhost:8080/...
   === Profile Update Submission ===
   Photo file: File { ... }
   Form data entries:
     name: John Doe
     location: Tamale
     email: john@example.com
     whatsappNumber: +233...
   Calling updateCurrentUser API...
   API response: { message: "Profile updated", user: { ... } }
   New profilePicture URL: https://res.cloudinary.com/...
   ```

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Upload a profile picture
3. Find the `PUT /api/auth/me` request
4. Check:
   - **Request Headers**: Should have `Authorization: Bearer ...`
   - **Request Payload**: Should show `profilePicture: (binary)`
   - **Response**: Should have `user.profilePicture` with Cloudinary URL

### Step 4: Check MongoDB
```bash
mongosh
use farm_market
db.users.findOne({ phoneNumber: "+233..." })
```

Look for:
```json
{
  "_id": "...",
  "name": "...",
  "profilePicture": "https://res.cloudinary.com/dshhsdkot/image/upload/v.../farm-market/profiles/..."
}
```

### Step 5: Check Cloudinary Dashboard
1. Go to https://cloudinary.com/console
2. Click "Media Library"
3. Navigate to `farm-market/profiles` folder
4. You should see uploaded images

## Common Issues & Solutions

### Issue 1: "Has file: false" in server logs
**Problem**: File not reaching the server

**Solutions**:
- Check that input has `accept="image/jpeg,image/jpg,image/png,image/webp"`
- Verify file is selected (check browser console for "File selected" log)
- Check Network tab shows `profilePicture: (binary)` in request

### Issue 2: "Cloudinary not configured" error
**Problem**: Environment variables missing

**Solutions**:
- Check `server/.env` has all three variables:
  ```env
  CLOUDINARY_CLOUD_NAME=dshhsdkot
  CLOUDINARY_API_KEY=379536234995869
  CLOUDINARY_API_SECRET=MqRWkLJlO5OFcP0mlflL1zr0AxE
  ```
- Restart server after adding variables
- Check server logs show `Cloudinary configured: { cloudName: 'dshhsdkot', hasApiKey: true, hasApiSecret: true }`

### Issue 3: "Cloudinary upload error" in logs
**Problem**: Upload to Cloudinary failed

**Solutions**:
- Check error message in server logs for details
- Verify Cloudinary credentials are correct
- Check Cloudinary account is active
- Try uploading directly in Cloudinary dashboard to test credentials

### Issue 4: Upload succeeds but image doesn't persist
**Problem**: localStorage not syncing

**Solutions**:
- Check browser console for "New profilePicture URL" log
- Verify `sessionStore.setUser()` is called
- Check `queryClient.invalidateQueries()` is called
- Clear browser localStorage and login again

### Issue 5: "Please select an image file" error
**Problem**: Invalid file type

**Solutions**:
- Only use JPEG, PNG, or WebP images
- Check file extension matches actual file type
- Try a different image

### Issue 6: "Image must be less than 5MB" error
**Problem**: File too large

**Solutions**:
- Compress image before uploading
- Use online tools like TinyPNG or Squoosh
- Resize image to smaller dimensions

## Testing Checklist

- [ ] Server starts without errors
- [ ] Cloudinary credentials are in `.env`
- [ ] Can select an image file
- [ ] Preview shows after selecting file
- [ ] Server logs show "Has file: true"
- [ ] Server logs show "Cloudinary upload successful"
- [ ] Browser console shows "New profilePicture URL"
- [ ] Success message appears
- [ ] Image visible in header immediately
- [ ] Image persists after page refresh
- [ ] MongoDB has Cloudinary URL
- [ ] Image visible in Cloudinary dashboard

## Quick Test

1. **Start server**: `cd server && npm run dev`
2. **Start client**: `cd client && npm run dev`
3. **Login** to the app
4. **Go to** `/profile`
5. **Select** a small JPG image (< 1MB)
6. **Watch** browser console and server logs
7. **Click** "Save Profile"
8. **Check** for success message
9. **Refresh** page
10. **Verify** image still shows

## Expected Flow

```
User selects image
  ↓
Frontend validates (type, size)
  ↓
Preview created (blob URL)
  ↓
User clicks "Save Profile"
  ↓
FormData created with file
  ↓
API call to PUT /api/auth/me
  ↓
Backend receives file via multer
  ↓
uploadProfileImage() called
  ↓
File buffer uploaded to Cloudinary
  ↓
Cloudinary returns secure URL
  ↓
URL saved to MongoDB User.profilePicture
  ↓
Response sent to frontend
  ↓
Frontend updates localStorage
  ↓
Query cache invalidated
  ↓
All components re-render with new image
  ↓
Image persists across refreshes
```

## Need More Help?

If the issue persists:
1. Share the **server logs** (from "=== Update Current User Request ===" onwards)
2. Share the **browser console logs** (from "File selected" onwards)
3. Share the **Network tab** request/response for PUT /api/auth/me
4. Share any **error messages** you see

This will help identify exactly where the upload is failing.
