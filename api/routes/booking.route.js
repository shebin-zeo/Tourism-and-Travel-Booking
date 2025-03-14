import express from 'express';
import { 
  createBooking,
  getBookings,
  deleteBooking,
  approveBooking,
  getMyBookings,
  getGuideBookings,
  assignGuideToBooking,
  completeBooking,
  payBooking,
  getBooking,
  cancelBooking
} from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { verifyGuide } from '../utils/verifyGuide.js';

const router = express.Router();

// User routes
router.post('/', verifyToken, createBooking);
router.get('/my', verifyToken, getMyBookings);

// Admin routes
router.get('/', verifyToken, verifyAdmin, getBookings);
router.put('/approve/:id', verifyToken, verifyAdmin, approveBooking);
router.delete('/:id', verifyToken, verifyAdmin, deleteBooking);
router.put('/assign-guide/:bookingId', verifyToken, verifyAdmin, assignGuideToBooking);

// Guide routes
router.get('/guide', verifyGuide, getGuideBookings);
router.put('/complete/:bookingId',  verifyGuide, completeBooking);

// Single booking route (for PaymentPage, etc.)
router.get("/:bookingId", verifyToken, getBooking);

// Payment route to mark booking as paid
router.post("/:bookingId/pay", verifyToken, payBooking);

// User: Cancel booking (only the owner can cancel).
router.put('/cancel/:id', verifyToken, cancelBooking);

export default router;
