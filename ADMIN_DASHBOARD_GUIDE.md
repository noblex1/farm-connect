# Admin Dashboard - Complete Guide

## Overview
A comprehensive, production-grade admin dashboard for the Farm Marketplace platform. Built with React, TypeScript, and following the existing project's design system and color theme.

## Features

### 1. **Dashboard Overview** (`/admin`)
- **Key Metrics Cards**:
  - Total Users (farmers + buyers breakdown)
  - Active Listings (with sold count)
  - Total Revenue (from all transactions)
  - Market Activity (weekly growth percentage)
- **Quick Action Cards**: Direct links to user management, listings, and prices
- **Recent Activity Feed**: Latest platform activities (new users, listings)

### 2. **User Management** (`/admin/users`)
- **User Statistics**:
  - Total users count
  - Farmers count
  - Buyers count
- **Search & Filter**:
  - Search by name, email, or phone number
  - Filter by role (farmer/buyer/admin)
- **User Table**:
  - Profile picture display
  - Contact information (email, phone)
  - Role badges with color coding
  - Location information
  - Join date
- **Actions**:
  - Toggle user status (active/inactive)
  - Delete user (with confirmation)
  - Automatically deletes farmer's listings when farmer is deleted

### 3. **Listings Management** (`/admin/listings`)
- **Listing Statistics**:
  - Total listings count
  - Available listings
  - Sold listings
  - Total value of all listings
- **Search & Filter**:
  - Search by crop type, location, or farmer name
  - Filter by crop type (maize/rice/yam)
  - Filter by status (available/sold)
- **Listings Table**:
  - Crop type with emoji icons
  - Farmer information with profile picture
  - Quantity and unit
  - Price per unit
  - Location
  - Status badges
  - Posted date
- **Actions**:
  - View listing details
  - Delete listing (with confirmation)

### 4. **Market Prices Management** (`/admin/prices`)
- **Price Cards** (one per crop type):
  - Current price display
  - Previous price comparison
  - Price trend indicator (up/down/same)
  - Percentage change
  - Last updated timestamp
- **Price Editing**:
  - Real-time price input
  - Change preview (amount and percentage)
  - Batch save functionality
  - Visual feedback for edited prices
- **Guidelines Card**: Best practices for price updates

### 5. **Analytics Dashboard** (`/admin/analytics`)
- **Key Performance Indicators**:
  - Total revenue with growth percentage
  - Active users with new user count
  - Total listings with availability
  - Conversion rate (sold/total)
- **Crop Distribution Chart**:
  - Visual breakdown by crop type
  - Count and percentage for each crop
  - Progress bars
- **User Growth Chart**:
  - Farmers vs buyers distribution
  - Visual progress bars
  - Total user count
- **Top Locations**:
  - Most active regions
  - Listing count per location
  - Ranked display
- **Platform Trends**:
  - Average listing price
  - Average time to sell
  - User engagement rate

## Design System

### Color Theme
The dashboard follows the existing farm marketplace theme:
- **Primary**: `hsl(123 46% 34%)` - Forest green (for farmers, success)
- **Secondary**: `hsl(22 23% 47%)` - Warm brown (for buyers, earth tones)
- **Accent**: `hsl(48 96% 58%)` - Golden yellow (for highlights)
- **Success**: `hsl(137 48% 34%)` - Green (for positive metrics)
- **Destructive**: `hsl(0 84.2% 60.2%)` - Red (for delete actions)
- **Surface Colors**: `surface-leaf`, `surface-warm`, `earth-soft`

### UI Components
- **Cards**: Rounded corners (3xl), border-2, shadow-touch
- **Buttons**: Rounded (2xl), font-bold, with icons
- **Tables**: shadcn/ui Table component with custom styling
- **Badges**: Rounded (xl), role-based colors
- **Inputs**: Rounded (2xl), font-semibold
- **Animations**: `animate-gentle-rise` for page transitions

### Typography
- **Headers**: font-black (900 weight)
- **Body**: font-bold (700 weight) or font-semibold (600 weight)
- **Muted text**: text-muted-foreground

## API Endpoints

### Admin Routes (Protected - Admin Only)
All routes require authentication and admin role.

#### Stats & Analytics
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Detailed analytics data

