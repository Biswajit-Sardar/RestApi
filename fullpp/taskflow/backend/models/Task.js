import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    category: {
      type: String,
      enum: [
        'personal',
        'work',
        'health',
        'education',
        'finance',
        'shopping',
        'other',
      ],
      default: 'personal',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

// Pre-save: Set completedAt when status changes to completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = null;
  }
  next();
});

// Static method: Get task stats for a user
taskSchema.statics.getTaskStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isArchived: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isArchived: false } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  const categoryStats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isArchived: false } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  // Format the results
  const statusMap = {};
  stats.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  const priorityMap = {};
  priorityStats.forEach((s) => {
    priorityMap[s._id] = s.count;
  });

  const categoryMap = {};
  categoryStats.forEach((s) => {
    categoryMap[s._id] = s.count;
  });

  const total =
    (statusMap['pending'] || 0) +
    (statusMap['in-progress'] || 0) +
    (statusMap['completed'] || 0) +
    (statusMap['cancelled'] || 0);

  return {
    total,
    byStatus: {
      pending: statusMap['pending'] || 0,
      inProgress: statusMap['in-progress'] || 0,
      completed: statusMap['completed'] || 0,
      cancelled: statusMap['cancelled'] || 0,
    },
    byPriority: priorityMap,
    byCategory: categoryMap,
    completionRate: total > 0
      ? Math.round(((statusMap['completed'] || 0) / total) * 100)
      : 0,
  };
};

const Task = mongoose.model('Task', taskSchema);

export default Task;

