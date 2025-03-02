import mongoose from 'mongoose';


const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (complainant)
      required: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ['Listing', 'User'], // 'Listing' for packages; 'Guide' for guides
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Use a function to determine which model to use.
      // If targetType is "Guide", return "User" (because guides are stored as users).
      // Otherwise (for Listing), return the value of targetType.
      ref: function () {
        return this.targetType === 'Guide' ? 'User' : this.targetType;
      },
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
