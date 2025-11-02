const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const QRCode = require('qrcode');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ studentId: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student by ID
router.get('/:studentId', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const { studentId, name, className, busNumber } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const student = new Student({
      studentId,
      name,
      className,
      busNumber
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Student ID already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Update student
router.put('/:studentId', async (req, res) => {
  try {
    const { name, className, busNumber } = req.body;
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.studentId },
      { name, className, busNumber },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student
router.delete('/:studentId', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Also delete attendance records
    await Attendance.deleteMany({ studentId: req.params.studentId });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate QR code data URL
router.get('/:studentId/qrcode', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const qrDataURL = await QRCode.toDataURL(student.studentId, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1
    });

    res.json({ qrCode: qrDataURL, studentId: student.studentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

