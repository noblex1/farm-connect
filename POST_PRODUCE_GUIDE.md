# Post Produce - Complete Guide

## 🌾 Overview

The Post Produce feature allows farmers to list their crops for sale on the marketplace with images, pricing, and location information.

## ✅ Features

### Core Features
- ✅ List crops (Maize, Rice, Yam)
- ✅ Upload up to 5 images per listing
- ✅ Drag & drop image upload
- ✅ Image preview before posting
- ✅ Set quantity and unit (bag, kg, ton, etc.)
- ✅ Set price in GH₵
- ✅ Select location
- ✅ Real-time validation
- ✅ Loading states
- ✅ Success/error feedback

### Image Upload Features
- ✅ Multiple image upload (up to 5 images)
- ✅ Drag and drop support
- ✅ Click to upload
- ✅ Image preview with thumbnails
- ✅ Remove individual images
- ✅ File type validation (JPG, PNG, WebP)
- ✅ File size validation (max 5MB per image)
- ✅ Cloudinary integration for storage

## 🚀 How to Use

### For Farmers

1. **Navigate to Post Produce**
   - Login as a farmer
   - Click "Post Produce" in navigation
   - Or go to `/post`

2. **Fill in Crop Details**
   - **Crop Type**: Select from dropdown (Maize, Rice, or Yam)
   - **Quantity**: Enter amount (e.g., 10, 50, 100)
   - **Unit**: Enter unit (bag, kg, ton, etc.) - defaults to "bag"
   - **Price**: Enter price in GH₵ (e.g., 420.00)
   - **Location**: Select from dropdown

3. **Upload Images (Optional)**
   - **Method 1 - Click to Upload**:
     - Click on the upload area
     - Select up to 5 images
     - Supported formats: JPG, PNG, WebP
     - Max size: 5MB per image
   
   - **Method 2 - Drag & Drop**:
     - Drag images from your computer
     - Drop them in the upload area
     - Multiple images can be dropped at once
   
   - **Preview & Remove**:
     - Uploaded images show as thumbnails
     - Hover over image to see remove button
     - Click X to remove an image

4. **Submit**
   - Click "Post Now" button
   - Wait for success message
   - Form will reset automatically
   - Your listing appears in marketplace

## 📋 Field Requirements

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| Crop Type | Yes | Select | Must be maize, rice, or yam |
| Quantity | Yes | Number | Minimum 1 |
| Unit | No | Text | Max 20 characters, defaults to "bag" |
| Price | Yes | Number | Minimum 0, allows decimals |
| Location | Yes | Select | Must select from list |
| Images | No | Files | Max 5 images, 5MB each, JPG/PNG/WebP |

## 🖼️ Image Upload Details

### Supported Formats
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ WebP (.webp)
- ❌ GIF (not supported)
- ❌ BMP (not supported)
- ❌ SVG (not supported)

### File Size Limits
- **Per Image**: 5MB maximum
- **Total Images**: Up to 5 images per listing
- **Recommended**: 1-3MB per image for faster upload

### Image Guidelines
**Best Practices:**
- ✅ Take clear, well-lit photos
- ✅ Show the actual produce
- ✅ Include multiple angles
- ✅ Show quantity/packaging
- ✅ Use natural lighting
- ✅ Clean background

**Avoid:**
- ❌ Blurry or dark photos
- ❌ Photos of other people's produce
- ❌ Misleading images
- ❌ Watermarked images
- ❌ Screenshots

### Upload Process
```
1. Select/Drop Images
   ↓
2. Client Validation
   - Check file type
   - Check file size
   - Check total count
   ↓
3. Preview Generation
   - Create thumbnail
   - Show in UI
   ↓
4. Form Submission
   - Upload to server
   ↓
5. Server Processing
   - Validate again
   - Upload to Cloudinary
   ↓
6. Store URLs
   - Save Cloudinary URLs
   - Link to listing
   ↓
7. Success!
   - Listing created
   - Images accessible
```

## 🔧 Technical Details

### Client-Side

**Component**: `client/src/pages/PostProduce.tsx`

