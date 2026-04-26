# Quick Reference - Farm Produce Marketplace

## 🚀 Quick Start

### Start Development
```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev
```

### Access Application
- **Homepage**: http://localhost:8080/
- **Farmer Dashboard**: http://localhost:8080/farmer
- **Buyer Marketplace**: http://localhost:8080/buyer
- **API**: http://localhost:5000/api

## 🎯 Key Features

### 1. Image Upload
- **Location**: `/post` (Post Produce page)
- **Max Images**: 5 per listing
- **Max Size**: 5MB per image
- **Formats**: JPG, PNG, WebP
- **Storage**: Cloudinary CDN

### 2. Role-Based Redirect
- **Farmers** → `/farmer` (Dashboard)
- **Buyers** → `/buyer` (Marketplace)
- **Admins** → `/prices` (Market Prices)

### 3. Protected Routes
- **Farmer Only**: `/farmer`, `/post`, `/listings`
- **Buyer Only**: `/buyer`, `/marketplace`
- **All Authenticated**: `/profile`, `/prices`

### 4. Persistent Login
- Login persists after page refresh
- Auto-redirect to dashboard
- Token expiration handled

## 📋 User Roles

| Role | Dashboard | Can Post | Can Buy | Routes |
|------|-----------|----------|---------|--------|
| Farmer | `/farmer` | ✅ Yes | ❌ No | `/farmer`, `/post`, `/listings` |
| Buyer | `/buyer` | ❌ No | ✅ Yes | `/buyer`, `/marketplace` |
| Admin | `/prices` | ❌ No | ❌ No | `/prices` |

## 🔐 Authentication Flow

### Login
```
1. Go to /login
2. Enter email/phone + password
3. Click "Login"
4. Auto-redirect based on role:
   - Farmer → /farmer
   - Buyer → /buyer
```

### Registration
```
1. Go to /create-account
2. Fill in all fields
3. Click "Create Account"
4. Auto-redirect based on role
```

## 🖼️ Image Upload Flow

### Post Produce with Images
```
1. Login as farmer
2. Go to /post
3. Fill in crop details
4. Upload images (click or drag & drop)
5. Preview images
6. Click "Post Now"
7. Images uploaded to Cloudinary
8. Listing created with image URLs
```

## 🛣️ Route Map

### Public Routes
- `/` - Homepage (auto-redirects if logged in)
- `/login` - Login page (auto-redirects if logged in)
- `/create-account` - Registration (auto-redirects if logged in)

### Farmer Routes (Protected)
- `/farmer` - Farmer Dashboard
- `/farmer/dashboard` - Farmer Dashboard (alias)
- `/post` - Post Produce
- `/listings` - My Listings
- `/farmer/listings` - My Listings (alias)

### Buyer Routes (Protected)
- `/buyer` - Marketplace
- `/marketplace` - Marketplace (alias)

### Shared Routes (Protected)
- `/profile` - User Profile
- `/prices` - Market Prices

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=14d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/me` - Get my listings
- `POST /api/listings` - Create listing (with images)
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `PATCH /api/listings/:id/sold` - Mark as sold

### Prices
- `GET /api/prices` - Get market prices

## 🧪 Quick Test

### Test Image Upload
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cropType=maize" \
  -F "quantity=50" \
  -F "price=420" \
  -F "location=Tamale" \
  -F "images=@image1.jpg"
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"test123"}'
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Images not uploading | Check Cloudinary credentials |
| Not redirecting after login | Check role in user object |
| Can't access protected route | Check if logged in with correct role |
| Token expired | Login again |
| Build fails | Run `npm install` in both client and server |

## 📱 Testing Checklist

### Quick Test
- [ ] Register new farmer
- [ ] Login as farmer → Should go to `/farmer`
- [ ] Post produce with images
- [ ] View listing in marketplace
- [ ] View listing in my listings
- [ ] Logout
- [ ] Register new buyer
- [ ] Login as buyer → Should go to `/buyer`
- [ ] View marketplace with images
- [ ] Refresh page → Should stay on `/buyer`

## 🎨 UI Components

### Key Components
- `RoleBasedRedirect` - Auto-redirects logged-in users
- `RequireAuth` - Protects routes by role
- `ProduceCard` - Displays listing with images
- `PostProduce` - Upload form with image support
- `MyListings` - Shows farmer's listings with images

## 📚 Documentation Files

1. **QUICK_REFERENCE.md** - This file
2. **REFACTORING_COMPLETE.md** - Complete guide
3. **TESTING_GUIDE.md** - Testing checklist
4. **IMPLEMENTATION_SUMMARY.md** - Summary
5. **POST_PRODUCE_GUIDE.md** - Image upload guide

## 🚀 Deployment

### Build for Production
```bash
# Build client
cd client
npm run build

# Build output in client/dist
```

### Environment Setup
1. Set production environment variables
2. Configure Cloudinary for production
3. Set up MongoDB production database
4. Deploy server and client
5. Test all features

## 📞 Support

### For Issues
1. Check documentation files
2. Review error messages
3. Check browser console
4. Check server logs
5. Verify environment variables

### For Development
- Review `REFACTORING_COMPLETE.md`
- Check `TESTING_GUIDE.md`
- See `POST_PRODUCE_GUIDE.md` for image upload

---

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 2026-04-26
