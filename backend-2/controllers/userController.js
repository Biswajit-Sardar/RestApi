
// controllers/userController.js

const User = require('../models/userModel.js');
const { ensureDatabase } = require('../config/db.mongo.js');

// GET /api/users
const getAllUsers = async (req, res, next) => {
  if (!ensureDatabase(res)) return;

  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive
    } = req.query;

    const filter = {};

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Filter by active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total
      }
    });

  } catch (error) {
    next(error);
  }
};


// POST /api/users
const createUser = async (req, res, next) => {
  if (!ensureDatabase(res)) return;

  try {
    const {
      name,
      email,
      role
    } = req.body;

    const user = new User({
      name,
      email,
      role
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};


// GET /api/users/:id
const getUserById = async (req, res, next) => {
  if (!ensureDatabase(res)) return;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};


// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  if (!ensureDatabase(res)) return;

  try {
    const {
      name,
      email,
      role,
      isActive
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        isActive
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};


// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  if (!ensureDatabase(res)) return;

  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Export all controllers
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};

