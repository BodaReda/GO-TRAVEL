const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Export attendance to CSV
router.get('/csv/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { busNumber, className } = req.query;

    const query = { date };
    if (busNumber) query.busNumber = busNumber;
    if (className) query.className = className;

    const attendance = await Attendance.find(query).sort({ busNumber: 1, className: 1, name: 1 });

    // Generate CSV
    let csv = 'Student ID,Name,Class,Bus Number,Status,Check-in Time\n';
    attendance.forEach(record => {
      const time = record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A';
      csv += `${record.studentId},"${record.studentName}",${record.className},${record.busNumber},${record.status},${time}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${date}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

