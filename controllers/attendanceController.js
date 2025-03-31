// attendanceController.js - placeholder content
const Attendance = require('../models/Attendance');

const getAllAttendance = async (req, res) => {
    const attendance = await Attendance.find();
    res.json(attendance);
};

const markAttendance = async (req, res) => {
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.json(newAttendance);
};

module.exports = { getAllAttendance, markAttendance };
