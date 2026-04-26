# Testing Guide - Farm Produce Marketplace

## 🧪 Complete Testing Checklist

### Prerequisites
- [ ] Server running on http://localhost:5000
- [ ] Client running on http://localhost:8080
- [ ] MongoDB connected
- [ ] Cloudinary configured

## 1. 🖼️ Image Upload Testing

### Test Image Upload on Post Produce Page

**Steps:**
1. [ ] Login as a farmer
2. [ ] Navigate to `/post`
3. [ ] Fill in all required fields:
   - Crop Type: Maize
   - Quantity: 50
   - Unit: bag
   - Price: 420
   - Location: Tamale
4. [ ] Click on upload area
5. [ ] Select 1-3 images (JPG, PNG, or WebP)
6. [ ] Verify images appear as thumbnails
7. [ ] Click "Post Now"
8. [ ] Verify success message
9. [ ] Navigate to `/buyer` (marketplace)
10. [ ] Verify your listing shows with images

**Expected Results:**
- ✅ Images upload successfully
- ✅ Thumbnails show before posting
- ✅ Images appear in marketplace
- ✅ First image is main thumbnail

### Test Drag & Drop

**Steps:**
1. [ ] Go to `/post`
2. [ ] Open file explorer
3. [ ] Drag 2-3 images to upload area
4. [ ] Drop images
5. [ ] Verify images appear as thumbnails
6. [ ] Submit form

**Expected Results:**
- ✅ Drag & drop works
- ✅ Images preview correctly
- ✅ Form submits successfully

### Test Image Validation

**Steps:**
1. [ ] Try uploading .gif file → Should fail
2. [ ] Try uploading 10MB image → Should fail
3. [ ] Try uploading 6 images → Should fail (max 5)
4. [ ] Try uploading .jpg file → Should succeed

**Expected Results:**
- ✅ Invalid file types rejected
- ✅ Large files rejected
- ✅ Max count enforced
- ✅ Valid files accepted

### Test Image Display

**Steps:**
1. [ ] Go to `/buyer` (marketplace)
2. [ ] Verify listings show images
3. [ ] Go to `/listings` (my listings)
4. [ ] Verify your listings show images
5. [ ] Hover over images
6. [ ] Verify hover effects work

**Expected Results:**
- ✅ Images display in marketplace
- ✅ Images display in my listings
- ✅ Hover effects work
- ✅ Lazy loading works

## 2. 🔐 Role-Based Redirect Testing

### Test Farmer Login Redirect

**Steps:**
1. [ ] Logout if logged in
2. [ ] Go to homepage `/`
3. [ ] Click "I am a Farmer" button
4. [ ] Should redirect to `/login?role=farmer`
5. [ ] Enter farmer credentials:
   - Email/Phone: [your farmer email]
   - Password: [your password]
6. [ ] Click "Login"
7. [ ] Verify loading spinner shows
8. [ ] Verify success toast appears
9. [ ] Verify redirect to `/farmer`

**Expected Results:**
- ✅ Redirects to `/farmer` (Farmer Dashboard)
- ✅ Toast shows: "Login successful! Welcome back, [Name]!"
- ✅ Dashboard loads correctly
- ✅ User info displays

### Test Buyer Login Redirect

**Steps:**
1. [ ] Logout if logged in
2. [ ] Go to homepage `/`
3. [ ] Click "I am a Buyer" button
4. [ ] Should redirect to `/login?role=buyer`
5. [ ] Enter buyer credentials
6. [ ] Click "Login"
7. [ ] Verify loading spinner shows
8. [ ] Verify success toast appears
9. [ ] Verify redirect to `/buyer`

**Expected Results:**
- ✅ Redirects to `/buyer` (Marketplace)
- ✅ Toast shows: "Login successful! Welcome back, [Name]!"
- ✅ Marketplace loads correctly
- ✅ Listings display

### Test Registration Redirect

