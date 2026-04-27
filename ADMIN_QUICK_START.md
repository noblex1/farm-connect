# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Create an Admin User

Since there's no admin registration UI yet, create an admin user directly in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use farm-market

# Create admin user (replace with your details)
db.users.insertOne({
  name: "Admin User",
  email: "admin@farmmarket.com",
  phoneNumber: "+233500000000",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  location: "Tamale",
  profilePicture: "",
  whatsappNumber: "",
  createdAt: new Date()
})
```

**To hash a password:**
```javascript
// In Node.js REPL or a script
const bcrypt = require('bcryptjs');
const password = 'YourSecurePassword123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash); // Use this in the database
```

### Step 2: Start the Application

```bash
# Terminal 1 - Start the server
cd server
npm install
npm run dev

# Terminal 2 - Start the client
cd client
npm install
npm run dev
```

### Step 3: Login as Admin

1. Open browser to `http://localhost:5173`
2. Click "Login" or go to `/login`
3. Enter admin credentials:
   - Email or Phone: `admin@farmmarket.com` or `+233500000000`
   - Password: Your password
4. You'll be automatically redirected to `/admin`

### Step 4: Explore the Dashboard

**Main Dashboard** (`/admin`)
- View key metrics
- See recent activity
- Quick access to management pages

**User Management** (`/admin/users`)
- View all users
- Search and filter
- Delete users

**Listings Management** (`/admin/listings`)
- Monitor all listings
- Filter by crop/status
- Delete listings

**Price Management** (`/admin/prices`)
- Update market prices
- See price trends
- Save changes

**Analytics** (`/admin/analytics`)
- View detailed statistics
- Analyze trends
- Monitor performance

## 📱 Navigation

### Desktop
- Use the header profile menu
- Direct URL navigation
- Click dashboard cards

### Mobile
- Bottom navigation bar shows "Admin" icon
- Tap to access admin dashboard
- Swipe through pages

## 🎨 Key Features

### Dashboard Cards
- **Green cards**: User/farmer metrics
- **Brown cards**: Listing/buyer metrics
- **Yellow cards**: Financial metrics
- **All clickable**: Navigate to detailed pages

### Search & Filter
- **Search bar**: Type to search instantly
- **Dropdown filters**: Select role, crop, or status
- **Combined**: Use both for precise results

### Actions
- **View**: Eye icon - see details
- **Delete**: Trash icon - remove item (confirms first)
- **Edit**: Pencil icon - modify data
- **Save**: Disk icon - commit changes

## 🔒 Security Notes

1. **Admin Only**: All routes protected by role check
2. **Token Required**: Must be logged in
3. **Confirmations**: Destructive actions ask for confirmation
4. **Audit Trail**: Actions logged (in future versions)

## 💡 Pro Tips

### User Management
- Use search to quickly find users by name, email, or phone
- Filter by role to see only farmers or buyers
- Delete users carefully - it also deletes their listings

### Listings Management
- Filter by "available" to see active marketplace
- Filter by "sold" to see completed transactions
- Search by location to see regional activity

### Price Management
- Edit multiple prices before saving
- Watch the change preview (shows ₵ and %)
- Previous prices are auto-saved for trend tracking

### Analytics
- Check daily for platform health
- Monitor conversion rate (sold/total listings)
- Track user growth trends
- Identify top locations for marketing

## 🐛 Troubleshooting

**Can't login as admin?**
- Verify role is exactly "admin" in database
- Check password hash is correct
- Ensure email/phone matches exactly

**Dashboard shows no data?**
- Check server is running on port 5000
- Verify MongoDB connection
- Check browser console for errors

**403 Forbidden errors?**
- Confirm user role is "admin"
- Check JWT token is valid
- Try logging out and back in

**Prices won't save?**
- Make sure you edited at least one price
- Check for validation errors
- Verify you have admin permissions

## 📊 Sample Data

For testing, create some sample data:

```javascript
// Sample farmer
db.users.insertOne({
  name: "John Farmer",
  email: "john@farm.com",
  phoneNumber: "+233501111111",
  password: "$2a$10$...",
  role: "farmer",
  location: "Tamale",
  createdAt: new Date()
})

// Sample buyer
db.users.insertOne({
  name: "Jane Buyer",
  email: "jane@buyer.com",
  phoneNumber: "+233502222222",
  password: "$2a$10$...",
  role: "buyer",
  location: "Accra",
  createdAt: new Date()
})

// Sample listing (use actual farmer ID)
db.listings.insertOne({
  farmerId: ObjectId("..."),
  cropType: "maize",
  quantity: 100,
  unit: "bag",
  price: 250,
  location: "Tamale",
  status: "available",
  images: [],
  createdAt: new Date()
})
```

## 🎯 Next Steps

1. **Customize**: Adjust colors/theme if needed
2. **Add Features**: Implement user creation UI
3. **Export Data**: Add CSV/PDF export
4. **Charts**: Integrate chart library for visualizations
5. **Notifications**: Add email alerts for admins
6. **Logs**: Implement activity logging
7. **Permissions**: Create granular permission system

## 📚 Full Documentation

See `ADMIN_DASHBOARD_GUIDE.md` for complete documentation including:
- Detailed feature descriptions
- API endpoint documentation
- File structure
- Design system details
- Future enhancements
- Testing guidelines

## 🆘 Need Help?

1. Check server logs: `server/` terminal
2. Check browser console: F12 → Console
3. Verify database: `mongosh` → `db.users.find()`
4. Review API responses: Network tab in DevTools

---

**Happy Administrating! 🌾**
