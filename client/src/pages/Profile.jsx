import { useEffect, useState } from "react";
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
              "Authorization": token ? `Bearer ${token}` : "",
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
              "Authorization": token ? `Bearer ${token}` : "",
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
          "Authorization": token ? `Bearer ${token}` : "",
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
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(complaintForm),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Complaint submission failed");
      }
      toast.success("Complaint registered successfully!");
      // Optionally update local complaint list.
      setComplaints((prev) => [data.complaint, ...prev]);
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
          "Authorization": token ? `Bearer ${token}` : "",
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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 border rounded ${activeTab === "profile" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 border rounded ${activeTab === "bookings" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
        >
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2 border rounded ${activeTab === "complaints" ? "bg-indigo-600 text-white" : "bg-white text-gray-700"}`}
        >
          Register Complaint
        </button>
      </div>

      {activeTab === "profile" && (
        <div>
          <div className="flex flex-col items-center">
            <img
              src={currentUser?.avatar || "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"}
              alt="Profile"
              className="rounded-full h-24 w-24 object-cover mb-4"
            />
          </div>
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
            <button onClick={handleSignOut} className="text-red-700 cursor-pointer">
              Sign out
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-700 cursor-pointer"
            >
              Delete account
            </button>
          </div>
          {error && <p className="text-red-700 mt-5">{error}</p>}
          {updateSuccess && (
            <p className="text-green-700 mt-5">Profile updated successfully!</p>
          )}
        </div>
      )}

      {activeTab === "bookings" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">My Booking History</h2>
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
                        {booking.approved ? "Success" : "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "complaints" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Register Complaint</h2>
          <form
            onSubmit={handleComplaintSubmit}
            className="max-w-md mx-auto mb-8 space-y-4 p-4 border rounded-lg shadow-md"
          >
            <div>
              <label className="block text-gray-700 mb-1">Complaint Type</label>
              <select
                name="targetType"
                value={complaintForm.targetType}
                onChange={handleComplaintChange}
                className="w-full border p-2 rounded"
              >
                <option value="Listing">Package</option>
                <option value="Guide">Guide</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                {complaintForm.targetType === "Listing" ? "Select Package" : "Guide ID"}
              </label>
              {complaintForm.targetType === "Listing" ? (
                <select
                  name="target"
                  value={complaintForm.target}
                  onChange={handleComplaintChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select a package</option>
                  {bookings.length > 0 &&
                    bookings.map((booking) =>
                      booking.package && booking.package.title ? (
                        <option key={booking._id} value={booking.package._id}>
                          {booking.package.title}
                        </option>
                      ) : null
                    )}
                </select>
              ) : (
                <input
                  type="text"
                  name="target"
                  placeholder="Enter Guide ID"
                  value={complaintForm.target}
                  onChange={handleComplaintChange}
                  className="w-full border p-2 rounded"
                  required
                />
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Complaint Message</label>
              <textarea
                name="message"
                placeholder="Describe your issue"
                value={complaintForm.message}
                onChange={handleComplaintChange}
                className="w-full border p-2 rounded"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={complaintLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              {complaintLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
          {complaintError && (
            <p className="text-center text-red-600 mb-4">{complaintError}</p>
          )}
          {/* Optionally, list existing complaints */}
          {complaints.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border">Complaint ID</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Target</th>
                    <th className="px-4 py-2 border">Message</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border text-sm">{complaint._id}</td>
                      <td className="px-4 py-2 border text-sm">
                        {complaint.targetType === "Listing" ? "Package" : "Guide"}
                      </td>
                      <td className="px-4 py-2 border text-sm">
                        {complaint.target && complaint.target.title
                          ? complaint.target.title
                          : complaint.target}
                      </td>
                      <td className="px-4 py-2 border text-sm">{complaint.message}</td>
                      <td className="px-4 py-2 border text-sm capitalize">{complaint.status}</td>
                      <td className="px-4 py-2 border text-sm">
                        {new Date(complaint.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                Yes, Delete
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

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
