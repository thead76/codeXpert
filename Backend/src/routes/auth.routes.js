import express from 'express';
import passport from 'passport';
import {
  sendOtpForSignup,       
  verifyOtpAndRegister,   
  loginUser,
  googleAuthCallback,
  sendPasswordResetOtp, // <-- Import new
  resetPasswordWithOtp, // <-- Import new
} from '../controllers/auth.controller.js';

const router = express.Router();

// Replace the old '/register' with two new routes
router.post('/send-otp', sendOtpForSignup);
router.post('/verify-otp', verifyOtpAndRegister);

// Keep the existing routes
router.post('/login', loginUser);

// --- NEW ---
router.post('/forgot-password', sendPasswordResetOtp);
router.post('/reset-password', resetPasswordWithOtp);


router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5174/login-failed',
    session: false,
  }),
  googleAuthCallback
);

export default router;