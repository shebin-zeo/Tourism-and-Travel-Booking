// models/booking.model.js
import mongoose from "mongoose";

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
      ref: "Listing",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // Change to true to require a user for every booking.
    },
    travellers: [travellerSchema],
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
