const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { connectDB } = require('./config/db.mongo');

const errorHandler = require('./middlewares/errorHandler');
const rateLimit = require('./middlewares/rateLimiter');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const healthRoutes = require('./routes/healthRoutes');


const app = express();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4200',
    'http://127.0.0.1:4200',
].filter(Boolean);

app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
    }
}));
    
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/health', healthRoutes);

app.use(errorHandler);
app.use(rateLimit);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
