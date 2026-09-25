const mongoose = require('mongoose');
require('dotenv').config();

const isMongoConfigured = () => {
    return(
        typeof process.env.MONGO_URI !== 'undefined' &&
        process.env.MONGO_URI !== null &&
        process.env.MONGO_URI !== ''
    );
};

const connectDB = async () => {
    if (!isMongoConfigured()) {
        console.warn('Warning: MONGODB_URI is not configured.Starting the API without a database connection.'
        );
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Success: MongoDB connected successfully');
    } catch (error) {
        console.error('Error: Failed to connect to MongoDB.', error);
    }

};
