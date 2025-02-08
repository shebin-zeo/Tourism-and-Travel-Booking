// booking.model.js
import mongoose from 'mongoose';

const travellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  country: { type: String, required: true },
  preferences: { type: String },
  contact: { type: String, required: true },
  email: { type: String, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    package: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Listing', 
      required: true 
    },
    // If you don't require the user, you can set required: false.
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
    travellers: [travellerSchema],
    bookingDate: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
