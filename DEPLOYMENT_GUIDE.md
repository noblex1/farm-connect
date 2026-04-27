# Deployment Guide - Vercel (Frontend) + Render (Backend)

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- MongoDB Atlas account (for production database)

## 🗄️ Step 1: Setup MongoDB Atlas (Production Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user:
   - Database Access → Add New Database User
   - Username: `farmmarket_admin`
   - Password: Generate a secure password (save it!)
4. Whitelist all IPs (for Render):
   - Network Access → Add IP Address
   - Enter: `0.0.0.0/0` (allows access from anywhere)
   - Click "Confirm"
5. Get your connection string:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `farm-market`
   - Example: `mongodb+srv://farmmarket_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/farm-market?retryWrites=true&w=majority`

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/farm-marketplace.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `farm-market-api`
- **Region**: Choose closest to your users (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings:**
- **Plan**: Free (or paid for better performance)
- **Health Check Path**: `/api/health`
- **Auto-Deploy**: Yes

5. Click "Advanced" and add Environment Variables:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://farmmarket_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/farm-market?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-random-string
CLIENT_ORIGIN=https://your-app-name.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Important Notes:**
- Generate a strong JWT_SECRET (at least 32 characters, random)
- You'll update CLIENT_ORIGIN after deploying frontend
- Get Cloudinary credentials from https://cloudinary.com/console

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://farm-market-api.onrender.com`

### 2.3 Test Backend

Visit: `https://farm-market-api.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "service": "farm-market-api"
}
```

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

1. Update `client/.env` (create if doesn't exist):

```bash
VITE_API_BASE_URL=https://farm-market-api.onrender.com/api
```

2. Commit the change:

```bash
git add client/.env.example
git commit -m "Add production API URL"
git push
```

### 3.2 Deploy on Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:

**Framework Preset:** Vite

**Root Directory:** `client`

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Environment Variables:**
Add the following:

```bash
VITE_API_BASE_URL=https://farm-market-api.onrender.com/api
```

5. Click "Deploy"
6. Wait for deployment (2-5 minutes)
7. Copy your frontend URL: `https://your-app-name.vercel.app`

### 3.3 Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `CLIENT_ORIGIN` variable:

```bash
CLIENT_ORIGIN=https://your-app-name.vercel.app
```

5. Save changes (service will redeploy automatically)

## 🔐 Step 4: Create Admin User

Since there's no admin registration UI, create an admin user directly in MongoDB:

### Option 1: Using MongoDB Atlas UI

1. Go to MongoDB Atlas → Clusters → Browse Collections
2. Select `farm-market` database → `users` collection
3. Click "Insert Document"
4. Add this document (replace with your details):

```json
{
  "name": "Admin User",
  "email": "admin@farmmarket.com",
  "phoneNumber": "+233500000000",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "location": "Tamale",
  "profilePicture": "",
  "whatsappNumber": "",
  "createdAt": {"$date": "2026-04-27T00:00:00.000Z"}
}
```

### Option 2: Using MongoDB Shell

```bash
# Connect to your database
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/farm-market" --username farmmarket_admin

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@farmmarket.com",
  phoneNumber: "+233500000000",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin",
  location: "Tamale",
  profilePicture: "",
  whatsappNumber: "",
  createdAt: new Date()
})
```

### Generate Password Hash

Use this Node.js script to hash your password:

```javascript
// hash-password.js
import bcrypt from 'bcryptjs';

const password = 'YourSecurePassword123';
const hash = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hash);
```

Run it:
```bash
cd server
node hash-password.js
```

## ✅ Step 5: Verify Deployment

### Test Backend
1. Visit: `https://farm-market-api.onrender.com/api/health`
2. Should return: `{"status":"ok","service":"farm-market-api"}`

### Test Frontend
1. Visit: `https://your-app-name.vercel.app`
2. Should load the landing page
3. Try logging in with admin credentials
4. Should redirect to `/admin` dashboard

### Test API Connection
1. Open browser console (F12)
2. Go to Network tab
3. Login as admin
4. Check API calls go to your Render backend
5. Verify no CORS errors

## 🔧 Environment Variables Reference

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Render uses 10000) | `10000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/farm-market` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `your-super-secret-random-string-here-min-32-chars` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://farm-market-api.onrender.com/api` |

## 🚨 Troubleshooting

### Backend Issues

**Problem**: Service won't start
- **Solution**: Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB URI is correct

**Problem**: Database connection fails
- **Solution**: Check MongoDB Atlas IP whitelist (should be `0.0.0.0/0`)
- Verify database user credentials
- Check connection string format

**Problem**: CORS errors
- **Solution**: Verify `CLIENT_ORIGIN` matches your Vercel URL exactly
- No trailing slash in URL
- Check Render logs for CORS errors

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Check `VITE_API_BASE_URL` is correct
- Verify backend is running (visit health endpoint)
- Check browser console for errors

**Problem**: Build fails on Vercel
- **Solution**: Check build logs
- Verify all dependencies are in `package.json`
- Ensure `client` is set as root directory

**Problem**: Routes return 404
- **Solution**: Verify `vercel.json` is in `client/` directory
- Check rewrite rules are correct

### General Issues

**Problem**: Can't login
- **Solution**: Verify admin user exists in database
- Check password hash is correct
- Verify JWT_SECRET is set on backend

**Problem**: Images won't upload
- **Solution**: Check Cloudinary credentials
- Verify API keys are correct
- Check Cloudinary dashboard for errors

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

**Vercel**: Automatically deploys on push to `main` branch

**Render**: Automatically deploys on push to `main` branch

### Manual Deploy

**Vercel**:
1. Go to project dashboard
2. Click "Deployments"
3. Click "Redeploy" on latest deployment

**Render**:
1. Go to service dashboard
2. Click "Manual Deploy"
3. Select branch and deploy

## 📊 Monitoring

### Render Monitoring
- Dashboard shows CPU, memory, and request metrics
- Logs available in real-time
- Set up alerts for downtime

### Vercel Monitoring
- Analytics dashboard shows page views and performance
- Error tracking in deployment logs
- Speed Insights for performance monitoring

## 💰 Cost Considerations

### Free Tier Limits

**Render Free Tier**:
- 750 hours/month
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 512 MB RAM

**Vercel Free Tier**:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Global CDN

**MongoDB Atlas Free Tier**:
- 512 MB storage
- Shared cluster
- No credit card required

### Upgrade Recommendations

For production with real users:
- **Render**: Upgrade to Starter ($7/month) for always-on service
- **Vercel**: Pro plan ($20/month) for team features
- **MongoDB**: Dedicated cluster ($57/month) for better performance

## 🔐 Security Checklist

- [ ] Strong JWT_SECRET (min 32 characters, random)
- [ ] MongoDB user has strong password
- [ ] Environment variables are not in git
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] Rate limiting is enabled (already configured)
- [ ] Input validation is working (already configured)
- [ ] Admin user password is strong

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 🆘 Support

If you encounter issues:
1. Check service logs (Render/Vercel dashboards)
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB connection
5. Review browser console errors

---

**Deployment Complete! 🎉**

Your farm marketplace is now live and accessible worldwide!
