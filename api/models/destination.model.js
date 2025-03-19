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
    videoUrl: {
      type: String, // Optional video URL for rich media content
    },
  },
  { timestamps: true }
);

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
