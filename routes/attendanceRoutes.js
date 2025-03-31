// attendanceRoutes.js - placeholder content
const express = require('express');
const { getAllAttendance, markAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', getAllAttendance);
router.post('/', markAttendance);

module.exports = router;
