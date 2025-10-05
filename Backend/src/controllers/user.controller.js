import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import nodemailer from 'nodemailer';

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Get current user's profile
export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile details
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.githubId = req.body.githubId || user.githubId;
    user.role = req.body.role || user.role;
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Send password reset OTP
export const sendPasswordResetOtp = async (req, res) => {
    const user = req.user;
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

// @desc    Update user password
export const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword, otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    if (otp) {
        const otpRecord = await OTP.findOne({ email: user.email, otp });
        if (!otpRecord) return res.status(400).json({ message: 'Invalid OTP.' });
        await OTP.deleteOne({ email: user.email, otp });
    } 
    else if (oldPassword) {
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect old password.' });
    } 
    else {
        return res.status(400).json({ message: 'Old password or OTP is required.' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
};

// --- FIX: MISSING DELETE FUNCTION ADDED ---
// @desc    Delete user profile
// @route   DELETE /api/v1/users/profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User account deleted successfully.' });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Server error while deleting account.' });
    }
};

