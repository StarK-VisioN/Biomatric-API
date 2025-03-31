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
