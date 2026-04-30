# Visual Verification Guide

## What to Check After Recent Updates

### 1. Landing Page (NewLanding.tsx)

#### Hero Section
- **Expected**: Market image (`market.jpeg`) as background with gradient overlay
- **Check**: 
  - Image covers entire hero section
  - Gradient overlay provides depth
  - Text is readable over the image
  - Floating product cards have glassmorphism effect (semi-transparent with blur)
  - Stats display correctly (500+ farmers, 1000+ buyers, 5000+ transactions)

#### CTA Section (Call to Action)
- **Expected**: Rounded card with green background
- **Check**:
  - Card has rounded corners (`rounded-3xl`)
  - "I'm a Farmer" button: Secondary variant (visible text)
  - "I'm a Buyer" button: White background with primary (green) text
  - Both buttons are clearly visible and readable
  - Section background is `bg-background` (not full-width green)
  - Proper spacing and shadows

#### Benefits Section
- **Expected**: Farmers image with gradient overlay
- **Check**:
  - Image (`farmers.jpg`) displays correctly
  - Gradient overlay from bottom to top
  - White text at bottom is readable
  - Wheat emoji (🌾) displays above text
  - Text has drop shadows for visibility

---

### 2. Input Fields (All Forms)

#### Light Mode
- **Expected**: White background with subtle gray border
- **Check**:
  - Background: White (`bg-white`)
  - Border: Light gray (`border-input`)
  - Hover: Border changes to light primary color
  - Focus: Border becomes primary color with ring effect
  - Text: Dark and readable
  - Placeholder: Gray and readable

#### Dark Mode
- **Expected**: Dark semi-transparent background with visible borders
- **Check**:
  - Background: Dark muted (`dark:bg-muted/50`)
  - Border: Muted color (`dark:border-muted`)
  - Hover: Border changes to light primary color
  - Focus: Background slightly lighter, border becomes primary
  - Text: Light and readable
  - Placeholder: Light gray and readable

#### Pages to Test
1. **Login Page** (`/login?role=farmer` or `/login?role=buyer`)
   - Email/Phone input
   - Password input with show/hide toggle
   
2. **Create Account Page** (`/create-account?role=farmer` or `/create-account?role=buyer`)
   - Name input
   - Email input
   - Phone input
   - Password input with show/hide toggle
   - Location input

3. **Settings Page** (`/settings`)
   - All input fields in various sections
   - Theme toggle switch

4. **Change Password Page** (`/settings` → Change Password)
   - Email input
   - OTP input
   - New password inputs

---

### 3. Theme Toggle

#### How to Test
1. Navigate to Settings page (`/settings`)
2. Find "Appearance" section
3. Click the theme toggle button (Sun/Moon icon)
4. Observe immediate theme change

#### Expected Behavior
- **Light Mode**: 
  - Sun icon visible
  - White/light backgrounds
  - Dark text
  - Subtle shadows
  
- **Dark Mode**: 
  - Moon icon visible
  - Dark backgrounds with green accents
  - Light text
  - Stronger shadows

#### Persistence Test
1. Toggle theme to dark mode
2. Refresh the page
3. Theme should remain dark
4. Check localStorage: `farm-market-theme` should be "dark"

---

### 4. Mobile Responsiveness

#### How to Test
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - Mobile: 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

#### What to Check
- **Navbar**: 
  - Solid green background on mobile
  - All 5 buttons visible and accessible
  - Icons and text properly sized
  
- **Forms**: 
  - Input fields full width on mobile
  - Touch-friendly button sizes (44px+ height)
  - Proper spacing between elements
  
- **Landing Page**: 
  - Hero section stacks on mobile
  - Images scale properly
  - Text remains readable
  - Cards don't overflow

---

### 5. Cross-Browser Testing

#### Browsers to Test
- Chrome/Edge (Chromium)
- Firefox
- Safari (if available)

#### What to Check
- Theme toggle works
- Input fields render correctly
- Images display properly
- Animations work smoothly
- No console errors

---

## Common Issues and Solutions

### Issue: Input fields appear white in dark mode
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Theme doesn't persist after refresh
**Solution**: Check browser localStorage is enabled and not blocked

### Issue: Images don't display
**Solution**: Verify images exist in `client/public/` folder:
- `market.jpeg`
- `farmers.jpg`

### Issue: CTA button text not visible
**Solution**: Verify the "I'm a Buyer" button has:
```tsx
className="h-14 text-lg font-bold bg-white text-primary border-2 border-white hover:bg-white/90 hover:text-primary shadow-lg hover:shadow-xl transition-all"
```

---

## Quick Test Checklist

### Landing Page
- [ ] Hero image displays correctly
- [ ] Floating cards have glassmorphism effect
- [ ] CTA section has rounded corners
- [ ] Both CTA buttons are visible and readable
- [ ] Farmers image displays in Benefits section
- [ ] All sections responsive on mobile

### Input Fields
- [ ] White background in light mode
- [ ] Dark semi-transparent background in dark mode
- [ ] Borders visible in both modes
- [ ] Hover states work
- [ ] Focus states work
- [ ] Text readable in both modes

### Theme System
- [ ] Toggle works in Settings
- [ ] Theme persists after refresh
- [ ] All pages respect theme
- [ ] All components respect theme
- [ ] No visual glitches during toggle

### Mobile
- [ ] Navbar displays correctly
- [ ] All buttons are touch-friendly
- [ ] Forms are usable on small screens
- [ ] No horizontal scrolling
- [ ] Images scale properly

---

**Testing Priority**: High
**Estimated Testing Time**: 15-20 minutes
**Last Updated**: April 30, 2026
