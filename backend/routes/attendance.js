const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Get attendance by date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendance = await Attendance.find({ date }).sort({ checkInTime: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by bus number and date
router.get('/bus/:busNumber/:date', async (req, res) => {
  try {
    const { busNumber, date } = req.params;
    const attendance = await Attendance.find({ busNumber, date }).sort({ checkInTime: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by class and date
router.get('/class/:className/:date', async (req, res) => {
  try {
    const { className, date } = req.params;
    const attendance = await Attendance.find({ className, date }).sort({ checkInTime: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all attendance records with filters
router.get('/', async (req, res) => {
  try {
    const { date, busNumber, className } = req.query;
    const query = {};
    
    if (date) query.date = date;
    if (busNumber) query.busNumber = busNumber;
    if (className) query.className = className;

    const attendance = await Attendance.find(query).sort({ date: -1, checkInTime: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance by scanning QR code
router.post('/scan', async (req, res) => {
  try {
    const { studentId, date } = req.body;
    
    // Find student
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if attendance already marked for today
    const existingAttendance = await Attendance.findOne({ studentId, date });
    if (existingAttendance) {
      return res.status(400).json({ 
        message: 'Attendance already marked for this student today',
        attendance: existingAttendance
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      studentId: student.studentId,
      studentName: student.name,
      className: student.className,
      busNumber: student.busNumber,
      date: date || new Date().toISOString().split('T')[0],
      status: 'Present'
    });

    const savedAttendance = await attendance.save();
    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: savedAttendance
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Attendance already marked for this student today' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Get daily summary with all students and their attendance status
router.get('/summary/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Get all students
    const allStudents = await Student.find().sort({ busNumber: 1, name: 1 });
    
    // Get attendance for the date
    const attendanceRecords = await Attendance.find({ date });
    
    // Create a map of studentId to attendance
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      attendanceMap.set(record.studentId, record);
    });

    // Create summary with all students
    const summary = allStudents.map(student => {
      const attendance = attendanceMap.get(student.studentId);
      return {
        studentId: student.studentId,
        name: student.name,
        className: student.className,
        busNumber: student.busNumber,
        status: attendance ? attendance.status : 'Absent',
        checkInTime: attendance ? attendance.checkInTime : null,
        date: date
      };
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

