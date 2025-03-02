// controllers/complaint.controller.js
import Complaint from '../models/complaint.model.js';

// Create a complaint (User must be logged in)
export const createComplaint = async (req, res, next) => {
  try {
    let { targetType, target, message } = req.body;
    // Use req.user._id if available (set by your verifyToken middleware)
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
      return res.status(401).json({ message: 'User must be logged in to file a complaint' });
    }
    // If the complaint is for a guide, change targetType to "User"
    if (targetType === "Guide") {
      targetType = "User";
    }
    const complaint = await Complaint.create({
      user: userId,
      targetType, // Now either "Listing" or "User"
      target,     // ID of the package or guide (as a User)
      message,
    });
    return res.status(201).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// Get complaints for the logged-in user.
export const getMyComplaints = async (req, res, next) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
      return res.status(401).json({ message: 'User must be logged in to view complaints' });
    }
    const complaints = await Complaint.find({ user: userId })
      // Populate both Listing fields (title) and User fields (name, fullName, username)
      .populate('target', 'title name fullName username')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, complaints });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all complaints.
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({})
      .populate('user', 'username email')
      .populate('target', 'title name fullName username') // include extra fields
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, complaints });
  } catch (error) {
    next(error);
  }
};


// ADMIN: Update a complaint's status (e.g., mark as resolved).
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expected status: "pending" or "resolved"
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('user', 'username email')
      .populate('target', 'title name');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete a complaint.
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.status(200).json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};
