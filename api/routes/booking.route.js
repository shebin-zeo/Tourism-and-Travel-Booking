// routes/booking.route.js
import express from 'express';
import { createBooking, getBookings, deleteBooking, approveBooking,getMyBookings } from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

// Only authenticated users can create bookings.
router.post('/', verifyToken, createBooking);
// User endpoint to get their own bookings.
router.get('/my', verifyToken, getMyBookings);


// Only admins can get, approve, or delete bookings.
router.get('/', verifyToken, verifyAdmin, getBookings);
router.put('/approve/:id', verifyToken, verifyAdmin, approveBooking);
router.delete('/:id', verifyToken, verifyAdmin, deleteBooking);


export default router;
