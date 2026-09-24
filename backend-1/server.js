const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

const PORT=8000;
app.listen(PORT,()=>{
    console.log(`Server is running on port https://localhost:${PORT}`);
});

app.get('/api/health',(req,res)=>{
    res.json({
        status:'ok',
        message:'Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database:mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });

    
});