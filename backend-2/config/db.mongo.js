const mongoose = require('mongoose');
require('dotenv').config();

const isMongoConfigured = () => {
    return(
        typeof process.env.MONGODB_URI !== 'undefined' &&
        process.env.MONGODB_URI !== null &&
        process.env.MONGODB_URI !== ''
    );
};

const connectDB = async () => {
    if (!isMongoConfigured()) {
        console.warn('Warning: MONGODB_URI is not configured.Starting the API without a database connection.'
        );
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Success: MongoDB connected successfully');
    } catch (error) {
        console.error('Error: Failed to connect to MongoDB.', error);
    }

};


const ensureDatabase = (res)=> {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({
            success: false,
            error: 'Database is not configured or unavailable. Add a valid MONGODB_URI to enable data operations.',
        });
        return false;
    }
    return true;
};
module.exports = {
    connectDB,
    ensureDatabase,
    isMongoConfigured,
};

