import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      required: true, // Example: "Adventure", "Luxury", "Family"
    },
    duration: {
      type: Number,
      required: true, // Duration in days
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    accommodations: {
      type: Boolean,
      required: true, // Whether stay is included
    },
    transport: {
      type: Boolean,
      required: true, // Whether transport is included
    },
    itinerary: {
      type: Array,
      required: true, // List of activities or places covered
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    adminRef: {
      type: String,
      required: false, //Currently set optional. Reference to the admin who created the listing
    },
    guideRef: {
      type: String,
      required: false, // Optional: Reference to assigned guide
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
