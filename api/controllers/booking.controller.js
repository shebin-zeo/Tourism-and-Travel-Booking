// booking.controller.js
import Booking from '../models/booking.model.js';

export const createBooking = async (req, res, next) => {
  try {
    // Destructure packageId and travellers from the request body.
    const { packageId, travellers } = req.body;
    
    // Optionally, if you are using authentication middleware,
    // get the user ID from req.user. (This example uses verifyToken.)
    const userId = req.user ? req.user._id : undefined;
    
    // Create the booking document with the travellers array.
    const booking = await Booking.create({
      package: packageId,
      user: userId, // may be undefined if not logged in (since required is false)
      travellers,   // Use the travellers array from the request body.
    });

    return res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('package')
      .populate('user')
      .sort({ createdAt: -1 });
      
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// In booking.controller.js (backend)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res
      .status(200)
      .json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

