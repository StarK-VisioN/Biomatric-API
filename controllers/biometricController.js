// biometricController.js - placeholder content
const net = require('net');
const Attendance = require('../models/Attendance');

const MACHINE_IP = '192.168.1.201';
const PORT = 4370;

const client = new net.Socket();

const connectToMachine = () => {
    client.connect(PORT, MACHINE_IP, () => {
        console.log(`✅ Connected to machine at ${MACHINE_IP}:${PORT}`);
        const command = Buffer.from([0x01, 0x00, 0x00, 0x00]);
        client.write(command);
    });

    client.on('data', async (data) => {
        console.log('📥 Received encrypted data:', data);

        const decryptedData = decryptData(data);
        await saveToMongoDB(decryptedData);
        client.destroy();
    });

    client.on('error', (error) => {
        console.error('❌ Error:', error);
    });

    client.on('close', () => {
        console.log('⚠️ Connection closed');
    });
};

const decryptData = (data) => {
    const encodedData = data.toString('base64');
    const decrypted = Buffer.from(encodedData, 'base64').toString('utf-8');

    const logs = [];
    const records = decrypted.split('\n');

    records.forEach((record) => {
        const [employeeId, timestamp, status] = record.split(',');

        logs.push({
            employeeId: employeeId.trim(),
            timestamp: new Date(timestamp.trim()),
            status: status.trim() === '1' ? 'Present' : 'Absent'
        });
    });

    return logs;
};

const saveToMongoDB = async (logs) => {
    for (const log of logs) {
        const newRecord = new Attendance({
            employeeId: log.employeeId,
            timestamp: log.timestamp,
            status: log.status
        });
        await newRecord.save();
        console.log(`✅ Stored in MongoDB: ${log.employeeId}`);
    }
};

module.exports = { connectToMachine };


/*

const net = require('net');
const Attendance = require('../models/Attendance');

// Connect to the biometric machine
const MACHINE_IP = process.env.MACHINE_IP;       // Biometric machine IP  
const MACHINE_PORT = process.env.MACHINE_PORT;   // Biometric machine Port  

const connectToMachine = (req, res) => {
    const client = new net.Socket();

    client.connect(MACHINE_PORT, MACHINE_IP, () => {
        console.log(`✅ Connected to biometric machine at ${MACHINE_IP}:${MACHINE_PORT}`);

        // 🛠️ Send numeric command to get attendance records
        const command = Buffer.from([0x50, 0x00, 0x00, 0x00]);  // Custom numeric command
        client.write(command);
    });

    client.on('data', async (data) => {
        console.log('✅ Data received from machine:', data);

        // 🛠️ Parse the binary response into readable JSON format
        const records = parseAttendanceData(data);

        // ✅ Store records in MongoDB
        for (const record of records) {
            const newAttendance = new Attendance({
                employeeId: record.employeeId,
                timestamp: record.timestamp,
                status: record.status
            });

            await newAttendance.save();
            console.log(`✅ Saved: ${JSON.stringify(record)}`);
        }

        res.json({ message: 'Attendance records fetched and saved' });

        client.destroy();  // Close the connection
    });

    client.on('error', (err) => {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: 'Failed to connect to machine' });
    });
};

// 🛠️ Function to parse binary attendance data into JSON
const parseAttendanceData = (data) => {
    const records = [];

    // Sample binary format parsing (adjust according to your machine's format)
    for (let i = 0; i < data.length; i += 8) {
        const employeeId = data.readUInt16BE(i);         // First 2 bytes: Employee ID
        const timestamp = new Date();                    // Use the current time (replace if needed)
        const status = (data[i + 2] === 1) ? 'Present' : 'Absent';  // Attendance status

        records.push({ employeeId, timestamp, status });
    }

    return records;
};

module.exports = { connectToMachine };







Add the route to trigger the API and connect to the machine:

const express = require('express');
const router = express.Router();
const { connectToMachine } = require('../controllers/biometricController');

// Route to connect to biometric machine and fetch attendance
router.post('/connect', connectToMachine);

module.exports = router;


*/
