# Deployment Quick Reference

## 🚀 Quick Commands & Settings

### Backend (Render)

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Root Directory:**
```
server
```

**Environment Variables:**
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/farm-market?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-min-32-characters-long
CLIENT_ORIGIN=https://your-app-name.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Health Check Path:**
```
/api/health
```

---

### Frontend (Vercel)

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
client
```

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

**Environment Variables:**
```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

---

## 📋 Deployment Checklist

### Before Deployment

- [ ] Create MongoDB Atlas cluster
- [ ] Get MongoDB connection string
- [ ] Create Cloudinary account
- [ ] Get Cloudinary credentials
- [ ] Generate strong JWT secret (32+ chars)
- [ ] Push code to GitHub

### Backend Deployment (Render)

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Add all environment variables
- [ ] Set health check path to `/api/health`
- [ ] Deploy and wait for completion
- [ ] Test health endpoint
- [ ] Copy backend URL

### Frontend Deployment (Vercel)

- [ ] Create new project on Vercel
- [ ] Connect GitHub repository
- [ ] Set framework to Vite
- [ ] Set root directory to `client`
- [ ] Add `VITE_API_BASE_URL` environment variable
- [ ] Deploy and wait for completion
- [ ] Copy frontend URL

### Post-Deployment

- [ ] Update `CLIENT_ORIGIN` on Render with Vercel URL
- [ ] Wait for Render to redeploy
- [ ] Create admin user in MongoDB
- [ ] Test login functionality
- [ ] Test API endpoints
- [ ] Verify image uploads work
- [ ] Check admin dashboard

---

## 🔑 Generate JWT Secret

**Using Node.js:**
```javascript
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Online Generator:**
- Visit: https://generate-secret.vercel.app/32

---

## 🗄️ MongoDB Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://farmmarket_admin:MySecurePass123@cluster0.abc123.mongodb.net/farm-market?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your database user
- Replace `<password>` with your database password
- Replace `<cluster-url>` with your cluster URL
- Replace `<database>` with `farm-market`

---

## 👤 Create Admin User

**Hash Password First:**
```javascript
// hash-password.js
import bcrypt from 'bcryptjs';
const hash = bcrypt.hashSync('YourPassword123', 10);
console.log(hash);
```

**Insert into MongoDB:**
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@farmmarket.com",
  phoneNumber: "+233500000000",
  password: "$2a$10$YOUR_HASHED_PASSWORD_HERE",
  role: "admin",
  location: "Tamale",
  profilePicture: "",
  whatsappNumber: "",
  createdAt: new Date()
})
```

---

## 🧪 Test Endpoints

**Backend Health Check:**
```bash
curl https://your-backend.onrender.com/api/health
```

**Expected Response:**
```json
{"status":"ok","service":"farm-market-api"}
```

**Test Login:**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"admin@farmmarket.com","password":"YourPassword123"}'
```

---

## 🔄 Update Deployment

**Vercel:**
- Push to GitHub → Auto-deploys
- Or: Vercel Dashboard → Redeploy

**Render:**
- Push to GitHub → Auto-deploys
- Or: Render Dashboard → Manual Deploy

---

## 🐛 Common Issues & Fixes

### CORS Error
**Problem:** Frontend can't connect to backend
**Fix:** Update `CLIENT_ORIGIN` on Render to match Vercel URL exactly (no trailing slash)

### Database Connection Failed
**Problem:** Backend can't connect to MongoDB
**Fix:** 
- Check MongoDB Atlas IP whitelist (use `0.0.0.0/0`)
- Verify connection string is correct
- Check database user credentials

### 404 on Frontend Routes
**Problem:** Direct URL access returns 404
**Fix:** Ensure `vercel.json` exists in `client/` directory with rewrites

### Images Won't Upload
**Problem:** Profile/listing images fail to upload
**Fix:**
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for errors
- Ensure API keys have upload permissions

### Backend Slow to Respond
**Problem:** First request takes 30-60 seconds
**Fix:** Render free tier spins down after inactivity. Upgrade to paid plan for always-on service.

---

## 💡 Pro Tips

1. **Use Environment-Specific URLs:**
   - Development: `http://localhost:5000/api`
   - Production: `https://your-backend.onrender.com/api`

2. **Monitor Logs:**
   - Render: Real-time logs in dashboard
   - Vercel: Deployment logs and runtime logs

3. **Set Up Alerts:**
   - Render: Email alerts for downtime
   - Vercel: Deployment notifications

4. **Use Custom Domains:**
   - Vercel: Add custom domain in project settings
   - Render: Add custom domain in service settings

5. **Enable Auto-Deploy:**
   - Both platforms support auto-deploy from GitHub
   - Push to `main` branch to deploy automatically

---

## 📞 Support URLs

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Cloudinary Console:** https://cloudinary.com/console

---

**Last Updated:** April 27, 2026
