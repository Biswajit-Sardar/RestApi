import Task from '../models/Task.js';

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    // Build query
    const queryObj = { user: req.user.id };

    // Filter by status
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      queryObj.priority = req.query.priority;
    }

    // Filter by category
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Filter archived
    if (req.query.archived === 'true') {
      queryObj.isArchived = true;
    } else {
      queryObj.isArchived = false;
    }

    // Search by title
    if (req.query.search) {
      queryObj.title = { $regex: req.query.search, $options: 'i' };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sort
    let sortBy = '-createdAt'; // Default: newest first
    if (req.query.sort) {
      const sortFields = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'due-date': 'dueDate',
        priority: '-priority',
        title: 'title',
      };
      sortBy = sortFields[req.query.sort] || '-createdAt';
    }

    // Execute query
    const tasks = await Task.find(queryObj)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Task.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    // Add user to body
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    // Only allow task fields to be updated; never allow ownership or system fields
    // such as user, isArchived, or completedAt to be changed through this endpoint.
    const allowedFields = [
      'title',
      'description',
      'status',
      'priority',
      'category',
      'dueDate',
      'tags',
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]])
    );

    Object.assign(task, updates);
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.getTaskStats(req.user.id);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task archive status
// @route   PATCH /api/tasks/:id/archive
// @access  Private
export const toggleArchive = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    task.isArchived = !task.isArchived;
    await task.save();

    res.status(200).json({
      success: true,
      message: task.isArchived ? 'Task archived' : 'Task unarchived',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update task status
// @route   PATCH /api/tasks/bulk/status
// @access  Private
export const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task IDs',
      });
    }

    const result = await Task.updateMany(
      { _id: { $in: taskIds }, user: req.user.id },
      { status },
      { runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks updated`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete tasks
// @route   DELETE /api/tasks/bulk/delete
// @access  Private
export const bulkDelete = async (req, res, next) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task IDs',
      });
    }

    const result = await Task.deleteMany({
      _id: { $in: taskIds },
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} tasks deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

