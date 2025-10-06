import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  sendPasswordResetOtp, // <-- This name must match exactly
  updateUserPassword,   // <-- This name must match exactly
  deleteUserProfile,
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getAllUsers);

router
  .route('/profile')
  .get(isAuthenticated, getUserProfile)
  .put(isAuthenticated, updateUserProfile)
  .delete(isAuthenticated, deleteUserProfile);

router.post('/profile/send-password-otp', isAuthenticated, sendPasswordResetOtp);
router.put('/profile/update-password', isAuthenticated, updateUserPassword);

export default router;