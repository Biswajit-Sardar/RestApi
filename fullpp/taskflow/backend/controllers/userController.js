import User from '../models/User.js';
import Task from '../models/Task.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    // Delete all user's tasks
    await Task.deleteMany({ user: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    // Clear cookie
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const stats = await Task.getTaskStats(req.user.id);

    // Get recent tasks
    const recentTasks = await Task.find({ user: req.user.id, isArchived: false })
      .sort('-createdAt')
      .limit(5);

    // Get upcoming due tasks
    const upcomingTasks = await Task.find({
      user: req.user.id,
      isArchived: false,
      dueDate: { $gte: new Date() },
      status: { $ne: 'completed' },
    })
      .sort('dueDate')
      .limit(5);

    // Get overdue tasks
    const overdueTasks = await Task.find({
      user: req.user.id,
      isArchived: false,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] },
    })
      .sort('dueDate')
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        user: user.toPublicJSON(),
        stats,
        recentTasks,
        upcomingTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

