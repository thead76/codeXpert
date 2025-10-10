import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const sendOtpForSignup = async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // --- DEBUG LOG 1 ---
    // console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);

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
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  const { name, email, password, otp, role } = req.body; 
  try {
    // --- DEBUG LOG 2 ---
    // console.log(`[DEBUG] Attempting to verify OTP for ${email}.`);
    // console.log(`[DEBUG]   - OTP from user: ${otp}`);
    // console.log(`[DEBUG]   - Role from user: ${role}`);

    const otpRecord = await OTP.findOne({ email, otp });

    // --- DEBUG LOG 3 ---
    if (!otpRecord) {
    //   console.log(`[DEBUG] OTP record NOT FOUND in database for email: ${email} and OTP: ${otp}`);
      // Let's also check if a record for the email exists at all
      const anyOtpForEmail = await OTP.findOne({ email });
      if (anyOtpForEmail) {
          // console.log(`[DEBUG] Found a different OTP for this email: ${anyOtpForEmail.otp}`);
      } else {
          console.log(`[DEBUG] No OTP record found for this email address at all.`);
      }
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // --- DEBUG LOG 4 ---
    console.log(`[DEBUG] OTP record FOUND in database. Proceeding with user creation.`);
    
    const user = await User.create({ name, email, password, role });
    
    await OTP.deleteOne({ email, otp });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
};

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
    res.status(500).json({ message: error.message });
  }
};

export const googleAuthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`https://codexpert-khaki.vercel.app/?token=${token}`);
};

// --- NEW ---
export const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP for CodeXpert",
      text: `Your One-Time Password for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP." });
  }
};

// --- NEW ---
export const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = password;
    await user.save();

    await OTP.deleteOne({ email, otp });

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password." });
  }
};