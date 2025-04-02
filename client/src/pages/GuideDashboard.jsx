import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

export default function GuideDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // We'll use this state for controlling the modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [bookingToView, setBookingToView] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  // Helper to show notifications
  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type: "", visible: false });
    }, 3000);
  };

  // Fetch guide bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/bookings/guide", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.token) {
      fetchBookings();
    }
  }, [currentUser]);

  // Compute guide status: Busy if any booking is not completed, else Free.
  const computedGuideStatus = bookings.some(b => !b.completed) ? "Assigned" : "Free";

  // Mark a booking as completed
  const handleMarkCompleted = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/complete/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to mark booking as completed");
      }
      showNotification("Booking marked as completed!", "success");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, completed: true } : b))
      );
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // Open the view modal for a given booking
  const openViewModal = (booking) => {
    setBookingToView(booking);
    setIsViewModalOpen(true);
  };

  // Close the view modal
  const closeViewModal = () => {
    setBookingToView(null);
    setIsViewModalOpen(false);
  };

  // Toggle the modal view: if already open for the same booking, then close it
  const toggleExpanded = (bookingId) => {
    if (isViewModalOpen && bookingToView && bookingToView._id === bookingId) {
      closeViewModal();
    } else {
      const selected = bookings.find((b) => b._id === bookingId);
      openViewModal(selected);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Guide Dashboard</h1>
      <p className="mb-4">
        Your current status: <span className="font-bold">{computedGuideStatus}</span>
      </p>
      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && bookings.length === 0 && <p>No bookings assigned.</p>}
      {!loading && bookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Package</th>
                <th className="py-2 px-4 border-b">Booking Date</th>
                <th className="py-2 px-4 border-b">Travellers</th>
                <th className="py-2 px-4 border-b">Traveller Names</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {booking.package && booking.package.title
                      ? booking.package.title
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{booking.travellers.length}</td>
                  <td className="py-2 px-4 border-b">
                    {booking.travellers && booking.travellers.length > 0
                      ? booking.travellers.map(t => t.name).join(", ")
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {!booking.completed ? (
                      <button
                        onClick={() => handleMarkCompleted(booking._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                      >
                        Mark as Completed
                      </button>
                    ) : (
                      <span className="text-green-600 font-bold">Completed</span>
                    )}
                    <button
                      onClick={() => toggleExpanded(booking._id)}
                      className="ml-2 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition duration-200"
                    >
                      {isViewModalOpen && bookingToView && bookingToView._id === booking._id
                        ? "Hide Details"
                        : "View Full Details"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && bookingToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <button onClick={closeViewModal} className="text-red-600 hover:text-red-800">
                <FaTimes size={20} />
              </button>
            </div>
            <p>
              <span className="font-semibold">Booking ID:</span> {bookingToView._id}
            </p>
            <p>
              <span className="font-semibold">Package:</span>{" "}
              {bookingToView.package && bookingToView.package.title
                ? bookingToView.package.title
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">User:</span>{" "}
              {bookingToView.user &&
              (bookingToView.user.username || bookingToView.user.email)
                ? bookingToView.user.username || bookingToView.user.email
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Booking Date:</span>{" "}
              {new Date(bookingToView.bookingDate).toLocaleString()}
            </p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Traveller Details:</h3>
            {bookingToView.travellers && bookingToView.travellers.length > 0 ? (
              bookingToView.travellers.map((traveller, index) => (
                <div key={index} className="border p-4 rounded mb-2">
                  <p>
                    <span className="font-semibold">Name:</span> {traveller.name}
                  </p>
                  <p>
                    <span className="font-semibold">Age:</span> {traveller.age}
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span> {traveller.gender}
                  </p>
                  <p>
                    <span className="font-semibold">Country:</span> {traveller.country}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span> {traveller.contact}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {traveller.email}
                  </p>
                </div>
              ))
            ) : (
              <p>No traveller details available.</p>
            )}
            {/* Display User Selected Extra Preferences */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">User Selected Extra Preferences:</h3>
              {bookingToView.selectedPreferences && bookingToView.selectedPreferences.length > 0 ? (
                <ul className="list-disc ml-4 text-gray-700">
                  {bookingToView.selectedPreferences.map((pref, index) => (
                    <li key={index}>{pref}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">None</p>
              )}
            </div>
          </div>
        </div>
      )}

      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50">
          <p className={`text-lg ${notification.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
}
