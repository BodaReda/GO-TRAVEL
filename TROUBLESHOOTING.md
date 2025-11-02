# 🔧 Troubleshooting Guide

## What to do if "it still doesn't work"

### Step 1: Check Diagnostic Page
Open: **http://localhost:3000/diagnostics**

This page will show you exactly what's wrong:
- ✅ Backend server status
- ✅ MongoDB connection status  
- ✅ Auth endpoint status
- ✅ Specific error messages

### Step 2: Common Issues & Solutions

#### ❌ "Cannot connect to server" or Network Error

**Problem:** Backend server not running or not reachable

**Solution:**
```powershell
# Check if backend is running
netstat -ano | findstr ":5000"

# If not running, start it:
cd "c:\Users\abdel\go travel\backend"
npm run dev
```

You should see: `Server running on port 5000`

---

#### ❌ "Database not connected" or MongoDB Error

**Problem:** MongoDB is not set up or not running

**Quick Fix (MongoDB Atlas - 5 minutes):**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create M0 cluster (free)
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-attendance
   ```
6. Restart backend server

**See:** `SETUP_MONGODB.md` for detailed instructions

---

#### ❌ Frontend shows blank page or errors

**Problem:** Frontend server not running or build errors

**Solution:**
```powershell
# Check if frontend is running
netstat -ano | findstr ":3000"

# If not running, start it:
cd "c:\Users\abdel\go travel\frontend"
npm run dev
```

You should see: `Local: http://localhost:3000`

---

#### ❌ Login doesn't work

**Problem:** MongoDB not connected OR wrong credentials

**Check:**
1. Open browser console (F12) → Check for errors
2. Try diagnostics page: http://localhost:3000/diagnostics
3. Default credentials:
   - Username: `admin`
   - Password: `admin123`

**If MongoDB error:**
- Setup MongoDB (see above)
- Restart backend server

---

#### ❌ Port already in use

**Problem:** Another application is using port 3000 or 5000

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr ":5000"
netstat -ano | findstr ":3000"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# OR change ports in:
# backend/.env (PORT=5001)
# frontend/vite.config.js (port: 3001)
```

---

### Step 3: Verify Everything

1. **Backend running?**
   - Visit: http://localhost:5000/api/health
   - Should see: `{"status":"OK","message":"Server is running"}`

2. **Frontend running?**
   - Visit: http://localhost:3000
   - Should see login page

3. **MongoDB connected?**
   - Check backend console
   - Should see: `✅ MongoDB Connected Successfully`

4. **Login working?**
   - Username: `admin`
   - Password: `admin123`

---

### Step 4: Check Console Logs

**Backend Console:**
- Look for: `Server running on port 5000`
- Look for: `✅ MongoDB Connected Successfully` OR `❌ MongoDB connection error`
- Any red error messages?

**Frontend Console (Browser F12):**
- Network tab → Check API calls
- Console tab → Any red errors?
- Check what happens when you click "Login"

---

### Step 5: Full Reset (Last Resort)

```powershell
# Stop everything
Stop-Process -Name node -Force

# Clear and reinstall (if needed)
cd "c:\Users\abdel\go travel\backend"
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
npm install

cd "c:\Users\abdel\go travel\frontend"
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
npm install

# Start servers
cd "c:\Users\abdel\go travel\backend"
npm run dev

# New terminal:
cd "c:\Users\abdel\go travel\frontend"
npm run dev
```

---

## 🆘 Still Need Help?

**What specific error message do you see?**
1. Take a screenshot
2. Check browser console (F12)
3. Check backend console
4. Visit diagnostics page: http://localhost:3000/diagnostics

The diagnostics page will tell you exactly what's wrong!

