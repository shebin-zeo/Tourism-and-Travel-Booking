import express from 'express';
import { createListing,getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Correct import

const router = express.Router();

router.post('/create', verifyToken, createListing);
// NEW: GET route for retrieving all listings
router.get('/', verifyToken, getListings);


export default router;
