# Quick Setup Guide

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+) installed
- MongoDB running locally OR MongoDB Atlas account
- Git

### 2. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 3. Configure Backend

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bus-attendance
JWT_SECRET=your-secret-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-attendance
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

## 📝 First Steps

1. **Login** with admin credentials
2. **Add Students** - Go to "Manage Students" and add student information
3. **View QR Codes** - QR codes are automatically generated for each student
4. **Scan Attendance** - Use the "Scan QR" page to mark attendance
5. **View Dashboard** - Check attendance summaries and statistics

## 🔧 Troubleshooting

### Camera Not Working
- Ensure browser permissions allow camera access
- Try HTTPS (required for camera on some browsers)
- Use Chrome or Firefox for best compatibility

### MongoDB Connection Issues
- Verify MongoDB is running (if local)
- Check connection string in `.env`
- For Atlas, ensure IP whitelist includes your IP

### Port Already in Use
- Change PORT in backend `.env`
- Update proxy in `frontend/vite.config.js`

## 📦 Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## 🌐 Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy

### MongoDB Atlas
1. Create free cluster
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

