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