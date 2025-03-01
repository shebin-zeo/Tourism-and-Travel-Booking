// client/src/pages/PaymentReports.jsx
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Import autoTable explicitly
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentReports() {
  const [bookings, setBookings] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define financial years (adjust as needed)
  const financialYears = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022", "2020-2021"];

  // Helper: compute total amount for a booking
  const computeTotalAmount = (booking) => {
    if (!booking.travellers || booking.travellers.length === 0) return 0;
    const price = booking.package?.regularPrice ? Number(booking.package.regularPrice) : 100;
    return booking.travellers.reduce((total, traveller) => {
      const age = Number(traveller.age);
      if (age && age > 0) {
        return total + (age <= 5 ? price / 2 : price);
      }
      return total;
    }, 0);
  };

  // Overall total amount collected for filtered payments
  const totalCollected = filteredPayments.reduce(
    (sum, payment) => sum + computeTotalAmount(payment),
    0
  );

  // Fetch paid bookings from the dedicated PaymentReport endpoint
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/PaymentReport", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.payments) {
          setBookings(data.payments);
        } else {
          toast.error(data.message || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Filter bookings by selected financial year (assume financial year: April 1 to March 31)
  useEffect(() => {
    if (!selectedYear) {
      setFilteredPayments([]);
      return;
    }
    const [startYear, endYear] = selectedYear.split("-");
    const startDate = new Date(Number(startYear), 3, 1);
    const endDate = new Date(Number(endYear), 2, 31, 23, 59, 59);
    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= startDate && bookingDate <= endDate;
    });
    setFilteredPayments(filtered);
  }, [selectedYear, bookings]);

  // Generate a professional PDF report using jsPDF and autoTable
  const generateReport = () => {
    try {
      const doc = new jsPDF();

      // Header: Blue rectangle with centered white text
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, 210, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Wandersphere Financial Report", 105, 15, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Head Office: 123 Wander Way, Travel City, San Fransisco", 105, 22, { align: "center" });
      doc.text("Contact: +1 234 567 890  |  Email: info@wandersphere.com", 105, 27, { align: "center" });

      // Summary Section
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`Financial Report: ${selectedYear}`, 15, 40);
      doc.setFontSize(12);
      const totalBookings = filteredPayments.length;
      doc.text(`Total Bookings: ${totalBookings}`, 15, 50);
      doc.text(`Total Amount Collected: $${totalCollected.toFixed(2)}`, 15, 58);

      // Prepare table data for autoTable
      const tableColumn = ["Booking ID", "User", "Amount", "Transaction", "Date"];
      const tableRows = filteredPayments.map((payment) => {
        const amount = computeTotalAmount(payment);
        return [
          payment._id,
          payment.user?.username || payment.user?.email || "",
          `$${amount.toFixed(2)}`,
          payment.transactionId || "",
          new Date(payment.bookingDate).toLocaleDateString(),
        ];
      });

      // Use autoTable to generate the table
      autoTable(doc, {
        startY: 65,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [0, 102, 204] },
      });

      // Footer: Blue rectangle with centered white text
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 285, 210, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Wandersphere - Financial Report", 105, 293, { align: "center" });

      doc.save(`Financial_Report_${selectedYear}.pdf`);
    } catch (err) {
      console.error("Error generating report:", err);
      toast.error("Error generating PDF report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading payment reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Payment Reports</h1>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Select Financial Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="">-- Select Year --</option>
            {financialYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {selectedYear && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Payments for {selectedYear}
            </h2>
            <div className="mb-4">
              <p className="text-lg">
                <strong>Total Bookings:</strong> {filteredPayments.length}
              </p>
              <p className="text-lg">
                <strong>Total Amount Collected:</strong> ${totalCollected.toFixed(2)}
              </p>
            </div>
            {filteredPayments.length === 0 ? (
              <p className="text-gray-600">
                No payments found for this financial year.
              </p>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">Booking ID</th>
                    <th className="py-2 px-4 border">User</th>
                    <th className="py-2 px-4 border">Amount</th>
                    <th className="py-2 px-4 border">Transaction ID</th>
                    <th className="py-2 px-4 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="py-2 px-4 border">{payment._id}</td>
                      <td className="py-2 px-4 border">
                        {payment.user?.username || payment.user?.email}
                      </td>
                      <td className="py-2 px-4 border">
                        ${computeTotalAmount(payment).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border">{payment.transactionId}</td>
                      <td className="py-2 px-4 border">
                        {new Date(payment.bookingDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {filteredPayments.length > 0 && (
              <button
                onClick={generateReport}
                className="mt-4 w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
              >
                Generate PDF Report
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
