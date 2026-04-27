# Admin Dashboard - Visual Structure

## 🗺️ Navigation Flow

```
Login Page (/login)
    ↓
[Admin Credentials]
    ↓
Auto-redirect to Admin Dashboard
    ↓
┌─────────────────────────────────────────────────────────┐
│                   ADMIN DASHBOARD                        │
│                      (/admin)                            │
├─────────────────────────────────────────────────────────┤
│  📊 Stats Cards                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Users   │ │ Listings │ │ Revenue  │ │ Activity │  │
│  │   👥     │ │   📦     │ │   💰     │ │   📈     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  🎯 Quick Actions                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Manage Users │ │   Listings   │ │    Prices    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                          │
│  📋 Recent Activity                                      │
│  • New user registered                                   │
│  • Listing posted                                        │
│  • Price updated                                         │
└─────────────────────────────────────────────────────────┘
         │              │              │              │
         ↓              ↓              ↓              ↓
    [Users]      [Listings]      [Prices]      [Analytics]
```

## 📱 Bottom Navigation (Mobile)

```
┌─────────────────────────────────────────────────────────┐
│                    Content Area                          │
│                                                          │
│                  (Current Page)                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  🏠      🛒      👨‍🌾      📊      📦                      │
│ Home   Buy   Farmer  Admin  Mine                        │
│                      ^^^^                                │
│                   (Highlighted)                          │
└─────────────────────────────────────────────────────────┘
```

## 👥 User Management Page (/admin/users)

```
┌─────────────────────────────────────────────────────────┐
│  👥 User Management                                      │
├─────────────────────────────────────────────────────────┤
│  Stats:  [Total: 150] [Farmers: 100] [Buyers: 50]      │
├─────────────────────────────────────────────────────────┤
│  🔍 Search: [________________]  🎯 Filter: [All Roles ▼]│
├─────────────────────────────────────────────────────────┤
│  User Table                                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Avatar │ Name      │ Contact    │ Role   │ Actions │ │
│  ├────────────────────────────────────────────────────┤ │
│  │  👤   │ John Doe  │ john@...   │ FARMER │ ✓ 🗑️   │ │
│  │  👤   │ Jane Doe  │ jane@...   │ BUYER  │ ✓ 🗑️   │ │
│  │  👤   │ Bob Smith │ bob@...    │ FARMER │ ✓ 🗑️   │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 📦 Listings Management Page (/admin/listings)

```
┌─────────────────────────────────────────────────────────┐
│  📦 Listings Management                                  │
├─────────────────────────────────────────────────────────┤
│  Stats: [Total: 200] [Available: 150] [Sold: 50]       │
│         [Total Value: ₵500,000]                         │
├─────────────────────────────────────────────────────────┤
│  🔍 [Search...] 🎯 [Crop ▼] 🎯 [Status ▼]              │
├─────────────────────────────────────────────────────────┤
│  Listings Table                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Crop │ Farmer  │ Qty │ Price │ Location │ Actions │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ 🌽  │ John    │ 100 │ ₵250  │ Tamale   │ 👁️ 🗑️  │ │
│  │ 🌾  │ Jane    │ 50  │ ₵300  │ Accra    │ 👁️ 🗑️  │ │
│  │ 🍠  │ Bob     │ 75  │ ₵200  │ Kumasi   │ 👁️ 🗑️  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 💰 Price Management Page (/admin/prices)

