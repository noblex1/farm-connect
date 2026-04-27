# 📱 Progressive Web App (PWA) Guide

## ✅ Your Farm Marketplace is Now a PWA!

Users can now install your app on their devices (Android, iOS, Windows, Mac) and use it like a native app!

---

## 🎯 What Was Added

### 1. **Service Worker** (`client/public/sw.js`)
- Caches assets for offline access
- Enables background sync
- Handles push notifications
- Network-first strategy with cache fallback

### 2. **Web App Manifest** (`client/public/manifest.json`)
- App name, description, and icons
- Theme colors and display mode
- App shortcuts for quick actions
- Categories and screenshots

### 3. **PWA Registration** (`client/src/registerSW.ts`)
- Registers service worker
- Handles updates
- Manages install prompts
- Notification permissions

### 4. **Install Button** (`client/src/components/InstallPWA.tsx`)
- Shows install prompt to users
- Dismissible banner
- Automatic detection of install state

### 5. **App Icons**
- Multiple sizes (72x72 to 512x512)
- Maskable icons for Android
- Apple touch icons for iOS

---

## 📱 How Users Can Install

### **Android (Chrome/Edge)**
1. Visit your website
2. Tap the "Install" button in the banner
3. Or tap the menu (⋮) → "Install app" or "Add to Home screen"
4. Confirm installation
5. App appears on home screen!

### **iOS (Safari)**
1. Visit your website in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. Edit name if desired
5. Tap "Add"
6. App appears on home screen!

### **Windows/Mac (Chrome/Edge)**
1. Visit your website
2. Click the install icon (⊕) in the address bar
3. Or click menu (⋮) → "Install Farm Market"
4. Confirm installation
5. App opens in its own window!

---

## 🎨 PWA Features

### ✅ **Installable**
- Users can install on home screen
- Runs in standalone mode (no browser UI)
- Custom splash screen
- App icon on device

### ✅ **Offline Support**
- Works without internet connection
- Caches essential assets
- Shows cached content when offline
- Syncs data when back online

### ✅ **Fast Loading**
- Instant loading from cache
- Background updates
- Optimized performance

### ✅ **Native-Like Experience**
- Full-screen mode
- Custom theme colors
- Smooth animations
- Touch-optimized

### ✅ **App Shortcuts**
- Quick access to key features
- Long-press app icon to see shortcuts:
  - Farmer Dashboard
  - Browse Marketplace
  - Market Prices

### ✅ **Push Notifications** (Ready)
- Service worker configured
- Can send updates to users
- Requires backend integration

---

## 🔧 Configuration

### **Theme Colors**
```json
{
  "theme_color": "#2D5F2E",        // Primary green
  "background_color": "#F5F3EF"    // Light background
}
```

### **Display Mode**
```json
{
  "display": "standalone"  // Full-screen, no browser UI
}
```

### **Start URL**
```json
{
  "start_url": "/"  // Opens at home page
}
```

---

## 🧪 Testing Your PWA

### **1. Lighthouse Audit**
```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
```

**Target Scores:**
- ✅ Installable
- ✅ PWA Optimized
- ✅ Fast and reliable
- ✅ Works offline

### **2. Manual Testing**

**Test Offline Mode:**
1. Open app in browser
2. Open DevTools (F12)
3. Go to "Network" tab
4. Select "Offline" from dropdown
5. Refresh page - should still work!

**Test Install:**
1. Open in Chrome/Edge
2. Look for install prompt
3. Click "Install"
4. Verify app opens in standalone mode

**Test on Mobile:**
1. Deploy to production (Vercel)
2. Open on mobile device
3. Install to home screen
4. Test all features

---

## 📊 PWA Checklist

### ✅ **Core Requirements**
- [x] HTTPS (automatic on Vercel)
- [x] Service Worker registered
- [x] Web App Manifest
- [x] Icons (192x192 and 512x512)
- [x] Responsive design
- [x] Fast loading

### ✅ **Enhanced Features**
- [x] Offline support
- [x] Install prompt
- [x] Theme colors
- [x] App shortcuts
- [x] Splash screen
- [x] Maskable icons

