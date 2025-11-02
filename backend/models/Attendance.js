const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  studentName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  busNumber: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

