import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function GuideDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  // Helper to show notifications
  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  // Fetch guide bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/bookings/guide', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
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

  // Compute guide status: if any booking is not completed then Busy, else Free.
  const computedGuideStatus = bookings.some(b => !b.completed) ? "Assigned" : "Free";

  // Mark a booking as completed
  const handleMarkCompleted = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/complete/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to mark booking as completed');
      }
      showNotification('Booking marked as completed!', 'success');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, completed: true } : b
        )
      );
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Toggle expanded details for a booking
  const toggleExpanded = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
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
                    {booking.package && booking.package.title ? booking.package.title : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{booking.travellers.length}</td>
                  <td className="py-2 px-4 border-b">
                    {booking.travellers && booking.travellers.length > 0
                      ? booking.travellers.map(t => t.name).join(', ')
                      : 'N/A'}
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
                      {expandedBookingId === booking._id ? "Hide Details" : "View Full Details"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Expanded Booking Details */}
      {expandedBookingId && (
        <div className="mt-6 bg-gray-50 p-6 rounded shadow-md">
          {bookings
            .filter(b => b._id === expandedBookingId)
            .map(booking => (
              <div key={booking._id}>
                <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                <p>
                  <span className="font-semibold">Booking ID:</span> {booking._id}
                </p>
                <p>
                  <span className="font-semibold">Package:</span>{" "}
                  {booking.package && booking.package.title ? booking.package.title : 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">User:</span>{" "}
                  {booking.user && (booking.user.username || booking.user.email)
                    ? booking.user.username || booking.user.email
                    : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Booking Date:</span>{" "}
                  {new Date(booking.bookingDate).toLocaleString()}
                </p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Traveller Details:</h3>
                {booking.travellers && booking.travellers.length > 0 ? (
                  booking.travellers.map((traveller, index) => (
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
                      <p>
                        <span className="font-semibold">Preferences:</span> {traveller.preferences || 'None'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No traveller details available.</p>
                )}
              </div>
            ))}
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
