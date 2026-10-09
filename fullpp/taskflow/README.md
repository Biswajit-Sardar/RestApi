# TaskFlow

A full-stack task management application built from the supplied MERN tutorial specification.

## Stack
- MongoDB Atlas
- Express.js
- React + Vite
- Node.js
- JWT authentication
- Mongoose
- Axios

## Features
- User registration/login/logout
- JWT protected routes
- Task CRUD
- Status, priority, category, search, sorting, pagination
- Archive and bulk task operations
- Dashboard statistics
- Profile and password management
- Responsive UI

## Setup

### 1. Backend
```bash
cd backend
npm install
```

Copy/update `backend/.env` with your MongoDB Atlas connection string and a strong JWT secret.

Start:
```bash
npm run dev
```

### 2. Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### 3. Optional demo data
```bash
cd backend
npm run seed
```
Demo login: `demo@taskflow.com` / `demo123`

To destroy seeded data:
```bash
node seeder.js -d
```

## Production build
```bash
cd frontend
npm run build
npm run preview
```

## API health check
`GET http://localhost:5000/api/health`

See the supplied tutorial for MongoDB Atlas setup, endpoint examples, and deployment guidance.
