// models/destination.model.js
import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
