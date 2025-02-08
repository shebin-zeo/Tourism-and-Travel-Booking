// booking.routes.js
import express from 'express';
import { createBooking, getBookings,deleteBooking } from '../controllers/booking.controller.js'; // For routing the booking related datas
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

// Only authenticated users can create bookings.
router.post('/', verifyToken, createBooking);

// Optionally, only admins can get all bookings.
router.get('/', verifyToken, verifyAdmin, getBookings);
// Admin delete route.
router.delete('/:id', verifyToken, verifyAdmin, deleteBooking);


export default router;