**Steps:**
1. [ ] Go to `/create-account?role=farmer`
2. [ ] Fill in all fields:
   - Name: Test Farmer
   - Email: testfarmer@example.com
   - Phone: +233201234567
   - Password: test123
   - Location: Tamale
3. [ ] Click "Create Account"
4. [ ] Verify success message
5. [ ] Verify redirect to `/farmer`

**Expected Results:**
- ✅ Account created successfully
- ✅ Toast shows: "Account created successfully! Welcome..."
- ✅ Redirects to `/farmer`
- ✅ User logged in automatically

## 3. 🧭 Protected Routes Testing

### Test Farmer Route Protection

**Steps:**
1. [ ] Login as farmer
2. [ ] Try to access `/farmer` → Should work
3. [ ] Try to access `/post` → Should work
4. [ ] Try to access `/listings` → Should work
5. [ ] Try to access `/buyer` → Should redirect to login
6. [ ] Try to access `/marketplace` → Should redirect to login

**Expected Results:**
- ✅ Farmer can access farmer routes
- ✅ Farmer cannot access buyer routes
- ✅ Redirects to login with role parameter

### Test Buyer Route Protection

**Steps:**
1. [ ] Login as buyer
2. [ ] Try to access `/buyer` → Should work
3. [ ] Try to access `/marketplace` → Should work
4. [ ] Try to access `/farmer` → Should redirect to login
5. [ ] Try to access `/post` → Should redirect to login
6. [ ] Try to access `/listings` → Should redirect to login

**Expected Results:**
- ✅ Buyer can access buyer routes
- ✅ Buyer cannot access farmer routes
- ✅ Redirects to login with role parameter

### Test Unauthenticated Access

**Steps:**
1. [ ] Logout completely
2. [ ] Try to access `/farmer` → Should redirect to login
3. [ ] Try to access `/buyer` → Should redirect to login
4. [ ] Try to access `/post` → Should redirect to login
5. [ ] Try to access `/profile` → Should redirect to login

**Expected Results:**
- ✅ All protected routes redirect to login
- ✅ Next parameter preserved in URL
- ✅ After login, returns to intended page

## 4. 🔄 Persistent Login Testing

### Test Page Refresh

**Steps:**
1. [ ] Login as farmer
2. [ ] Navigate to `/farmer`
3. [ ] Refresh page (F5)
4. [ ] Verify still on `/farmer`
5. [ ] Verify user info still displays
6. [ ] Navigate to `/post`
7. [ ] Refresh page
8. [ ] Verify still on `/post`

**Expected Results:**
- ✅ Login persists after refresh
- ✅ User stays on current page
- ✅ User info still available
- ✅ No redirect to homepage

### Test Auto-Redirect for Logged-In Users

**Steps:**
1. [ ] Login as farmer
2. [ ] Manually navigate to `/` (homepage)
3. [ ] Verify auto-redirect to `/farmer`
4. [ ] Manually navigate to `/login`
5. [ ] Verify auto-redirect to `/farmer`
6. [ ] Manually navigate to `/create-account`
7. [ ] Verify auto-redirect to `/farmer`

**Expected Results:**
- ✅ Logged-in users never see homepage
- ✅ Logged-in users never see login form
- ✅ Logged-in users never see registration form
- ✅ Always redirected to role-specific dashboard

### Test Token Expiration

**Steps:**
1. [ ] Login as any user
2. [ ] Open browser DevTools
3. [ ] Go to Application > Local Storage
4. [ ] Find the token
5. [ ] Manually modify token to invalid value
6. [ ] Refresh page
7. [ ] Verify redirect to login
8. [ ] Verify session cleared

**Expected Results:**
- ✅ Invalid token detected
- ✅ Session cleared
- ✅ Redirected to login
- ✅ Can login again successfully

## 5. 🎨 UX Testing

### Test Loading States

**Steps:**
1. [ ] Go to login page
2. [ ] Enter credentials
3. [ ] Click "Login"
4. [ ] Verify button shows "Logging in..."
5. [ ] Verify button is disabled
6. [ ] Wait for response

