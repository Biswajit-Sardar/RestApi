import express from 'express';
import {
  updateProfile,
  changePassword,
  deleteAccount,
  getDashboard,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  updateProfileValidation,
  changePasswordValidation,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboard);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/change-password', changePasswordValidation, changePassword);
router.delete('/account', deleteAccount);

export default router;

