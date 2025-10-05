import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  sendPasswordResetOtp,
  updateUserPassword,
  deleteUserProfile, // Account deletion ke liye import
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Is file ke sabhi routes protected hain
router.use(isAuthenticated);

// Profile details ke liye routes (GET, PUT, DELETE)
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserProfile); // Account deletion ke liye DELETE route

// Password management ke liye naye routes
router.post('/profile/send-password-otp', sendPasswordResetOtp);
router.put('/profile/update-password', updateUserPassword);

export default router;

