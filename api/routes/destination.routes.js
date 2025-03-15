// routes/destination.routes.js
import express from 'express';
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from '../controllers/destination.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

// Only admin can create, update, and delete destinations.
router.post('/', verifyToken, verifyAdmin, createDestination);
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.put('/:id', verifyToken, verifyAdmin, updateDestination);
router.delete('/:id', verifyToken, verifyAdmin, deleteDestination);

export default router;
