# Quick Fix Guide - Common Errors

## 🔴 Error: "Database not connected" or "MongoDB connection required"

**Solution:** You need to set up MongoDB. Choose one:

### Option 1: MongoDB Atlas (Cloud - Free & Easy) ⭐ Recommended

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)
3. Create a **FREE M0 cluster** (takes 3-5 minutes)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string
6. Open `backend/.env` and update:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bus-attendance?retryWrites=true&w=majority
   ```
7. Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials
8. Restart the backend server

### Option 2: Install MongoDB Locally

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service (usually automatic)
4. Your `.env` file should already be correct:
   ```
   MONGODB_URI=mongodb://localhost:27017/bus-attendance
   ```
5. Restart the backend server

---

## 🔴 Error: "Cannot connect to server" or Network Error

**Solution:** Make sure both servers are running:

1. **Backend Server:**
   ```powershell
   cd backend
   npm run dev
   ```
   Should see: `Server running on port 5000`

2. **Frontend Server:**
   ```powershell
   cd frontend
   npm run dev
   ```
   Should see: `Local: http://localhost:3000`

---

## 🔴 Error: Login doesn't work

**Check:**
1. MongoDB is connected (backend console shows "✅ MongoDB Connected")
2. Default admin is created (check backend console)
3. Using correct credentials:
   - Username: `admin`
   - Password: `admin123`

If MongoDB is not connected, you'll see a clear error message now.

---

## ✅ Verify Everything Works

1. **Backend Health Check:**
   Open: http://localhost:5000/api/health
   Should show: `{"status":"OK","message":"Server is running"}`

2. **Frontend:**
   Open: http://localhost:3000
   Should show login page

3. **Login:**
   - Username: `admin`
   - Password: `admin123`

---

## 🆘 Still Having Issues?

1. Check backend console for error messages
2. Check browser console (F12) for frontend errors
3. Make sure ports 3000 and 5000 are not used by other applications
4. Restart both servers

---

## 📝 Quick Restart Commands

**Stop all servers:**
```powershell
Stop-Process -Name node -Force
```

**Start Backend:**
```powershell
cd "c:\Users\abdel\go travel\backend"
npm run dev
```

**Start Frontend (new terminal):**
```powershell
cd "c:\Users\abdel\go travel\frontend"
npm run dev
```

