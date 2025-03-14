// api/routes/invoice.route.js
import express from "express";
import { generateRefundInvoice, generateInvoice } from "../controllers/refund.controller.js";
const router = express.Router();

// This route generates an invoice. If refund query parameters are provided, it generates a refund invoice.
router.get("/invoice/:bookingId", async (req, res, next) => {
  if (req.query.refund && req.query.penaltyPercentage) {
    await generateRefundInvoice(req, res, next);
  } else {
    await generateInvoice(req, res, next);
  }
});

export default router;
