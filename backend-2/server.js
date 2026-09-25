const express = require('express');
const {connectDB}= require('./config/db.mongo');

const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use('/api', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT ,'0.0.0.0', () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});