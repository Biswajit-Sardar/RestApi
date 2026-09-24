const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
const connectDB = require('./config/db.mongo');
require('dotenv').config();

const app = express();

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend API is running successfully',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

const PORT = process.env.PORT || 8000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
});