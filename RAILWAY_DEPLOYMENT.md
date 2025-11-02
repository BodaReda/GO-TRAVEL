# 🚂 Railway Deployment Guide

## Quick Setup Steps for Railway

### Step 1: Deploy Backend Service

1. **Go to Railway Dashboard** → New Project → Add Service
2. **Select "Deploy from GitHub repo"** → Choose your repository
3. **Service Settings:**
   - **Name:** `backend` (or `bus-attendance-api`)
   - **Root Directory:** `backend` ⚠️ **Important!**
   - **Build Command:** (leave empty - Railway auto-detects)
   - **Start Command:** (leave empty - uses `npm start` from package.json)

4. **Environment Variables:**
   - Add these in Railway dashboard:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-connection-string
     JWT_SECRET=your-secret-key
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=admin123
     ```
   - **For MongoDB:** Use MongoDB Atlas (free) connection string
   - Railway will automatically assign a PORT, but you can set it

5. **Deploy!** Railway will:
   - Detect Node.js
   - Run `npm install`
   - Run `npm start` (which runs `node server.js`)
   - Expose the service on a public URL

---

### Step 2: Deploy Frontend Service

1. **In same Railway Project** → Add Service
2. **Select same GitHub repo**
3. **Service Settings:**
   - **Name:** `frontend` (or `bus-attendance-web`)
   - **Root Directory:** `frontend` ⚠️ **Important!**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

4. **Environment Variables:**
   - Add in Railway dashboard:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app
     ```
   - Replace `your-backend-url` with your backend service's Railway URL

5. **Update Frontend API URL:**
   - Update `frontend/vite.config.js` proxy OR
   - Update `frontend/src` files to use `process.env.REACT_APP_API_URL` or the backend URL directly

6. **Deploy!** Railway will:
   - Detect Node.js
   - Run `npm install`
   - Run `npm run build` (creates `dist` folder)
   - Run `npm start` (serves the built files)

---

## 📋 Summary: Root Directories

| Service | Root Directory |
|---------|---------------|
| **Backend** | `backend` |
| **Frontend** | `frontend` |

---

## ✅ Package.json Scripts (Already Configured)

### Backend (`backend/package.json`):
```json
"scripts": {
  "start": "node server.js"
}
```
✅ **Correct!** Railway will use this automatically.

### Frontend (`frontend/package.json`):
```json
"scripts": {
  "build": "vite build",
  "start": "serve -s dist -l 3000"
}
```
✅ **Correct!** Builds with Vite, serves with `serve`.

---

## 🔧 Additional Fixes Needed

### Update Frontend to Use Backend URL

Since frontend won't have proxy in production, update axios base URL:

**Option 1:** Update `frontend/vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // Remove proxy in production
})
```

**Option 2:** Create `frontend/src/config.js`:
```js
export const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend.railway.app';
```

Then update axios calls to use `API_URL`.

---

## 🎯 Railway Dashboard Steps (Visual)

### Backend Deployment:
1. **New Project** → **Add Service** → **GitHub Repo**
2. **Root Directory:** Type `backend`
3. **Variables:** Add MONGODB_URI, JWT_SECRET, etc.
4. **Deploy** → Wait for green checkmark ✅

### Frontend Deployment:
1. **Same Project** → **Add Service** → **GitHub Repo** (same repo)
2. **Root Directory:** Type `frontend`
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
5. **Variables:** Add REACT_APP_API_URL
6. **Deploy** → Wait for green checkmark ✅

---

## 🚨 Common Issues

**Issue:** "Script start.sh not found"
- ✅ **Fixed!** We're using `package.json` scripts only.

**Issue:** "Railpack could not determine how to build"
- ✅ **Fixed!** Root Directory set correctly for both services.

**Issue:** Frontend can't connect to backend
- Set `REACT_APP_API_URL` environment variable
- Update axios calls to use environment variable

---

## 📝 Quick Checklist

- [x] Backend `package.json` has `"start": "node server.js"`
- [x] Frontend `package.json` has `"build": "vite build"` and `"start": "serve -s dist -l 3000"`
- [x] Frontend `package.json` includes `serve` in dependencies
- [ ] Set Root Directory: `backend` for backend service
- [ ] Set Root Directory: `frontend` for frontend service
- [ ] Add environment variables in Railway
- [ ] Update frontend to use backend URL (not proxy)

---

**That's it!** No shell scripts needed. Railway will automatically:
1. Detect Node.js
2. Run `npm install`
3. Run build/start commands from package.json
4. Expose your services on public URLs

