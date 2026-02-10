const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

/* ✅ CORS MUST BE HERE */
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://alumni-react-app.vercel.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to College Alumni Automation System API' });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