### 🔄 **Optional Enhancements**
- [ ] Push notifications (backend needed)
- [ ] Background sync (backend needed)
- [ ] Share target API
- [ ] File handling
- [ ] Periodic background sync

---

## 🚀 Deployment

### **Production Build**
```bash
cd client
npm run build
```

The build will:
- Bundle all assets
- Copy service worker to dist
- Copy manifest and icons
- Optimize for production

### **Vercel Deployment**
```bash
# Vercel automatically serves:
- /sw.js (service worker)
- /manifest.json (web app manifest)
- /icon-*.png (app icons)
```

### **Test Production PWA**
1. Deploy to Vercel
2. Visit your production URL
3. Open Chrome DevTools
4. Check "Application" tab
5. Verify:
   - Service Worker: Active
   - Manifest: Valid
   - Icons: All sizes present

---

## 📱 Platform-Specific Notes

### **Android**
- ✅ Full PWA support
- ✅ Install prompt works
- ✅ Splash screen automatic
- ✅ Maskable icons supported
- ✅ App shortcuts work

### **iOS (Safari)**
- ⚠️ No install prompt (manual only)
- ⚠️ Limited service worker support
- ✅ Add to Home Screen works
- ✅ Standalone mode works
- ⚠️ No push notifications

### **Windows/Mac**
- ✅ Full PWA support
- ✅ Install from browser
- ✅ Runs in app window
- ✅ Taskbar/dock integration

---

## 🔔 Push Notifications (Future)

To enable push notifications:

### **1. Backend Setup**
```javascript
// Generate VAPID keys
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();

// Configure web-push
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
```

### **2. Frontend Subscription**
```typescript
// Request permission
const permission = await Notification.requestPermission();

// Subscribe to push
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: 'YOUR_PUBLIC_VAPID_KEY'
});

// Send subscription to backend
await fetch('/api/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});
```

### **3. Send Notifications**
```javascript
// Backend sends notification
webpush.sendNotification(subscription, JSON.stringify({
  title: 'New Listing!',
  body: 'Fresh maize available in Tamale',
  icon: '/icon-192x192.png',
  badge: '/icon-72x72.png',
  data: { url: '/buyer' }
}));
```

---

## 🎯 Best Practices

### **1. Update Strategy**
- Service worker updates automatically
- Show update prompt to users
- Reload to get latest version

### **2. Cache Strategy**
- Cache essential assets on install
- Network-first for API calls
- Cache-first for static assets
- Update cache in background

### **3. Offline Experience**
- Show offline indicator
- Cache user actions
- Sync when back online
- Provide helpful error messages

### **4. Performance**
- Lazy load non-critical assets
- Optimize images
- Minimize JavaScript
- Use code splitting

---

## 🐛 Troubleshooting

### **Service Worker Not Registering**
```bash
# Check browser console for errors
# Ensure HTTPS (required for SW)
# Clear browser cache
# Check sw.js is accessible at /sw.js
```

### **Install Prompt Not Showing**
```bash
# Chrome requires:
- HTTPS
- Valid manifest.json
- Service worker registered
- Not already installed
- User engagement (visited twice)
```

### **Icons Not Showing**
```bash
# Verify icons exist in public folder
# Check manifest.json paths
# Clear browser cache
# Check icon sizes are correct
```

### **Offline Mode Not Working**
```bash
# Check service worker is active
# Verify cache strategy
# Check network tab in DevTools
# Ensure assets are being cached
```

---

## 📚 Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox (Advanced SW)](https://developers.google.com/web/tools/workbox)

---

## 🎉 Your PWA is Ready!

Users can now:
- ✅ Install your app on any device
- ✅ Use it offline
- ✅ Get fast, native-like experience
- ✅ Access via home screen icon
- ✅ Use app shortcuts

**Test it now:**
1. Build for production: `npm run build`
2. Deploy to Vercel
3. Open on mobile device
4. Install to home screen
5. Enjoy your PWA! 🚀

---

**Last Updated:** April 27, 2026
