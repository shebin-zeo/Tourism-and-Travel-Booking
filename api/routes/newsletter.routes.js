import express from 'express';
import { sendNewsletterEmails } from '../controllers/newsletter.controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/',verifyToken,verifyAdmin, sendNewsletterEmails);
export default router;
