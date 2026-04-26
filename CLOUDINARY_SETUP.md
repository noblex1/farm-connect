# Cloudinary Image Upload Setup Guide

## Overview
The Farm Market platform uses **Cloudinary** for cloud-based image storage. Profile pictures and listing images are uploaded to Cloudinary, and the URLs are stored in MongoDB.

## Current Implementation Status ✅

### Backend (Already Configured)
- ✅ Cloudinary SDK integrated (`cloudinary` package)
- ✅ Upload service with error handling (`server/src/services/uploadService.js`)
- ✅ Multer middleware for file handling (`server/src/middlewares/uploadMiddleware.js`)
- ✅ Auth controller handles profile picture uploads (`server/src/controllers/authController.js`)
- ✅ Listing controller handles produce images (`server/src/controllers/listingController.js`)
- ✅ Routes configured with `upload.single()` and `upload.array()` middleware

### Frontend (Already Configured)
- ✅ Profile picture upload in UserProfile page
- ✅ Multiple image upload in PostProduce page
- ✅ FormData properly sent to backend
- ✅ Image previews before upload
- ✅ File validation (type, size)

## Setup Instructions

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Navigate to Dashboard

### 2. Get Your Credentials
From your Cloudinary Dashboard, copy:
- **Cloud Name** (e.g., `dxyz123abc`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

### 3. Configure Environment Variables

Edit `server/.env` and add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Restart Server
```bash
cd server
npm run dev
```

## How It Works

### Profile Picture Upload Flow
1. **Frontend**: User selects image in `/profile` page
2. **Frontend**: Image sent as `multipart/form-data` with field name `profilePicture`
3. **Backend**: Multer middleware processes the file
4. **Backend**: `uploadProfileImage()` uploads buffer to Cloudinary folder `farm-market/profiles`
5. **Backend**: Cloudinary returns secure URL (e.g., `https://res.cloudinary.com/...`)
6. **Backend**: URL saved to `User.profilePicture` field in MongoDB
7. **Frontend**: URL displayed in `<img>` tags across the app

### Listing Images Upload Flow
1. **Frontend**: Farmer selects up to 5 images in `/post` page
2. **Frontend**: Images sent as `multipart/form-data` with field name `images`
3. **Backend**: Multer middleware processes files with `upload.array('images', 5)`
4. **Backend**: `uploadListingImages()` uploads all buffers to `farm-market/listings`
5. **Backend**: Array of URLs saved to `Listing.images` field in MongoDB
6. **Frontend**: URLs displayed in ProduceCard components

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary SDK configuration
│   ├── services/
│   │   └── uploadService.js       # Upload logic (profile & listings)
│   ├── middlewares/
│   │   └── uploadMiddleware.js    # Multer configuration
│   ├── controllers/
│   │   ├── authController.js      # Profile picture upload
│   │   └── listingController.js   # Listing images upload
│   └── routes/
│       ├── authRoutes.js          # PUT /api/auth/me
│       └── listingRoutes.js       # POST /api/listings
```

## Image Specifications

### Profile Pictures
- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Cloudinary Folder**: `farm-market/profiles`
- **Field Name**: `profilePicture`

### Listing Images
- **Max Size**: 5MB per image
- **Max Count**: 5 images per listing
- **Allowed Types**: JPEG, PNG, WebP
- **Cloudinary Folder**: `farm-market/listings`
- **Field Name**: `images` (array)

## Error Handling

The upload service includes graceful error handling:

```javascript
// If Cloudinary is not configured, returns empty string/array
if (!process.env.CLOUDINARY_API_KEY) {
  return ""; // or [] for arrays
}

// If upload fails, logs error and returns empty string/array
try {
  const result = await uploadBuffer(file.buffer, folder);
  return result.secure_url;
} catch (err) {
  console.error("Cloudinary upload error:", err);
  return "";
}
```

This ensures the app continues to work even if Cloudinary is not configured (useful for development).

## Testing

### Test Profile Picture Upload
1. Login as a farmer or buyer
2. Navigate to `/profile`
3. Click "Profile Photo" input
4. Select an image
5. Click "Save Profile"
6. Refresh the page - image should persist

### Test Listing Images Upload
1. Login as a farmer
2. Navigate to `/post`
3. Drag & drop or select up to 5 images
4. Fill in crop details
5. Click "Post Now"
6. Navigate to `/buyer` - images should display on the listing card

## Cloudinary Dashboard

After uploading, you can view your images in Cloudinary:
1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. Click "Media Library"
3. Navigate to folders:
   - `farm-market/profiles` - Profile pictures
   - `farm-market/listings` - Produce images

## Free Tier Limits

Cloudinary free tier includes:
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

This is sufficient for development and small-scale production.

## Troubleshooting

### Images not uploading
1. Check `.env` file has correct Cloudinary credentials
2. Restart the server after adding credentials
3. Check server logs for "Cloudinary upload error"
4. Verify Cloudinary account is active

### Images not displaying
1. Check MongoDB - `profilePicture` field should contain Cloudinary URL
2. Check browser console for CORS errors
3. Verify Cloudinary URLs are publicly accessible

### "Only image files are allowed" error
- Ensure file type is JPEG, PNG, or WebP
- Check file extension matches actual file type

## Security Notes

- ✅ File size limited to 5MB per image
- ✅ Only image MIME types allowed
- ✅ Uploads require authentication (JWT token)
- ✅ Cloudinary credentials stored in environment variables (not in code)
- ✅ Secure URLs used (HTTPS)

## Next Steps (Optional Enhancements)

1. **Image Optimization**: Add Cloudinary transformations for thumbnails
2. **Image Moderation**: Enable Cloudinary's AI moderation
3. **Lazy Loading**: Implement progressive image loading
4. **Delete Old Images**: Clean up Cloudinary when user updates/deletes
5. **CDN**: Leverage Cloudinary's global CDN for faster delivery

---

**Status**: ✅ Fully implemented and ready to use
**Action Required**: Add Cloudinary credentials to `server/.env`
