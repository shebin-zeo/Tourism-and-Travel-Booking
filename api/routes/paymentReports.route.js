// api/routes/paymentReports.route.js
import express from "express";
import { getPaymentReports } from "../controllers/booking.controller.js"; // Or from admin.controller.js if you prefer
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

// GET all paid bookings (Payment Reports)
// This endpoint returns only paid bookings with populated details.
router.get("/", verifyToken, verifyAdmin, getPaymentReports);

export default router;
