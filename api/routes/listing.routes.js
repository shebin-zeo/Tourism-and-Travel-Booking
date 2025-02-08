import express from 'express';
import { createListing,
    getListings,
    updateListing,
    deleteListing } 
    from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Correct import

const router = express.Router();

router.post('/create', verifyToken, createListing);
// NEW: GET route for retrieving all listings
router.get('/', verifyToken, getListings);

// Update a listing by its ID
router.put('/:id', verifyToken, updateListing);

// Delete a listing by its ID
router.delete('/:id', verifyToken, deleteListing);


export default router;
