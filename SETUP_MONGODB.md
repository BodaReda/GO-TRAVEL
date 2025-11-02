# MongoDB Setup Guide

## 🔴 Issue: MongoDB Not Running

The application requires MongoDB to store data. Here are your options:

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB (use default settings)
3. MongoDB will run as a Windows service automatically
4. Verify it's running: Open Command Prompt and type `mongod --version`

### Start MongoDB (if not running automatically):
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it
Start-Service -Name MongoDB
```

## Option 2: Use MongoDB Atlas (Free Cloud - Easiest!)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account (M0 cluster - Free Forever)
3. Create a cluster (takes ~5 minutes)
4. Click "Connect" → Choose "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/bus-attendance?retryWrites=true&w=majority
```

**Important:** Replace `your-username` and `your-password` with your MongoDB Atlas credentials!

## Option 3: Use Docker (if you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## ✅ Verify MongoDB is Running

After setup, the backend server will show:
- ✅ MongoDB Connected Successfully

If you see:
- ❌ MongoDB connection error

Check:
1. MongoDB service is running (for local installation)
2. Connection string in `.env` is correct (for Atlas)
3. Network/firewall is not blocking the connection

## 🚀 Quick Start with MongoDB Atlas (Recommended)

1. Sign up at https://www.mongodb.com/cloud/atlas (free)
2. Create cluster → Wait 3-5 minutes
3. Create database user (Database Access)
4. Add IP to whitelist (0.0.0.0/0 for all, or your specific IP)
5. Get connection string
6. Update `backend/.env` with the connection string
7. Restart backend server

The application will work immediately once MongoDB is connected!

