// routes/guide.routes.js
import express from 'express';
import { createGuide,getAllGuides } from '../controllers/guide.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // This middleware should verify JWT and attach req.user
import { verifyAdmin} from '../utils/verifyAdmin.js'; // Checks if req.user.role is "admin"

const router = express.Router();

router.post('/create', verifyToken, verifyAdmin, createGuide);
// GET /api/guide/all - returns a list of guides (only accessible to admin)
router.get('/all', verifyToken, verifyAdmin, getAllGuides);

export default router;
