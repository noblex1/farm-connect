# Post Produce - Quick Start Guide

## 🚀 For Farmers

### Step 1: Login
- Go to `/login`
- Enter your email/phone and password
- Make sure you're logged in as a **Farmer**

### Step 2: Navigate to Post Produce
- Click "Post Produce" in the navigation
- Or go directly to `/post`

### Step 3: Fill in Details

**Required Fields:**
```
Crop Type:  [Select: Maize, Rice, or Yam]
Quantity:   [Enter number, e.g., 50]
Unit:       [Enter unit, e.g., bag] (optional, defaults to "bag")
Price:      [Enter price in GH₵, e.g., 420]
Location:   [Select from dropdown]
```

### Step 4: Upload Images (Optional)

**Method 1 - Click to Upload:**
1. Click on the upload area
2. Select 1-5 images from your computer
3. Supported: JPG, PNG, WebP
4. Max 5MB per image

**Method 2 - Drag & Drop:**
1. Open your file explorer
2. Select images
3. Drag them to the upload area
4. Drop to upload

**Preview & Remove:**
- Uploaded images show as thumbnails
- Hover over image to see remove button (X)
- Click X to remove an image

### Step 5: Submit
1. Click "Post Now" button
2. Wait for success message
3. Your listing is now live!

## 📸 Image Guidelines

### ✅ Good Photos
- Clear and well-lit
- Show actual produce
- Multiple angles
- Clean background
- Natural lighting

### ❌ Avoid
- Blurry photos
- Dark photos
- Photos of other people's produce
- Misleading images
- Watermarked images

## 🔧 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't upload image | Check file type (JPG, PNG, WebP only) |
| "File too large" | Image must be under 5MB |
| Can't upload 6th image | Maximum 5 images per listing |
| Drag & drop not working | Use click to upload instead |
| Form won't submit | Fill in all required fields (*) |

## 💻 For Developers

### Test with curl
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

### Quick Test Checklist
- [ ] Login as farmer
- [ ] Go to /post
- [ ] Fill all fields
- [ ] Upload 1-3 images
- [ ] Submit form
- [ ] Verify success message
- [ ] Check marketplace

### Environment Setup
```env
# Required in server/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📋 Field Reference

| Field | Required | Type | Example |
|-------|----------|------|---------|
| Crop Type | Yes | Select | Maize |
| Quantity | Yes | Number | 50 |
| Unit | No | Text | bag |
| Price | Yes | Number | 420 |
| Location | Yes | Select | Tamale |
| Images | No | Files | 1-5 images |

## 🎯 Tips

### For Best Results
1. **Upload 2-3 images** - Shows different angles
2. **Use good lighting** - Natural light works best
3. **Show quantity** - Help buyers see what they get
4. **Be accurate** - Honest info builds trust
5. **Update regularly** - Mark as sold when sold

### Image Specs
- **Format**: JPG, PNG, or WebP
- **Size**: Max 5MB per image
- **Count**: Up to 5 images
- **Resolution**: Higher is better (but under 5MB)

## 🔗 Related Pages

- **View Listings**: `/buyer` (marketplace)
- **My Listings**: `/listings` (your posts)
- **Profile**: `/profile` (update info)

## 📞 Need Help?

1. Check **POST_PRODUCE_GUIDE.md** for detailed info
2. Review error messages carefully
3. Check browser console for errors
4. Contact support if issue persists

---

**Quick Links:**
- Full Guide: `POST_PRODUCE_GUIDE.md`
- Summary: `POST_PRODUCE_SUMMARY.md`
- API Docs: See guide for API details

**Status**: ✅ Working  
**Version**: 1.0.0
