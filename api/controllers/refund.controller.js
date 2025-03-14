import PDFDocument from "pdfkit";
import path from "path";
import Booking from "../models/booking.model.js";

export const generateRefundInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    // For refund and penalty, still allow query parameters if provided
    let { refund, penaltyPercentage } = req.query;
    
    // Fetch the booking from the database.
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Use booking's dates: bookingDate for invoice date, cancelledAt for cancellation date.
    const invoiceDate = booking.bookingDate 
      ? new Date(booking.bookingDate).toLocaleString() 
      : new Date().toLocaleString();
    const cancellationDate = booking.cancelledAt 
      ? new Date(booking.cancelledAt).toLocaleString() 
      : new Date().toLocaleString();

    // Use query values for refund and penalty if provided and valid; otherwise fallback to booking values.
    refund =
      refund && refund !== "undefined"
        ? refund
        : booking.refundAmount;
    penaltyPercentage =
      penaltyPercentage && penaltyPercentage !== "undefined"
        ? penaltyPercentage
        : booking.penaltyPercentage;

    // Force use of booking's stored values for transaction details.
    const transactionId = booking.transactionId ? booking.transactionId : "N/A";
    const reference = booking.reference ? booking.reference : "N/A";

    // Create a new PDF document.
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Set response headers for file download.
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=refund_invoice_${bookingId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Optional: Add your company logo.
    // const logoPath = path.join(__dirname, "../assets/logo.png");
    // doc.image(logoPath, 50, 45, { width: 100 });

    // Header: Title and horizontal separator.
    doc.fontSize(24)
      .fillColor("#333")
      .text("Refund Invoice", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, 100).lineTo(550, 100).stroke("#aaa");

    // Invoice metadata.
    doc.fontSize(10)
      .fillColor("#000")
      .text(`Invoice Date (Booking Time): ${invoiceDate}`, 50, 110)
      .text(`Booking ID: ${bookingId}`, 50, 125)
      .text(`Cancellation Date: ${cancellationDate}`, 50, 140)
      .text(`Refund Amount: $${refund}`, 50, 155)
      .text(`Cancellation Penalty: ${penaltyPercentage}%`, 50, 170)
      .text(`Transaction ID: ${transactionId}`, 50, 185)
      .text(`Payment Reference: ${reference}`, 50, 200);

    doc.moveDown(2);

    // Footer: Thank you note and support info.
    doc.fontSize(14)
      .fillColor("#555")
      .text("Thank you for choosing our travel services!", { align: "center" });
    doc.moveDown();
    doc.fontSize(10)
      .fillColor("#888")
      .text("For any inquiries, please contact our customer support.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error in generateRefundInvoice:", error);
    next(error);
  }
};

export const generateInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    // Ignore query parameters for transaction details and use stored values.
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const invoiceDate = booking.bookingDate 
      ? new Date(booking.bookingDate).toLocaleString() 
      : new Date().toLocaleString();
    const transactionId = booking.transactionId ? booking.transactionId : "N/A";
    const reference = booking.reference ? booking.reference : "N/A";

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${bookingId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Optional: Add your company logo.
    // const logoPath = path.join(__dirname, "../assets/logo.png");
    // doc.image(logoPath, 50, 45, { width: 100 });

    // Header.
    doc.fontSize(24)
      .fillColor("#333")
      .text("Invoice", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, 100).lineTo(550, 100).stroke("#aaa");

    // Invoice details.
    doc.fontSize(10)
      .fillColor("#000")
      .text(`Invoice Date (Booking Time): ${invoiceDate}`, 50, 110)
      .text(`Booking ID: ${bookingId}`, 50, 125)
      .text(`Transaction ID: ${transactionId}`, 50, 140)
      .text(`Payment Reference: ${reference}`, 50, 155);
    doc.moveDown();
    doc.fontSize(12)
      .fillColor("#000")
      .text("Payment Status: Paid", { align: "left" });
    doc.moveDown(2);

    // Footer.
    doc.fontSize(14)
      .fillColor("#555")
      .text("Thank you for your business!", { align: "center" });
    doc.moveDown();
    doc.fontSize(10)
      .fillColor("#888")
      .text("For any questions regarding this invoice, please contact our support.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error in generateInvoice:", error);
    next(error);
  }
};
