import Listing from '../models/listing.model.js';
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
// NEW: Function to get all listings
export const getListings = async (req, res, next) => {
  try {
    // You can add sorting or filtering as needed.
    const listings = await Listing.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, listings });
  } catch (error) {
    next(error);
  }
};

// Update a listing by ID
export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedListing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    return res.status(200).json({ success: true, listing: updatedListing });
  } catch (error) {
    next(error);
  }
};

// Delete a listing by ID
export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    return res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    next(error);
  }
};