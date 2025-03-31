// Attendance.js - placeholder content
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
