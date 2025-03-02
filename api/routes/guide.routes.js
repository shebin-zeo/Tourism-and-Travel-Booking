// routes/guide.routes.js
import express from 'express';
import { createGuide,getAllGuides,sendAppointmentEmail,getGuides } from '../controllers/guide.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // This middleware should verify JWT and attach req.user
import { verifyAdmin} from '../utils/verifyAdmin.js'; // Checks if req.user.role is "admin"

const router = express.Router();

router.post('/create', verifyToken, verifyAdmin, createGuide);
// GET /api/guide/all - returns a list of guides (only accessible to admin)
router.get('/all', verifyToken, verifyAdmin, getAllGuides);
// New endpoint to send appointment email
router.post('/appointment-email', verifyToken, verifyAdmin, sendAppointmentEmail);
// GET /api/guides - Public endpoint for fetching guides (for complaint form)
router.get('/', getGuides);

export default router;
