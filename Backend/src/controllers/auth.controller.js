import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import jwt from 'jsonwebtoken';
// --- 1. IMPORT RESEND ---
import { Resend } from 'resend';

// --- 2. INITIALIZE RESEND WITH YOUR API KEY ---
const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- Controllers ---

/**
 * @desc    Send OTP for new user signup
 * @route   POST /api/v1/auth/send-otp
 * @access  Public
 */
export const sendOtpForSignup = async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    // --- 3. SEND OTP USING RESEND ---
    await resend.emails.send({
      from: 'OTP Verification <noreply@codexpert.online>', // Must be from your verified domain
      to: email,
      subject: 'Your OTP for CodeXpert Signup',
      html: `<p>Welcome to CodeXpert! Your One-Time Password is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: 'OTP sent successfully to your email.' });

  } catch (error) {
    console.error('Error in sendOtpForSignup:', error);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
};


/**
 * @desc    Verify OTP and register a new user
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
export const verifyOtpAndRegister = async (req, res) => {
    const { name, email, password, otp, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
        }

        const user = await User.create({ name, email, password, role });

        await OTP.deleteOne({ _id: otpRecord._id });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        console.error('Error in verifyOtpAndRegister:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Invalid user data: ${messages.join(', ')}` });
        }
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
};

/**
 * @desc    Google OAuth callback
 * @route   GET /api/v1/auth/google/callback
 * @access  Public
 */
export const googleAuthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect to your frontend, passing the token
  res.redirect(`https://codexpert.online/auth/callback?token=${token}`);
};

/**
 * @desc    Send OTP for password reset
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const sendPasswordResetOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.updateOne({ email }, { otp }, { upsert: true });

        // --- 4. SEND PASSWORD RESET OTP USING RESEND ---
        await resend.emails.send({
            from: 'Password Reset <noreply@codexpert.online>', // Must be from your verified domain
            to: email,
            subject: 'Your Password Reset OTP for CodeXpert',
            html: `<p>Your One-Time Password for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
        });

        res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });
    } catch (error) {
        console.error('Error in sendPasswordResetOtp:', error);
        res.status(500).json({ message: "Error sending OTP." });
    }
};

/**
 * @desc    Reset password using a valid OTP
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPasswordWithOtp = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.password = password;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error('Error in resetPasswordWithOtp:', error);
        res.status(500).json({ message: "Error resetting password." });
    }
};