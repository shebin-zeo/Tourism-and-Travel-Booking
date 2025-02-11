// src/pages/UserBookings.jsx
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export default function UserBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyBookings() {
      try {
        // Get the token (if using cookies, ensure your backend is configured accordingly)
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/bookings/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
          credentials: "include", // If using cookies; otherwise, not needed if using headers.
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch your bookings");
        }
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) {
      fetchMyBookings();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading your bookings...
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        {error}
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center">My Booking History</h1>
      {bookings.length === 0 ? (
        <p className="text-center">You have not made any bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Booking ID</th>
                <th className="px-4 py-2 border">Package</th>
                <th className="px-4 py-2 border">Booking Date</th>
                <th className="px-4 py-2 border">No. of Travellers</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border text-sm">{booking._id}</td>
                  <td className="px-4 py-2 border text-sm">
                    {booking.package && booking.package.title
                      ? booking.package.title
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {new Date(booking.bookingDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-sm">{booking.travellers.length}</td>
                  <td className="px-4 py-2 border text-sm">
                    {booking.approved ? "Approved" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
