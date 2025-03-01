import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  console.log("Extracted bookingId:", bookingId);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Compute total amount from booking details if not stored
  const computeTotalAmount = (booking) => {
    if (!booking.travellers || booking.travellers.length === 0) return 0;
    const price = booking.package?.regularPrice
      ? Number(booking.package.regularPrice)
      : 100; // default dummy price
    return booking.travellers.reduce((total, traveller) => {
      const age = Number(traveller.age);
      if (age && age > 0) {
        return total + (age <= 5 ? price / 2 : price);
      }
      return total;
    }, 0);
  };

  // Fetch booking details
  useEffect(() => {
    async function fetchBooking() {
      try {
        console.log(`Fetching booking with ID: ${bookingId}`);
        const res = await fetch(`/api/bookings/${bookingId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("API Response:", data);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch booking details");
        }
        if (data.booking || data._id) {
          setBooking(data.booking || data);
        } else {
          toast.error("No booking details found.");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  // Warn if leaving page without completing payment
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (booking && !booking.paid) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [booking]);

  // Back button with confirmation
  const handleBack = useCallback(() => {
    if (booking && !booking.paid) {
      const confirmLeave = window.confirm(
        "Your payment is not complete. Are you sure you want to go back? Your changes may be lost."
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  }, [booking, navigate]);

  // Generate dummy transaction info
  const generateTransactionInfo = () => {
    const transactionId = "TX-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    const reference = "REF-" + Math.floor(Math.random() * 1000000);
    return { transactionId, reference };
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (paymentMethod === "creditCard") {
        if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
          throw new Error("Please enter valid credit card details.");
        }
      }
      const { transactionId, reference } = generateTransactionInfo();
      const res = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ transactionId, reference }),
      });
      const data = await res.json();
      console.log("Payment API Response:", data);
      if (!res.ok) {
        throw new Error(data.message || "Payment failed. Please try again.");
      }
      setBooking(data.booking);
      toast.success("Payment successful!");
    } catch (err) {
      console.error("Error during payment:", err);
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Download invoice as PDF
  const downloadInvoice = () => {
    if (!booking) return;
    const totalAmount = computeTotalAmount(booking);
    const doc = new jsPDF();
  
    // Header: Blue background with white text (Company Info)
    doc.setFillColor(0, 102, 204); // Blue color
    doc.rect(0, 0, 210, 30, "F"); // Draw filled rectangle for header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Wandersphere", 15, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Head Office: 123 Wander Way, Travel City, San Francisco", 15, 27);
    doc.text("Contact: +1 234 567 890  |  Email: info@wandersphere.com", 15, 33);
  
    // Draw a line below header
    doc.setDrawColor(0, 102, 204);
    doc.line(15, 35, 195, 35);
  
    // Invoice Title and Booking Details
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Invoice", 15, 45);
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPos = 55;
    doc.text(`Booking ID: ${booking._id}`, 15, yPos);
    yPos += 7;
    doc.text(`Package: ${booking.package?.title || "N/A"}`, 15, yPos);
    yPos += 7;
    doc.text(`User: ${booking.user?.username || booking.user?.email}`, 15, yPos);
    yPos += 7;
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleString()}`, 15, yPos);
    yPos += 7;
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 15, yPos);
    yPos += 7;
    doc.text(`Payment Status: Paid`, 15, yPos);
    yPos += 7;
    doc.text(`Transaction ID: ${booking.transactionId || "N/A"}`, 15, yPos);
    yPos += 7;
    doc.text(`Reference: ${booking.reference || "N/A"}`, 15, yPos);
    yPos += 7;
    doc.line(15, yPos, 195, yPos);
    yPos += 7;
  
    // Passenger Details Header
    doc.setFont("helvetica", "bold");
    doc.text("Passenger Details:", 15, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
  
    // Loop through each traveller's details
    booking.travellers.forEach((traveller, index) => {
      doc.text(`Passenger ${index + 1}:`, 15, yPos);
      yPos += 6;
      doc.text(`Name: ${traveller.name}`, 20, yPos);
      yPos += 6;
      doc.text(`Age: ${traveller.age}`, 20, yPos);
      yPos += 6;
      doc.text(`Gender: ${traveller.gender}`, 20, yPos);
      yPos += 6;
      doc.text(`Country: ${traveller.country}`, 20, yPos);
      yPos += 6;
      doc.text(`Contact: ${traveller.contact}`, 20, yPos);
      yPos += 6;
      doc.text(`Email: ${traveller.email}`, 20, yPos);
      yPos += 8;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  
    // Footer: Blue background with centered white text
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 285, 210, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Thank you for choosing Wandersphere. Safe travels!", 105, 293, {
      align: "center",
    });
  
    doc.save(`invoice_${booking._id}.pdf`);
  };
  
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading booking details...</p>
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">No booking found.</p>
      </div>
    );
  }

  const totalAmount = computeTotalAmount(booking);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            &larr; Back
          </button>
          <h1 className="text-3xl font-bold">Payment</h1>
        </div>
        <div className="mb-4 border-b pb-4">
          <p>
            <strong>Booking ID:</strong> {booking._id}
          </p>
          <p>
            <strong>Package:</strong> {booking.package?.title || "N/A"}
          </p>
          <p>
            <strong>User:</strong> {booking.user?.username || booking.user?.email}
          </p>
          <p>
            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            {booking.paid ? "Paid" : "Unpaid"}
          </p>
        </div>
        {!booking.paid ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            >
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="googlePay">Google Pay</option>
              <option value="applePay">Apple Pay</option>
            </select>
            {paymentMethod === "creditCard" && (
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                  className="w-full p-3 border rounded"
                />
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                  }
                  className="w-full p-3 border rounded"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  className="w-full p-3 border rounded"
                />
              </div>
            )}
            {paymentMethod !== "creditCard" && (
              <div className="mb-4 text-center text-gray-600">
                You have selected {paymentMethod}. No extra details required.
              </div>
            )}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
            >
              {processing ? "Processing Payment..." : "Pay Now"}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={downloadInvoice}
              className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition duration-200 mb-4"
            >
              Download Invoice
            </button>
            <p className="text-sm text-gray-600">
              Transaction ID: {booking.transactionId} <br />
              Reference: {booking.reference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
