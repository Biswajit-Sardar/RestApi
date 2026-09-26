// routes/userRoutes.js

const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController.js');


// GET all users
// GET /api/users
router.get('/users', userController.getAllUsers);


// Create new user
// POST /api/users
router.post('/users', userController.createUser);


// Get user by ID
// GET /api/users/:id
router.get('/users/:id', userController.getUserById);


// Update user
// PUT /api/users/:id
router.put('/users/:id', userController.updateUser);


// Delete user
// DELETE /api/users/:id
router.delete('/users/:id', userController.deleteUser);


module.exports = router;

