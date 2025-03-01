import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaTimes, FaCheck, FaUserPlus } from 'react-icons/fa';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [availableGuides, setAvailableGuides] = useState([]); // Guides with availability flag
  const [selectedGuideId, setSelectedGuideId] = useState(''); // Selected guide from dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [bookingToAssign, setBookingToAssign] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  // Fetch bookings on mount
  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          credentials: "include",
        });
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server did not return JSON. Please check the backend.');
        }
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
    }
    fetchBookings();
  }, []);

  // Fetch available guides when the assign modal is opened
  useEffect(() => {
    async function fetchGuides() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/guide/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch guides');
        }
        setAvailableGuides(data.guides);
      } catch (err) {
        showNotification(err.message, 'error');
      }
    }
    if (isAssignModalOpen) {
      fetchGuides();
    }
  }, [isAssignModalOpen]);

  const toggleExpanded = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  const handleApprove = async (bookingId) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/bookings/approve/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to approve booking');
      }
      showNotification('Booking approved successfully!', 'success');
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, approved: true } : b
        )
      );
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const openDeleteModal = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setBookingToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/bookings/${bookingToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: "include",
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON on deletion.');
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete booking');
      }
      setBookings(prev => prev.filter(b => b._id !== bookingToDelete));
      showNotification('Booking deleted successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  // Assign Guide functions
  const openAssignModal = (bookingId) => {
    setBookingToAssign(bookingId);
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setBookingToAssign(null);
    setSelectedGuideId('');
    setIsAssignModalOpen(false);
  };

  const handleAssignGuide = async () => {
    if (!bookingToAssign || !selectedGuideId) {
      showNotification("Please select a guide", "error");
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/bookings/assign-guide/${bookingToAssign}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ guide: selectedGuideId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to assign guide');
      }
      showNotification('Guide assigned successfully!', 'success');
      // Update the booking with the assigned guide; assumes data.booking contains updated booking
      setBookings(prev =>
        prev.map(b =>
          b._id === bookingToAssign ? { ...b, guide: data.booking.guide } : b
        )
      );
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      closeAssignModal();
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading bookings...</div>;
  }
  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Manage Bookings
      </h1>
      
      {bookings.length === 0 ? (
        <p className="text-center">No bookings available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-200">
              <tr>
                <th className="px-4 py-2 border">Booking ID</th>
                <th className="px-4 py-2 border">Package</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Booking Date</th>
                <th className="px-4 py-2 border">Travellers</th>
                <th className="px-4 py-2 border">Assigned Guide</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
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
                    {booking.user && (booking.user.username || booking.user.email)
                      ? booking.user.username || booking.user.email
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {new Date(booking.bookingDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-sm">{booking.travellers.length}</td>
                  <td className="px-4 py-2 border text-sm">
                    {booking.guide
                      ? booking.guide.username || booking.guide.email
                      : "Not Assigned"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {booking.completed ? (
                      <span className="text-green-600 font-bold">Trip Over</span>
                    ) : (
                      <span className="text-red-600 font-bold">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    <div className="flex space-x-2">
                      {!booking.approved && (
                        <button
                          onClick={() => handleApprove(booking._id)}
                          className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => toggleExpanded(booking._id)}
                        className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                      >
                        {expandedBookingId === booking._id ? (
                          <>
                            <FaTimes className="mr-1" /> Hide Details
                          </>
                        ) : (
                          <>
                            <FaEdit className="mr-1" /> View Details
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openDeleteModal(booking._id)}
                        className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                      <button
                        onClick={() => openAssignModal(booking._id)}
                        className="flex items-center bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition duration-200"
                      >
                        <FaUserPlus className="mr-1" /> Assign Guide
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                        <span className="font-semibold">Contact:</span> {traveller.contact}{" "}
                        <a href={`tel:${traveller.contact}`} className="text-blue-600 hover:underline ml-2">
                          Call
                        </a>
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span> {traveller.email}{" "}
                        <a href={`mailto:${traveller.email}`} className="text-blue-600 hover:underline ml-2">
                          Email
                        </a>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 flex items-center">
              <FaTrash className="mr-2" /> Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this booking?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 shadow"
                disabled={deleteLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Guide Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
              <FaUserPlus className="mr-2" /> Assign Guide
            </h2>
            <p className="mb-4 text-gray-600">
              Select a guide to assign to this booking:
            </p>
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedGuideId}
              onChange={(e) => setSelectedGuideId(e.target.value)}
            >
              <option value="">-- Select Guide --</option>
              {availableGuides && availableGuides.length > 0 ? (
                availableGuides.map((guide) => (
                  <option key={guide._id} value={guide._id} disabled={!guide.available}>
                    {guide.username} ({guide.email}) {guide.available ? '' : ' - Busy'}
                  </option>
                ))
              ) : (
                <option value="">No guides available</option>
              )}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeAssignModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignGuide}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50">
          <p className={`text-lg ${notification.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {notification.message}
          </p>
        </div>
      )}
    </main>
  );
}
