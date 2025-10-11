import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// --- Setup --- (No changes here)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- Controllers ---

// No changes to sendOtpForSignup, loginUser, googleAuthCallback, etc.
// ... (keep the other functions as they are)

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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for CodeXpert Signup',
      text: `Welcome to CodeXpert! Your One-Time Password is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);

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
        // This check is good, it prevents trying to create a duplicate user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
        }

        // The user creation was failing silently here
        const user = await User.create({ name, email, password, role });

        // Clean up the OTP record after successful registration
        await OTP.deleteOne({ _id: otpRecord._id });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // also include role in the response
                token: generateToken(user._id),
            });
        } else {
            // This case is unlikely if create doesn't throw, but good to have
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        // --- THIS IS THE FIX ---
        // Add specific handling for validation errors from Mongoose
        console.error('Error in verifyOtpAndRegister:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Invalid user data: ${messages.join(', ')}` });
        }
        // Fallback for any other unexpected errors
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
  res.redirect(`http://codexpert.online/auth/callback?token=${token}`);
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
            // To prevent email enumeration, send a generic success message even if the user doesn't exist.
            return res.status(200).json({ message: "If a user with this email exists, an OTP has been sent." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Use updateOne with upsert to avoid creating duplicate OTPs for the same user.
        await OTP.updateOne({ email }, { otp }, { upsert: true });


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset OTP for CodeXpert",
            text: `Your One-Time Password for password reset is: ${otp}. It will expire in 10 minutes.`,
        };
        await transporter.sendMail(mailOptions);

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
            // Should not happen if OTP is valid, but as a safeguard.
            return res.status(404).json({ message: "User not found." });
        }

        user.password = password;
        await user.save();

        // Clean up the OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.error('Error in resetPasswordWithOtp:', error);
        res.status(500).json({ message: "Error resetting password." });
    }
};
