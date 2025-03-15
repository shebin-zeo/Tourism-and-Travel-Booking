// controllers/destination.controller.js
import Destination from '../models/destination.model.js';

// Create a new destination
export const createDestination = async (req, res, next) => {
  try {
    const { name, description, imageUrls } = req.body;
    const destination = await Destination.create({ name, description, imageUrls });
    return res.status(201).json({ success: true, destination });
  } catch (error) {
    next(error);
  }
};

// Get all destinations
export const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, destinations });
  } catch (error) {
    next(error);
  }
};

// Get a single destination by ID
export const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    return res.status(200).json({ success: true, destination });
  } catch (error) {
    next(error);
  }
};

// Update a destination
export const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedDestination = await Destination.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDestination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    return res.status(200).json({ success: true, destination: updatedDestination });
  } catch (error) {
    next(error);
  }
};

// Delete a destination
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    return res.status(200).json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    next(error);
  }
};