**Key Functions:**
```typescript
// Validate files before upload
validateFiles(files: File[]): File[]

// Handle file selection
handleFiles(files: FileList | null)

// Handle image input change
onImage(event: ChangeEvent<HTMLInputElement>)

// Remove image from preview
removeImage(index: number)

// Drag and drop handlers
onDragOver(event: DragEvent<HTMLDivElement>)
onDragLeave(event: DragEvent<HTMLDivElement>)
onDrop(event: DragEvent<HTMLDivElement>)

// Submit form
onSubmit(event: FormEvent<HTMLFormElement>)
```

**State Management:**
```typescript
const [success, setSuccess] = useState(false);
const [error, setError] = useState("");
const [preview, setPreview] = useState<string[]>([]);
const [images, setImages] = useState<File[]>([]);
const [isDragging, setIsDragging] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Constants:**
```typescript
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
```

### Server-Side

**Controller**: `server/src/controllers/listingController.js`

**Create Listing Function:**
```javascript
export const createListing = asyncHandler(async (req, res) => {
  // Upload images to Cloudinary
  const uploadedImages = req.files?.length 
    ? await uploadListingImages(req.files) 
    : [];

  // Create listing in database
  const listing = await Listing.create({
    farmerId: req.user._id,
    cropType: req.body.cropType,
    quantity: Number(req.body.quantity),
    unit: req.body.unit || "bag",
    price: Number(req.body.price),
    location: req.body.location,
    images: uploadedImages,
    status: "available",
  });

  // Return populated listing
  const populated = await Listing.findById(listing._id)
    .populate("farmerId", "name phoneNumber location profilePicture");

  res.status(201).json({
    message: "Listing created",
    listing: listingResponseShape(populated),
  });
});
```

**Upload Service**: `server/src/services/uploadService.js`

```javascript
export const uploadListingImages = async (files = []) => {
  if (!files.length) return [];

  try {
    const uploads = await Promise.all(
      files.map((file) => 
        uploadBuffer(file.buffer, "farm-market/listings")
      )
    );
    return uploads.map((item) => item.secure_url);
  } catch (err) {
    console.error("Cloudinary listing upload error:", err);
    return [];
  }
};
```

**Multer Middleware**: `server/src/middlewares/uploadMiddleware.js`

```javascript
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // Max 5 files
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});
```

**Route**: `server/src/routes/listingRoutes.js`

```javascript
router.post(
  "/",
  listingCreateLimiter,
  protect,
  authorize("farmer"),
  upload.array("images", 5), // Handle up to 5 images
  createListingValidation,
  validateRequest,
  createListing
);
```

## 🎨 UI Components

### Form Layout
```
┌─────────────────────────────────────┐
│ Post Produce                        │
│ List your crops for buyers          │
├─────────────────────────────────────┤
│ [Success/Error Message]             │
├─────────────────────────────────────┤
│ Crop Type *                         │
│ [🌽 Maize ▼]                        │
├─────────────────────────────────────┤
│ Quantity *        Unit              │
│ [10]              [bag]             │
├─────────────────────────────────────┤
│ Price (GH₵) *                       │
│ [420.00]                            │
├─────────────────────────────────────┤
│ 📍 Location *                       │
│ [Tamale ▼]                          │
├─────────────────────────────────────┤
│ 🖼️ Photos (Optional)    [2 / 5]    │
│ ┌─────────────────────────────────┐ │
│ │  📤 Click to upload or          │ │
│ │     drag & drop                 │ │
│ │  JPG, PNG, or WebP • Max 5MB    │ │
│ └─────────────────────────────────┘ │
│ [img] [img] [img]                   │
├─────────────────────────────────────┤
│ [📦 Post Now]                       │
└─────────────────────────────────────┘
```

### Image Preview
```
┌─────┐ ┌─────┐ ┌─────┐
│ [X] │ │ [X] │ │ [X] │
│     │ │     │ │     │
│ img │ │ img │ │ img │
│     │ │     │ │     │
└─────┘ └─────┘ └─────┘
```

## 🧪 Testing

### Manual Testing

**Test Image Upload:**
```bash
# 1. Login as farmer
# 2. Go to /post
# 3. Fill in all required fields
# 4. Upload 1-5 images
# 5. Submit form
# 6. Verify success message
# 7. Check marketplace for listing
```

**Test Drag & Drop:**
```bash
# 1. Open /post page
# 2. Drag image files from desktop
# 3. Drop on upload area
# 4. Verify preview appears
# 5. Submit form
```

**Test Validation:**
```bash
# Test file type
- Try uploading .gif file (should fail)
- Try uploading .pdf file (should fail)
- Try uploading .jpg file (should succeed)

