const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

//security Headers & Logging
app.use(helmet());
if(process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}


// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS policy'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);


//Body Parser & Rate Limiter
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Root API Welcome / Directory
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the REST API with Authentication & RBAC Authorization',
    endpoints: {
      health: '/api/health',
      version: '/api/version',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Bearer Token required)',
        updateDetails: 'PUT /api/auth/updatedetails (Bearer Token required)',
        updatePassword: 'PUT /api/auth/updatepassword (Bearer Token required)',
      },
      users: {
        getAll: 'GET /api/users (Admin only)',
        create: 'POST /api/users (Admin only)',
        getById: 'GET /api/users/:id (Admin only)',
        update: 'PUT /api/users/:id (Admin only)',
        delete: 'DELETE /api/users/:id (Admin only)',
      },
      products: {
        getAll: 'GET /api/products (Public)',
        getById: 'GET /api/products/:id (Public)',
        create: 'POST /api/products (Admin / Moderator only)',
        update: 'PUT /api/products/:id (Admin / Moderator only)',
        delete: 'DELETE /api/products/:id (Admin only)',
      },
    },
  });
});
