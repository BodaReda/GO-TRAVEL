# 🚂 Railway Quick Setup - Step by Step

## ✅ Fixed Package.json Files

- ✅ **Backend:** Already has `"start": "node server.js"` 
- ✅ **Frontend:** Fixed to have `"build": "vite build"` and `"start": "serve -s dist -l 3000"`
- ✅ **Frontend:** Added `serve` package to dependencies

---

## 📍 Railway Dashboard Configuration

### 🔵 Backend Service

1. **New Project** → **Add Service** → **GitHub Repo** → Select your repo

2. **Settings Tab:**
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty)
   - **Start Command:** (leave empty - auto uses `npm start`)

3. **Variables Tab:**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-attendance
   JWT_SECRET=your-secret-key-change-this
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Deploy** → Copy the public URL (e.g., `https://backend-production-xxxx.up.railway.app`)

---

### 🟢 Frontend Service

1. **Same Project** → **Add Service** → **GitHub Repo** → Select same repo

2. **Settings Tab:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

3. **Variables Tab:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Replace `your-backend-url` with the backend URL from step 4 above)

4. **Deploy** → Get your frontend URL!

---

## 🎯 Summary Table

| Setting | Backend | Frontend |
|---------|---------|----------|
| **Root Directory** | `backend` | `frontend` |
| **Build Command** | (empty) | `npm run build` |
| **Start Command** | (empty) | `npm start` |
| **Main Script** | `node server.js` | `serve -s dist -l 3000` |

---

## ⚠️ Important Notes

1. **No shell scripts needed** - Railway uses `package.json` scripts automatically
2. **Root Directory is critical** - Must be set correctly or Railway won't find your files
3. **Backend URL** - Frontend needs the backend Railway URL, not localhost
4. **MongoDB** - Use MongoDB Atlas (free tier works perfectly)

---

## 🔧 Update Frontend API Calls

Since Vite proxies don't work in production, update your axios calls:

**In `frontend/src/context/AuthContext.jsx` or wherever you use axios:**

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.get(`${API_URL}/api/health`)
axios.post(`${API_URL}/api/auth/login`, ...)
```

Or create `frontend/src/config.js`:
```js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Then import and use:
```js
import { API_URL } from './config'
axios.get(`${API_URL}/api/...`)
```

---

## ✅ That's It!

No `start.sh` needed. Railway will:
1. Detect Node.js
2. Install dependencies (`npm install`)
3. Build (frontend only: `npm run build`)
4. Start (`npm start`)

Your app will be live! 🎉

