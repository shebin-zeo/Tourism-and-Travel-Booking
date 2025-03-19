// routes/destination.routes.js
import express from 'express';
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
  getEditorsChoiceDestinations,
} from '../controllers/destination.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

// Editor's Choice endpoint (publicly accessible)
router.get('/editor-choice', getEditorsChoiceDestinations);

// Existing endpoints:
router.post('/', verifyToken, verifyAdmin, createDestination);
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.put('/:id', verifyToken, verifyAdmin, updateDestination);
router.delete('/:id', verifyToken, verifyAdmin, deleteDestination);

export default router;
