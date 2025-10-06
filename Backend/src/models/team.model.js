import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a reference to a User document
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // An array of references to User documents
      },
    ],
    // We can add projects later
    // projects: [...] 
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;