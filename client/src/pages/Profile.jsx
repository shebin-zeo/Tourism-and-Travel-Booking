import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  FaTicketAlt,
  FaBoxOpen,
  FaUserAlt,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaTrashAlt,
} from "react-icons/fa";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Tab state: "profile", "bookings", "complaints"
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state.
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Bookings state.
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  // Complaint form state.
  const [complaintForm, setComplaintForm] = useState({
    targetType: "Listing", // "Listing" for Package; "Guide" for Guide.
    target: "",
    message: "",
  });
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintError, setComplaintError] = useState("");
  const [complaints, setComplaints] = useState([]);

  // State for showing delete account confirmation modal.
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for cancellation confirmation modal.
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Animation variants for profile photo.
  const profilePhotoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  // Initialize profile form when currentUser changes.
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
      });
    }
  }, [currentUser]);

  // Fetch bookings when "bookings" or "complaints" tab is active.
  useEffect(() => {
    if ((activeTab === "bookings" || activeTab === "complaints") && currentUser) {
      async function fetchMyBookings() {
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch("/api/bookings/my", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch bookings");
          }
          setBookings(data.bookings);
        } catch (err) {
          setBookingsError(err.message);
          toast.error(err.message);
        } finally {
          setBookingsLoading(false);
        }
      }
      fetchMyBookings();
    }
  }, [activeTab, currentUser]);

  // Fetch complaints when "complaints" tab is active.
  useEffect(() => {
    if (activeTab === "complaints" && currentUser) {
      async function fetchMyComplaints() {
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch("/api/complaints/my", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch complaints");
          }
          setComplaints(data.complaints);
        } catch (err) {
          setComplaintError(err.message);
          toast.error(err.message);
        }
      }
      fetchMyComplaints();
    }
  }, [activeTab, currentUser]);

  // For Guide complaints, derive guide options from the user's bookings.
  const myGuideOptions = useMemo(() => {
    return bookings
      .filter((booking) => booking.guide)
      .reduce((acc, booking) => {
        const guide = booking.guide;
        if (guide && !acc.find((g) => g._id === guide._id)) {
          acc.push(guide);
        }
        return acc;
      }, []);
  }, [bookings]);

  // Handle profile form changes.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle profile update submission.
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFormData({ ...formData, password: "" });
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Handle complaint form changes.
  const handleComplaintChange = (e) => {
    setComplaintForm({ ...complaintForm, [e.target.name]: e.target.value });
  };

  // Handle complaint submission.
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setComplaintLoading(true);
    setComplaintError("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(complaintForm),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Complaint submission failed");
      }
      toast.success("Complaint registered successfully!", { autoClose: 3000 });
      setComplaintForm({ targetType: "Listing", target: "", message: "" });
    } catch (err) {
      setComplaintError(err.message);
      toast.error(err.message);
    } finally {
      setComplaintLoading(false);
    }
  };

  // Handle sign out.
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // Handle delete user (account deletion).
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted successfully!");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  // Open cancellation modal for a selected booking.
  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  // Handle cancellation confirmation.
  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/bookings/cancel/${bookingToCancel._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Cancellation failed");
      }
      // Update bookings state with cancellation details.
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingToCancel._id
            ? {
                ...b,
                cancelled: true,
                refundAmount: data.refund,
                penaltyPercentage: data.penaltyPercentage,
                transactionId: data.transactionId,
                reference: data.reference,
              }
            : b
        )
      );
      toast.success(
        `Booking cancelled. Refund: $${data.refund} (Penalty: ${data.penaltyPercentage}%)`
      );
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (err) {
      toast.error(err.message);
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  // Professional cancellation modal with animation.
  const CancelModal = () => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Confirm Cancellation
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to cancel this booking? Note: If cancelled after
          48 hours, you will receive no refund; if cancelled between 24 and 48 hours, a 20% fee applies.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleConfirmCancel}
            className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200 shadow"
          >
            Yes, Cancel Booking
          </button>
          <button
            onClick={() => {
              setShowCancelModal(false);
              setBookingToCancel(null);
            }}
            className="w-full flex items-center justify-center bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200 shadow"
          >
            Keep Booking
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 border rounded ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 border rounded ${
            activeTab === "bookings"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2 border rounded ${
            activeTab === "complaints"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Register Complaint
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          <motion.div
            variants={profilePhotoVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <img
              src={
                currentUser?.avatar ||
                "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
              }
              alt="Profile"
              className="rounded-full h-24 w-24 object-cover mb-4"
            />
          </motion.div>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="border p-3 rounded-lg"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="border p-3 rounded-lg"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="border p-3 rounded-lg"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
          <div className="flex justify-between mt-5">
            <button
              onClick={handleSignOut}
              className="flex items-center text-red-700 cursor-pointer"
            >
              <FaSignOutAlt className="mr-1" /> Sign out
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center text-red-700 cursor-pointer"
            >
              <FaTrashAlt className="mr-1" /> Delete account
            </button>
          </div>
          {error && <p className="text-red-700 mt-5">{error}</p>}
          {updateSuccess && (
            <p className="text-green-700 mt-5">Profile updated successfully!</p>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            My Booking History
          </h2>
          {bookingsLoading ? (
            <p className="text-center">Loading your bookings...</p>
          ) : bookingsError ? (
            <p className="text-center text-red-600">{bookingsError}</p>
          ) : bookings.length === 0 ? (
            <p className="text-center">You have not made any bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">Booking ID</th>
                    <th className="px-4 py-2 border">Package</th>
                    <th className="px-4 py-2 border">Booking Date</th>
                    <th className="px-4 py-2 border">Travellers</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border text-sm">{booking._id}</td>
                      <td className="px-4 py-2 border text-sm">
                        {booking.package && booking.package.title
                          ? `${booking.package.title} (${new Date(
                              booking.bookingDate
                            ).toLocaleDateString()})`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {new Date(booking.bookingDate).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {booking.travellers.length}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {booking.cancelled
                          ? "Cancelled"
                          : booking.approved
                          ? "Approved"
                          : "Pending"}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {booking.cancelled ? (
                          booking.refundAmount ? (
                            <button
                              onClick={() =>
                                (window.location.href = `/api/refund/invoice/${booking._id}?refund=${booking.refundAmount}&penaltyPercentage=${booking.penaltyPercentage}&transactionId=${booking.transactionId}&reference=${booking.reference}`)
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                            >
                              Download Invoice
                            </button>
                          ) : (
                            "Cancelled"
                          )
                        ) : booking.approved ? (
                          <span className="text-gray-600">Not cancellable</span>
                        ) : !booking.completed ? (
                          <button
                            onClick={() => openCancelModal(booking)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                          >
                            Cancel Booking
                          </button>
                        ) : (
                          "Completed"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === "complaints" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            <FaTicketAlt className="inline-block mr-2" size={28} />
            Raise a Complaint Ticket
          </h2>
          <form
            onSubmit={handleComplaintSubmit}
            className="max-w-md mx-auto mb-8 space-y-4 p-4 border rounded-lg shadow-lg bg-white"
          >
            {/* Complaint Type Field */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">Complaint Type</label>
              <select
                name="targetType"
                value={complaintForm.targetType}
                onChange={handleComplaintChange}
                className="w-full border p-2 rounded pl-10"
              >
                <option value="Listing">Package</option>
                <option value="Guide">Guide</option>
              </select>
              {complaintForm.targetType === "Listing" ? (
                <FaBoxOpen className="absolute left-2 top-10 text-gray-400" />
              ) : (
                <FaUserAlt className="absolute left-2 top-10 text-gray-400" />
              )}
            </div>
            {/* Target Selection Field */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">
                {complaintForm.targetType === "Listing"
                  ? "Select Package"
                  : "Select Guide"}
              </label>
              {complaintForm.targetType === "Listing" ? (
                <select
                  name="target"
                  value={complaintForm.target}
                  onChange={handleComplaintChange}
                  className="w-full border p-2 rounded pl-10"
                  required
                >
                  <option value="">Select a package</option>
                  {bookings.length > 0 &&
                    bookings.map((booking) =>
                      booking.package && booking.package.title ? (
                        <option key={booking._id} value={booking.package._id}>
                          {booking.package.title} (
                          {new Date(booking.bookingDate).toLocaleDateString()})
                        </option>
                      ) : null
                    )}
                </select>
              ) : (
                myGuideOptions.length > 0 ? (
                  <select
                    name="target"
                    value={complaintForm.target}
                    onChange={handleComplaintChange}
                    className="w-full border p-2 rounded pl-10"
                    required
                  >
                    <option value="">Select a guide</option>
                    {myGuideOptions.map((guide) => (
                      <option key={guide._id} value={guide._id}>
                        {guide.name || guide.fullName || guide.username || "No Name"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="target"
                    placeholder="Enter Guide ID"
                    value={complaintForm.target}
                    onChange={handleComplaintChange}
                    className="w-full border p-2 rounded pl-10"
                    required
                  />
                )
              )}
              {complaintForm.targetType === "Listing" ? (
                <FaBoxOpen className="absolute left-2 top-10 text-gray-400" />
              ) : (
                <FaUserAlt className="absolute left-2 top-10 text-gray-400" />
              )}
            </div>
            {/* Complaint Message Field */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">
                <FaExclamationTriangle className="inline-block mr-1 text-red-500" />
                Complaint Message
              </label>
              <textarea
                name="message"
                placeholder="Describe your issue"
                value={complaintForm.message}
                onChange={handleComplaintChange}
                className="w-full border p-2 rounded"
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              disabled={complaintLoading}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {complaintLoading ? "Submitting..." : "Submit Complaint"}
            </motion.button>
          </form>
          {complaintError && (
            <p className="text-center text-red-600 mb-4">{complaintError}</p>
          )}
          {/* Optionally, list existing complaints here */}
          {complaints.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">Ticket ID</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Target</th>
                    <th className="px-4 py-2 border">Message</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <motion.tr
                      key={complaint._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      className="hover:bg-gray-100"
                    >
                      <td className="px-4 py-2 border text-sm">{complaint._id}</td>
                      <td className="px-4 py-2 border text-sm">
                        {complaint.targetType === "Listing" ? "Package" : "Guide"}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {complaint.target
                          ? (complaint.target.title ||
                              complaint.target.name ||
                              complaint.target.fullName ||
                              complaint.target.username ||
                              complaint.target)
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border text-sm">{complaint.message}</td>
                      <td className="px-4 py-2 border text-sm capitalize">
                        {complaint.status}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {new Date(complaint.createdAt).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
              Confirm Account Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteUser}
                className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200 shadow"
              >
                <FaTrashAlt className="mr-1" /> Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full flex items-center justify-center bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200 shadow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && <CancelModal />}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
