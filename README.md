# 🚌 Smart Bus Attendance System

A complete interactive Bus Attendance Management System for students with QR code scanning, real-time dashboard, and comprehensive reporting features.

## ✨ Features

- **QR Code Scanning**: Real-time attendance marking using camera/webcam
- **Student Management**: Add, edit, and remove students with auto-generated QR codes
- **Dashboard**: Daily attendance overview with filters (date, bus number, class)
- **Export Reports**: Download attendance data in CSV or Excel format
- **Admin Authentication**: Secure login system for bus supervisors
- **Real-time Updates**: Automatic date/time recording for each scan
- **Beautiful UI**: Modern, playful design with smooth animations and confetti effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- html5-qrcode (QR scanning)
- qrcode.react (QR generation)
- React Router
- Axios
- XLSX (Excel export)
- React Confetti

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- JWT Authentication
- bcryptjs

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bus-attendance
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bus-attendance
```

4. Start the backend server:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Getting Started

1. **Login**: Access the system with admin credentials
2. **Add Students**: Go to "Manage Students" and add student information
3. **Generate QR Codes**: QR codes are automatically generated for each student
4. **Scan Attendance**: Use the "Scan QR" page to mark attendance using camera
5. **View Dashboard**: Check daily attendance summaries and statistics
6. **Export Reports**: Download attendance data in CSV or Excel format

## 📱 Features in Detail

### Dashboard
- View attendance summary for any date
- Filter by bus number and class
- See attendance statistics (total, present, absent, percentage)
- Visual progress bar
- Export to Excel or CSV

### QR Scanning
- Real-time camera feed
- Automatic attendance marking
- Confetti celebration on successful scan
- Error handling for duplicate scans
- Pause/Resume functionality

### Student Management
- Add new students with unique Student ID
- Edit student information
- Delete students
- View/Print QR codes
- Display all students in colorful cards

## 🎨 Color Palette

The system uses a vibrant, playful color scheme:
- Primary: `#F9ED69` (Pastel Yellow)
- Secondary: `#F08A5D` (Coral)
- Accent: `#B83B5E` (Pink)
- Dark: `#6A2C70` (Purple)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:studentId` - Get student by ID
- `POST /api/students` - Create student
- `PUT /api/students/:studentId` - Update student
- `DELETE /api/students/:studentId` - Delete student
- `GET /api/students/:studentId/qrcode` - Get QR code

### Attendance
- `GET /api/attendance/summary/:date` - Get daily summary
- `GET /api/attendance/date/:date` - Get attendance by date
- `GET /api/attendance/bus/:busNumber/:date` - Filter by bus
- `GET /api/attendance/class/:className/:date` - Filter by class
- `POST /api/attendance/scan` - Mark attendance via QR scan

### Export
- `GET /api/export/csv/:date` - Export CSV report

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation

## 🌐 Deployment

### Backend (Render/Railway)
1. Connect your repository
2. Set environment variables
3. Deploy (Node.js app)

### Frontend (Vercel)
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### MongoDB Atlas
1. Create a free cluster
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 📝 License

MIT License - Feel free to use this project for your school or organization!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

Made with ❤️ for efficient school bus management

