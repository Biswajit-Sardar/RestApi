const User = require('../models/userModel');

const {ensureDatabase}= require('../config/db.mongo');


// GET /api/users
const getAllUsers = async (req, res ,next) => {};
// POST /api/users
const createUser = async (req, res ,next) => {};
// GET /api/users/:id
const getUserById = async (req, res ,next) => {};
// PUT /api/users/:id
const updateUserById = async (req, res ,next) => {};
// DELETE /api/users/:id
const deleteUserById = async (req, res ,next) => {};



module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
};