# Test file size
- Try uploading 10MB image (should fail)
- Try uploading 2MB image (should succeed)

# Test max images
- Upload 5 images (should succeed)
- Try uploading 6th image (should fail)
```

**Test API with curl:**
```bash
# Create listing with images
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cropType=maize" \
  -F "quantity=50" \
  -F "unit=bag" \
  -F "price=420" \
  -F "location=Tamale" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot read properties of null (reading 'reset')"**
- **Cause**: Form element not found
- **Solution**: Fixed in latest version with null check
- **Status**: ✅ Resolved

**Issue: Images not uploading**
- **Cause**: Cloudinary not configured
- **Solution**: Check environment variables
  ```env
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```

**Issue: "File too large" error**
- **Cause**: Image exceeds 5MB
- **Solution**: Compress image before upload
- **Tools**: TinyPNG, Squoosh, ImageOptim

**Issue: "Invalid file type" error**
- **Cause**: Unsupported file format
- **Solution**: Convert to JPG, PNG, or WebP

**Issue: Drag & drop not working**
- **Cause**: Browser compatibility
- **Solution**: Use click to upload instead
- **Supported**: Chrome, Firefox, Safari, Edge

**Issue: Preview not showing**
- **Cause**: Browser security settings
- **Solution**: Check browser console for errors

### Debug Mode

**Check Cloudinary Configuration:**
```javascript
// In server console
console.log("Cloudinary Config:", {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
});
```

**Check Upload Service:**
```javascript
// In uploadService.js
console.log("Uploading images:", files.length);
console.log("File details:", files.map(f => ({
  name: f.originalname,
  size: f.size,
  type: f.mimetype
})));
```

## 📊 Database Schema

### Listing Document
```javascript
{
  _id: ObjectId("..."),
  farmerId: ObjectId("..."),
  cropType: "maize",
  quantity: 50,
  unit: "bag",
  price: 420,
  location: "Tamale",
  images: [
    "https://res.cloudinary.com/.../image1.jpg",
    "https://res.cloudinary.com/.../image2.jpg",
    "https://res.cloudinary.com/.../image3.jpg"
  ],
  status: "available",
  createdAt: ISODate("2026-04-26T10:00:00.000Z"),
  updatedAt: ISODate("2026-04-26T10:00:00.000Z")
}
```

## 🚀 Best Practices

### For Farmers

1. **Take Quality Photos**
   - Use good lighting
   - Show actual produce
   - Multiple angles
   - Clean background

2. **Accurate Information**
   - Correct quantity
   - Fair pricing
   - Accurate location
   - Honest description

3. **Update Regularly**
   - Mark as sold when sold
   - Update quantity if changed
   - Remove old listings

### For Developers

1. **Image Optimization**
   - Compress images before upload
   - Use WebP format when possible
   - Lazy load images in listings

2. **Error Handling**
   - Validate on client and server
   - Show clear error messages
   - Log errors for debugging

3. **Performance**
   - Use image CDN (Cloudinary)
   - Implement pagination
   - Cache listings

## 📈 Future Enhancements

### Planned Features
- ⏳ Image cropping/editing
- ⏳ Bulk upload
- ⏳ Video upload
- ⏳ Image compression
- ⏳ Image filters
- ⏳ Geolocation for location
- ⏳ Price suggestions
- ⏳ Duplicate listing detection
- ⏳ Draft listings
- ⏳ Scheduled posting

## 📞 Support

### For Users
- Check this guide
- Review error messages
- Contact support

### For Developers
- Check server logs
- Review Cloudinary dashboard
- Test with curl/Postman
- Check browser console

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-26  
**Status**: ✅ Working  
**Image Upload**: ✅ Enabled
