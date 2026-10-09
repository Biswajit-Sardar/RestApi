import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  toggleArchive,
  bulkUpdateStatus,
  bulkDelete,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTaskValidation,
  updateTaskValidation,
  validateMongoId,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', getTaskStats);

// Bulk operations
router.patch('/bulk/status', bulkUpdateStatus);
router.delete('/bulk/delete', bulkDelete);

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTaskValidation, createTask);

router.route('/:id')
  .get(validateMongoId, getTask)
  .put(validateMongoId, updateTaskValidation, updateTask)
  .delete(validateMongoId, deleteTask);

// Archive route
router.patch('/:id/archive', validateMongoId, toggleArchive);

export default router;

