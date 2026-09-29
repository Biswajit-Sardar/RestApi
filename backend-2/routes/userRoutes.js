// routes/userRoutes.js

const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController.js');


// GET all users
// GET /api/users
router.get('/', userController.getAllUsers);


// Create new user
// POST /api/users
router.post('/', userController.createUser);


// Get user by ID
// GET /api/users/:id
router.get('/:id', userController.getUserById);


// Update user
// PUT /api/users/:id
router.put('/:id', userController.updateUser);


// Delete user
// DELETE /api/users/:id
router.delete('/:id', userController.deleteUser);


module.exports = router;

