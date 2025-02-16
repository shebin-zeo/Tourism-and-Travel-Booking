// routes/complaint.route.js
import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from '../controllers/complaint.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

// Only authenticated users can create a complaint.
router.post('/', verifyToken, createComplaint);

// Get complaints for the logged-in user.
router.get('/my', verifyToken, getMyComplaints);

// ADMIN: Get all complaints.
router.get('/', verifyToken, verifyAdmin, getAllComplaints);

// ADMIN: Update a complaint's status.
router.put('/:id', verifyToken, verifyAdmin, updateComplaintStatus);

// ADMIN: Delete a complaint.
router.delete('/:id', verifyToken, verifyAdmin, deleteComplaint);

export default router;
