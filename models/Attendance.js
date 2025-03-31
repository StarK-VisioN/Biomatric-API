// Attendance.js - placeholder content
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);



/*

Updated MongoDB Schema
Ensure your MongoDB schema can store the parsed attendance data properly:

✅ /models/Attendance.js:

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;




*/