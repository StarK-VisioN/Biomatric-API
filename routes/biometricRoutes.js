// biometricRoutes.js - placeholder content
const express = require('express');
const { connectToMachine } = require('../controllers/biometricController');

const router = express.Router();

router.get('/connect', (req, res) => {
    connectToMachine();
    res.send('✅ Connecting to biometric machine...');
});

module.exports = router;
