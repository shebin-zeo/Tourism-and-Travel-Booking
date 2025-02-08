import express from 'express';
import {
  createListing,
  getListings,
  getListing, // NEW controller for a single listing
  updateListing,
  deleteListing
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Public routes for fetching listings
router.get('/', getListings);
router.get('/:id', getListing);

// Protected routes (require a valid token)
router.post('/create', verifyToken, createListing);
router.put('/:id', verifyToken, updateListing);
router.delete('/:id', verifyToken, deleteListing);

export default router;
 