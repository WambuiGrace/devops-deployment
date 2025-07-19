const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',                //Local development
    'https://pixel-pulse-five.vercel.app/'  //Production 
];

app.use(
    cors({
        origin: (origin, cb) => {
            //Allow Postman/Curl which send no origin
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        },
        credentials: true,
        methods: 'GET, POST, PUT, DELETE',
        allowedHeaders: 'content-Type, Authorization',
    }));
app.use(express.json());


// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/upload', require('./routes/upload'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
})
.catch((error) => {
    console.log('MongoDB connection error:', error.message);
    process.exit(1);
});