import Booking from '../models/booking.model.js';

// GET all bookings (Admin only)
export const getBookings = async (req, res, next) => {
  try {
    // Populate the package field with its title and the user field with username and email.
    const bookings = await Booking.find({})
      .populate('package', 'title')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// GET bookings for the currently logged-in user.
export const getMyBookings = async (req, res, next) => {
  try {
    // Make sure req.user is set by your verifyToken middleware.
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User must be logged in to view bookings' });
    }
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package', 'title')  // Show the package title
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// Create a booking (User must be logged in)
export const createBooking = async (req, res, next) => {
  try {
    const { packageId, travellers } = req.body;
    
    // Make sure the user is logged in.
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User must be logged in to create a booking' });
    }

    const booking = await Booking.create({
      package: packageId,
      user: req.user.id,  // Use the user attached to the request by your auth middleware.
      travellers,
    });

    // Populate the created booking for the response.
    const populatedBooking = await Booking.findById(booking._id)
      .populate('package', 'title')
      .populate('user', 'username email');

    return res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

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
      .populate('user', 'username email');
      
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};