```
┌─────────────────────────────────────────────────────────┐
│  💰 Market Prices Management        [💾 Save Changes]   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ 🌽 Maize    │  │ 🌾 Rice     │  │ 🍠 Yam      │    │
│  │             │  │             │  │             │    │
│  │ Current:    │  │ Current:    │  │ Current:    │    │
│  │ ₵250        │  │ ₵300        │  │ ₵200        │    │
│  │             │  │             │  │             │    │
│  │ Previous:   │  │ Previous:   │  │ Previous:   │    │
│  │ ₵240 (+4%)  │  │ ₵290 (+3%)  │  │ ₵200 (0%)   │    │
│  │             │  │             │  │             │    │
│  │ Update:     │  │ Update:     │  │ Update:     │    │
│  │ [₵ 255   ]  │  │ [₵ 310   ]  │  │ [₵ 205   ]  │    │
│  │             │  │             │  │             │    │
│  │ Change:     │  │ Change:     │  │ Change:     │    │
│  │ +₵5 (+2%)   │  │ +₵10 (+3%)  │  │ +₵5 (+2.5%) │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 📊 Analytics Dashboard (/admin/analytics)

```
┌─────────────────────────────────────────────────────────┐
│  📊 Analytics Dashboard                                  │
├─────────────────────────────────────────────────────────┤
│  KPI Cards                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Revenue  │ │  Users   │ │ Listings │ │Conversion│  │
│  │ ₵500K    │ │   150    │ │   200    │ │   25%    │  │
│  │ +15% 📈  │ │ +10 new  │ │ 150 live │ │ 50 sold  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  Charts Section                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Crop Distribution│  │   User Growth    │            │
│  │                  │  │                  │            │
│  │ 🌽 Maize  45%    │  │ 👨‍🌾 Farmers: 100 │            │
│  │ ████████████     │  │ ████████████     │            │
│  │                  │  │                  │            │
│  │ 🌾 Rice   35%    │  │ 🛒 Buyers: 50    │            │
│  │ █████████        │  │ ██████           │            │
│  │                  │  │                  │            │
│  │ 🍠 Yam    20%    │  │ Total: 150       │            │
│  │ █████            │  │                  │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Top Locations   │  │ Platform Trends  │            │
│  │                  │  │                  │            │
│  │ #1 Tamale   80   │  │ Avg Price: ₵250  │            │
│  │ #2 Accra    50   │  │ Time to Sell: 5d │            │
│  │ #3 Kumasi   40   │  │ Engagement: 85%  │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT SIDE                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  React Components                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AdminDashboard │ AdminUsers │ AdminListings     │  │
│  │ AdminPrices    │ AdminAnalytics                 │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  React Query (Caching & State Management)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ useQuery() │ useMutation() │ queryClient        │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  API Service Layer                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ adminApi.ts - Type-safe API calls                │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  API Client                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ apiClient.ts - Fetch wrapper with auth          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────┐
│                      SERVER SIDE                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Express Routes                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ /api/admin/* - Admin endpoints                   │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  Middleware                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ protect() - JWT validation                       │  │
│  │ authorize("admin") - Role check                  │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  Controllers                                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ adminController.js - Business logic              │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  Mongoose Models                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ User │ Listing │ MarketPrice                     │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                 │
│  MongoDB Database                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Collections: users, listings, marketprices       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Stack                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Client-Side Protection                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • RequireAuth component (role check)             │  │
│  │ • Token validation before API calls              │  │
│  │ • Automatic redirect on auth failure             │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  Layer 2: Network Security                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • HTTPS (production)                             │  │
│  │ • CORS configuration                             │  │
│  │ • Rate limiting                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  Layer 3: Server Authentication                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • JWT token verification                         │  │
│  │ • Token expiry check                             │  │
│  │ • User existence validation                      │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  Layer 4: Authorization                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • Role-based access control                      │  │
│  │ • Admin role requirement                         │  │
│  │ • Permission validation                          │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                 │
│  Layer 5: Data Protection                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • Input validation                               │  │
│  │ • SQL injection prevention (NoSQL)               │  │
│  │ • XSS protection                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📊 Component Hierarchy

```
App.tsx
  └── BrowserRouter
      └── Routes
          └── Route (FarmShell)
              └── Route (RequireAuth - admin only)
                  ├── AdminDashboard (/admin)
                  │   ├── Card (Stats)
                  │   ├── Card (Quick Actions)
                  │   └── Card (Recent Activity)
                  │
                  ├── AdminUsers (/admin/users)
                  │   ├── Card (Header + Stats)
                  │   │   ├── Input (Search)
                  │   │   └── Select (Filter)
                  │   └── Card (Table)
                  │       └── Table
                  │           ├── TableHeader
                  │           └── TableBody
                  │               └── TableRow (per user)
                  │                   └── Actions (Buttons)
                  │
                  ├── AdminListings (/admin/listings)
                  │   ├── Card (Header + Stats)
                  │   │   ├── Input (Search)
                  │   │   ├── Select (Crop Filter)
                  │   │   └── Select (Status Filter)
                  │   └── Card (Table)
                  │       └── Table
                  │           └── TableRow (per listing)
                  │               └── Actions (Buttons)
                  │
                  ├── AdminPrices (/admin/prices)
                  │   ├── Card (Header + Save Button)
                  │   └── Grid
                  │       └── Card (per crop)
                  │           ├── Current Price Display
                  │           ├── Previous Price
                  │           ├── Input (New Price)
                  │           └── Change Preview
                  │
                  └── AdminAnalytics (/admin/analytics)
                      ├── Card (Header)
                      ├── Grid (KPI Cards)
                      └── Grid (Charts)
                          ├── Card (Crop Distribution)
                          ├── Card (User Growth)
                          ├── Card (Top Locations)
                          └── Card (Platform Trends)
```

## 🎨 Color Coding System

```
┌─────────────────────────────────────────────────────────┐
│                    Color Meanings                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🟢 Primary Green (hsl(123 46% 34%))                    │
│     • Farmers                                            │
│     • Success states                                     │
│     • Positive metrics                                   │
│     • Available status                                   │
│                                                          │
│  🟤 Secondary Brown (hsl(22 23% 47%))                   │
│     • Buyers                                             │
│     • Earth tones                                        │
│     • Neutral actions                                    │
│                                                          │
│  🟡 Accent Yellow (hsl(48 96% 58%))                     │
│     • Highlights                                         │
│     • Warnings                                           │
│     • Important info                                     │
│     • Financial metrics                                  │
│                                                          │
│  🔴 Destructive Red (hsl(0 84.2% 60.2%))               │
│     • Delete actions                                     │
│     • Errors                                             │
│     • Critical warnings                                  │
│     • Admin role badge                                   │
│                                                          │
│  ⚪ Surface Colors                                       │
│     • surface-leaf: Light green backgrounds              │
│     • surface-warm: Light brown backgrounds              │
│     • earth-soft: Soft beige backgrounds                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────┐
│                  Responsive Layout                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Mobile (< 768px)                                        │
│  ┌────────────────────────────────────────────────┐    │
│  │  [Header]                                       │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │ Card 1                                    │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │ Card 2                                    │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  │  [Bottom Nav: 🏠 🛒 👨‍🌾 📊 📦]                │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Tablet (768px - 1024px)                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  [Header]                                       │    │
│  │  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │ Card 1           │  │ Card 2           │   │    │
│  │  └──────────────────┘  └──────────────────┘   │    │
│  │  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │ Card 3           │  │ Card 4           │   │    │
│  │  └──────────────────┘  └──────────────────┘   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Desktop (> 1024px)                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  [Header]                                       │    │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │    │
│  │  │Card 1│  │Card 2│  │Card 3│  │Card 4│       │    │
│  │  └──────┘  └──────┘  └──────┘  └──────┘       │    │
│  │  ┌─────────────────────────────────────────┐   │    │
│  │  │ Full Width Table                        │   │    │
│  │  └─────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

**This visual guide complements the technical documentation and provides a clear overview of the admin dashboard structure.**
