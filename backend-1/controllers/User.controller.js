const userModel = require('../models/User.model');

const getAllUsers = (req, res) => {
    res.json({
        message: 'Get all users'
    });
};

const createUser = (req, res) => {
    res.json({
        message: 'Create a new user'
    });
    
};

const getUserById = (req, res) => {
    const { id } = req.params;

    res.json({
        message: `Get user with ID: ${id}`
    });
};

const updateUserById = (req, res) => {
    const { id } = req.params;

    res.json({
        message: `Update user with ID: ${id}`
    });
};

const deleteUserById = (req, res) => {
    const { id } = req.params;

    res.json({
        message: `Delete user with ID: ${id}`
    });
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
};