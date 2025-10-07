import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    // --- YEH SECTION THEEK KIYA GAYA HAI ---
    status: {
      type: String,
      enum: ['Pending', 'To Do', 'In Progress', 'Under Review', 'Completed'],
      default: 'Pending', // Default status ab 'Pending' hai
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    reviewNotes: {
        type: String,
        trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;