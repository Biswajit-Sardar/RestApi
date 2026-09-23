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