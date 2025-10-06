import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    teamInvitation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invitation',
    },
    // --- YEH NAYA FIELD ADD KIYA GAYA HAI ---
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // Yeh Mongoose ko batata hai ki 'Task' model se judna hai
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;