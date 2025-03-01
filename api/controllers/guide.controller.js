// controllers/guide.controller.js
import User from '../models/user.model.js';
import Booking from '../models/booking.model.js'; // Import Booking model to check active bookings
import { sendGuideAppointmentEmail } from '../utils/emailService.js';

export const createGuide = async (req, res, next) => {
  try {
    // Destructure required fields, including avatar (defaulting to an empty string)
    const { username, name, email, password, phone, avatar = "" } = req.body;

    // Use the provided avatar if not empty; otherwise use the default avatar URL.
    const guideAvatar = avatar.trim() ? avatar : "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: 'Username, name, email, and password are required' });
    }
    
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists' });
    }
    
    // Create a new guide with role "guide"
    const guide = await User.create({
      username,
      name,
      email,
      password, // The password will be hashed by your pre-save hook
      avatar: guideAvatar,
      phone,
      role: 'guide',
    });
    
    return res.status(201).json({ success: true, guide });
  } catch (error) {
    next(error);
  }
};

export const getAllGuides = async (req, res, next) => {
  try {
    // Get all guides with role 'guide'
    const guides = await User.find({ role: 'guide' }).select('username email avatar');
    // Query active bookings to identify guides that are currently assigned
    const activeBookings = await Booking.find({ completed: false, guide: { $ne: null } }).select('guide');
    const assignedGuideIds = activeBookings.map(b => b.guide.toString());

    // Map each guide to include an availability flag
    const guidesWithAvailability = guides.map(guide => ({
      ...guide.toObject(),
      available: !assignedGuideIds.includes(guide._id.toString()),
    }));

    return res.status(200).json({ guides: guidesWithAvailability });
  } catch (error) {
    next(error);
  }
};

export const sendAppointmentEmail = async (req, res, next) => {
  try {
    const { guide } = req.body;
    if (!guide || !guide.email) {
      return res.status(400).json({ message: 'Guide email is required' });
    }
    await sendGuideAppointmentEmail(guide);
    return res.status(200).json({ success: true, message: 'Appointment email sent' });
  } catch (error) {
    next(error);
  }
};
