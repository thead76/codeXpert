import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  sendPasswordResetOtp, // <-- IMPORT NEW
  updateUserPassword,   // <-- IMPORT NEW
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes here are protected because of this middleware
router.use(isAuthenticated);

// Routes for profile details
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// --- NEW ROUTES FOR PASSWORD MANAGEMENT ---
router.post('/profile/send-password-otp', sendPasswordResetOtp);
router.put('/profile/update-password', updateUserPassword);

export default router;