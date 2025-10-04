import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // This will automatically delete the OTP after 10 minutes
    expires: 600, 
  },
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;