import Booking from '../models/booking.model.js';
import { sendBookingConfirmation } from '../utils/emailService.js';
import mongoose from 'mongoose';

// GET all bookings (Admin only)
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('package', 'title')
      .populate('user', 'username email')
      .populate('guide', 'username email')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// GET bookings for the currently logged-in user
export const getMyBookings = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User must be logged in to view bookings' });
    }
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package', 'title')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// Create a booking (User must be logged in)
export const createBooking = async (req, res, next) => {
  try {
    const { packageId, travellers, preferredDate } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User must be logged in to create a booking' });
    }
    const booking = await Booking.create({
      package: packageId,
      user: req.user.id,
      travellers,
      bookingDate: preferredDate || Date.now(),
    });
    const populatedBooking = await Booking.findById(booking._id)
      .populate('package', 'title')
      .populate('user', 'username email');


        // Send a booking confirmation email to the user
   
        try {
          await sendBookingConfirmation(populatedBooking.user.email, populatedBooking);
          console.log(`Confirmation email sent to ${populatedBooking.user.email}`);
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Optionally handle the email error (e.g., log it, retry, etc.)
        }
        
    return res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// Delete a booking (Admin only)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Approve a booking (Admin only)
export const approveBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        approved: true,
        approvedAt: new Date(),
      },
      { new: true }
    )
      .populate('package', 'title')
      .populate('user', 'username email')
      .populate('guide', 'username email');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// GET bookings for guide dashboard (only bookings assigned to the guide)
export const getGuideBookings = async (req, res, next) => {
  try {
    const guideId = req.user.id; // Set by verifyGuide middleware
    const bookings = await Booking.find({ guide: guideId })
      .populate('package', 'title')
      .populate('user', 'username email')
      .populate('guide', 'username email')
      .sort({ bookingDate: -1 });
    
    // Compute guide status: "Busy" if any booking is not completed, else "Free"
    const busy = bookings.some((booking) => booking.completed === false);
    const guideStatus = busy ? "Assigned" : "Free";

    return res.status(200).json({ success: true, bookings, guideStatus });
  } catch (error) {
    next(error);
  }
};

// Mark a booking as completed (Guide only)
export const completeBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { completed: true },
      { new: true }
    )
      .populate('package', 'title')
      .populate('user', 'username email')
      .populate('guide', 'username email')
      .exec();
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Optionally: Notify admin here (e.g., log or send an email)
    console.log(`Admin notified: Booking ${bookingId} marked as completed.`);
    return res.status(200).json({ success: true, booking: updatedBooking });
  } catch (error) {
    next(error);
  }
};

// Assign a guide to a booking (Admin only)
export const assignGuideToBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { guide } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { guide },
      { new: true }
    )
      .populate('guide', 'username email')
      .exec();
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ booking: updatedBooking });
  } catch (error) {
    next(error);
  }
};


// GET a single booking by ID (for PaymentPage)
export const getBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    console.log("Received bookingId:", bookingId);
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid Booking ID" });
    }
    const booking = await Booking.findById(bookingId)
      .populate("package", "title regularPrice")
      .populate("user", "username email")
      .populate("guide", "username email");
    if (!booking) {
      console.log("Booking not found in database.");
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log("Booking found:", booking);
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error in getBooking:", error);
    next(error);
  }
};

// Payment endpoint: mark booking as paid and record transaction details
export const payBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { transactionId, reference } = req.body;
    console.log(`Marking booking ${bookingId} as paid. Transaction: ${transactionId}, Reference: ${reference}`);
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paid: true, transactionId, reference },
      { new: true }
    )
      .populate("package", "title regularPrice")
      .populate("user", "username email")
      .populate("guide", "username email");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};
// GET all paid bookings (Payment Reports)
export const getPaymentReports = async (req, res, next) => {
  try {
    const payments = await Booking.find({ paid: true })
      .populate("package", "title regularPrice")
      .populate("user", "username email")
      .populate("guide", "username email")
      .sort({ bookingDate: -1 });
    return res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};