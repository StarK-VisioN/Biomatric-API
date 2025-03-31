const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const biometricRoutes = require('./routes/biometricRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const Attendance = require('./models/Attendance');  // Import the model

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  

// ✅ Route for the homepage that displays attendance data
app.get('/', async (req, res) => {
    try {
        const attendance = await Attendance.find();  // Fetch attendance from MongoDB
        res.render('index', { attendance });        // Pass data to EJS
    } catch (error) {
        console.error('❌ Error fetching attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API Routes
app.use('/api/biometric', biometricRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