#### User Management
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/status` - Toggle user status

#### Listing Management
- `GET /api/admin/listings` - Get all listings
- `DELETE /api/admin/listings/:id` - Delete listing

#### Price Management
- `POST /api/prices` - Update market prices (existing endpoint)

## File Structure

### Client Files
```
client/src/
├── pages/
│   ├── AdminDashboard.tsx      # Main dashboard
│   ├── AdminUsers.tsx          # User management
│   ├── AdminListings.tsx       # Listings management
│   ├── AdminPrices.tsx         # Price management
│   └── AdminAnalytics.tsx      # Analytics dashboard
├── services/
│   └── adminApi.ts             # Admin API functions
└── App.tsx                     # Updated with admin routes
```

### Server Files
```
server/src/
├── routes/
│   └── adminRoutes.js          # Admin route definitions
├── controllers/
│   └── adminController.js      # Admin business logic
└── app.js                      # Updated with admin routes
```

## Authentication & Authorization

### Role-Based Access
- All admin routes require `admin` role
- Protected by `RequireAuth` component on client
- Protected by `protect` and `authorize("admin")` middleware on server
- Automatic redirect to `/admin` for admin users after login

### Security Features
- JWT token validation
- Role verification on every request
- Rate limiting on API endpoints
- Input validation and sanitization
- Confirmation dialogs for destructive actions

## Usage

### Creating an Admin User
Currently, admin users must be created directly in the database:

```javascript
// In MongoDB shell or using a script
db.users.insertOne({
  name: "Admin User",
  email: "admin@farmmarket.com",
  phoneNumber: "+233123456789",
  password: "$2a$10$...", // bcrypt hashed password
  role: "admin",
  location: "Tamale",
  createdAt: new Date()
});
```

### Accessing the Dashboard
1. Login with admin credentials at `/login`
2. Automatically redirected to `/admin`
3. Navigate using the bottom navigation (mobile) or direct URLs

### Managing Users
1. Go to `/admin/users`
2. Use search to find specific users
3. Filter by role if needed
4. Click delete to remove users (confirms first)
5. Toggle status to activate/deactivate users

### Managing Listings
1. Go to `/admin/listings`
2. Search by crop, location, or farmer
3. Filter by crop type or status
4. View listing details
5. Delete inappropriate listings

### Updating Prices
1. Go to `/admin/prices`
2. Enter new prices for each crop
3. See real-time change preview
4. Click "Save Changes" to update all at once
5. Previous prices are automatically saved

### Viewing Analytics
1. Go to `/admin/analytics`
2. View key metrics at the top
3. Analyze crop distribution
4. Monitor user growth
5. Check top locations
6. Review platform trends

## Mobile Responsiveness

The dashboard is fully responsive:
- **Mobile**: Single column layout, bottom navigation
- **Tablet**: 2-column grid for cards
- **Desktop**: 3-4 column grid, full table display

### Mobile Optimizations
- Touch-friendly buttons (size="touch")
- Horizontal scroll for tables
- Stacked filters
- Condensed information display

## Performance Optimizations

- **React Query**: Automatic caching and refetching
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: Immediate UI feedback
- **Debounced Search**: Reduces API calls
- **Pagination Ready**: Structure supports pagination

## Future Enhancements

### Potential Features
1. **User Creation**: Admin can create new users
2. **Bulk Actions**: Select multiple items for batch operations
3. **Export Data**: Download reports as CSV/PDF
4. **Advanced Analytics**: Charts with date range selection
5. **Activity Logs**: Detailed audit trail
6. **Email Notifications**: Alert admins of important events
7. **Role Management**: Create custom roles with permissions
8. **Dashboard Customization**: Drag-and-drop widgets
9. **Real-time Updates**: WebSocket for live data
10. **Mobile App**: Native admin app

### Database Enhancements
1. Add `active` field to User model
2. Add `deletedAt` field for soft deletes
3. Create Activity/Audit log model
4. Add indexes for better query performance

## Troubleshooting

### Common Issues

**Issue**: Admin routes return 403 Forbidden
- **Solution**: Ensure user has `role: "admin"` in database

**Issue**: Dashboard shows no data
- **Solution**: Check API endpoints are working, verify token is valid

**Issue**: Can't delete users
- **Solution**: Verify admin permissions, check server logs

**Issue**: Prices not updating
- **Solution**: Ensure at least one price is edited before saving

## Testing

### Manual Testing Checklist
- [ ] Login as admin redirects to `/admin`
- [ ] Dashboard displays correct statistics
- [ ] User search and filters work
- [ ] User deletion removes user and their listings
- [ ] Listing search and filters work
- [ ] Listing deletion works
- [ ] Price updates save correctly
- [ ] Analytics display accurate data
- [ ] Mobile navigation works
- [ ] All pages are responsive

### Test Data
Create test data for comprehensive testing:
- Multiple users with different roles
- Listings in various states (available/sold)
- Different crop types
- Various locations

## Support

For issues or questions:
1. Check server logs for errors
2. Verify database connection
3. Ensure all dependencies are installed
4. Check browser console for client errors

## License

This admin dashboard is part of the Farm Marketplace project and follows the same license.