**Expected Results:**
- ✅ Loading text shows
- ✅ Button disabled during loading
- ✅ Spinner or loading indicator visible

### Test Toast Notifications

**Steps:**
1. [ ] Login successfully
2. [ ] Verify toast appears: "Login successful! Welcome back, [Name]!"
3. [ ] Register new account
4. [ ] Verify toast appears: "Account created successfully! Welcome..."
5. [ ] Post produce
6. [ ] Verify toast appears: "Your produce has been posted..."
7. [ ] Mark listing as sold
8. [ ] Verify toast appears: "Listing marked as sold"

**Expected Results:**
- ✅ Success toasts appear
- ✅ Toasts auto-dismiss
- ✅ Toasts show correct messages
- ✅ Toasts styled correctly

### Test Error Handling

**Steps:**
1. [ ] Try to login with wrong password
2. [ ] Verify error message shows
3. [ ] Try to register with existing email
4. [ ] Verify error message shows
5. [ ] Try to upload invalid file
6. [ ] Verify error toast shows

**Expected Results:**
- ✅ Error messages clear and helpful
- ✅ Errors show inline where appropriate
- ✅ Error toasts for system errors
- ✅ Errors don't crash the app

## 6. 📱 Responsive Testing

### Test on Different Screen Sizes

**Steps:**
1. [ ] Open DevTools
2. [ ] Toggle device toolbar
3. [ ] Test on:
   - [ ] Mobile (375px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1024px)
   - [ ] Large Desktop (1440px)
4. [ ] Verify all features work on each size

**Expected Results:**
- ✅ Layout responsive
- ✅ Images scale correctly
- ✅ Buttons accessible
- ✅ Forms usable on mobile

## 7. 🔒 Security Testing

### Test Authentication

**Steps:**
1. [ ] Try to access API without token
2. [ ] Try to access protected route without login
3. [ ] Try to access wrong role's route
4. [ ] Try to manipulate token in localStorage

**Expected Results:**
- ✅ Unauthorized requests rejected
- ✅ Protected routes redirect to login
- ✅ Role enforcement works
- ✅ Invalid tokens detected

## 8. 🚀 Performance Testing

### Test Load Times

**Steps:**
1. [ ] Open DevTools > Network tab
2. [ ] Clear cache
3. [ ] Navigate to `/buyer`
4. [ ] Measure page load time
5. [ ] Check image load times
6. [ ] Verify lazy loading works

**Expected Results:**
- ✅ Page loads < 3 seconds
- ✅ Images load progressively
- ✅ Lazy loading works
- ✅ No unnecessary requests

## 📊 Test Results Summary

### Image Upload
- [ ] Upload works: ___/___
- [ ] Drag & drop works: ___/___
- [ ] Validation works: ___/___
- [ ] Display works: ___/___

### Role-Based Redirect
- [ ] Farmer redirect: ___/___
- [ ] Buyer redirect: ___/___
- [ ] Registration redirect: ___/___
- [ ] Toast notifications: ___/___

### Protected Routes
- [ ] Farmer routes: ___/___
- [ ] Buyer routes: ___/___
- [ ] Unauthorized access: ___/___

### Persistent Login
- [ ] Page refresh: ___/___
- [ ] Auto-redirect: ___/___
- [ ] Token validation: ___/___

### UX
- [ ] Loading states: ___/___
- [ ] Toasts: ___/___
- [ ] Error handling: ___/___

### Overall Status
- [ ] All tests passed
- [ ] Ready for production

## 🐛 Issues Found

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |

## ✅ Sign-Off

- [ ] All critical features tested
- [ ] All tests passed
- [ ] No blocking issues
- [ ] Ready for deployment

**Tested by**: _______________  
**Date**: _______________  
**Environment**: _______________

---

**Version**: 2.0.0  
**Status**: Ready for Testing
