import User from '../models/user.model.js';
import OTP from '../models/otp.model.js'; // We'll reuse the OTP model
import nodemailer from 'nodemailer';

// Nodemailer setup (assuming it's configured in your auth.controller.js)
// You might want to move this to a separate utility file later
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// @desc    Get current user's profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile details (name, phone, etc.)
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.githubId = req.body.githubId || user.githubId;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- NEW FUNCTION: Send OTP for password reset ---
// @desc    Send password reset OTP to logged-in user's email
// @route   POST /api/v1/users/profile/send-password-otp
// @access  Private
export const sendPasswordResetOtp = async (req, res) => {
    const user = req.user; // User is attached from isAuthenticated middleware
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({ email: user.email, otp });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your Password Reset OTP for CodeXpert',
            text: `Your One-Time Password for resetting your password is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully to your email.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP.' });
    }
};

// --- NEW FUNCTION: Update password ---
// @desc    Update user password using old password or OTP
// @route   PUT /api/v1/users/profile/update-password
// @access  Private
export const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword, otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Scenario 1: User provides an OTP
    if (otp) {
        const otpRecord = await OTP.findOne({ email: user.email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
        await OTP.deleteOne({ email: user.email, otp }); // OTP is used, so delete it
    } 
    // Scenario 2: User provides their old password
    else if (oldPassword) {
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }
    } 
    // Scenario 3: Neither OTP nor old password provided
    else {
        return res.status(400).json({ message: 'Old password or OTP is required.' });
    }

    // If verification is successful, update the password
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
};