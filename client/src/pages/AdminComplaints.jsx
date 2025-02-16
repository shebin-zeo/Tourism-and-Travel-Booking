// src/pages/AdminComplaints.jsx
import { useState, useEffect } from "react";
import { FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const token = localStorage.getItem("access_token");
        // Debug log: ensure token exists
        console.log("Admin token:", token);
        const res = await fetch("/api/complaints", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
          credentials: "include",
        });
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Data received:", data);
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch complaints");
        }
        setComplaints(data.complaints);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  // Mark complaint as resolved.
  const handleResolve = async (complaintId) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "resolved" }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update complaint status");
      }
      toast.success("Complaint marked as resolved");
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId ? { ...c, status: "resolved" } : c
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Open delete modal.
  const openDeleteModal = (complaintId) => {
    setSelectedComplaint(complaintId);
    setShowDeleteModal(true);
  };

  // Close delete modal.
  const closeDeleteModal = () => {
    setSelectedComplaint(null);
    setShowDeleteModal(false);
  };

  // Delete complaint.
  const handleDelete = async () => {
    if (!selectedComplaint) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/complaints/${selectedComplaint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete complaint");
      }
      toast.success("Complaint deleted successfully");
      setComplaints((prev) =>
        prev.filter((c) => c._id !== selectedComplaint)
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        Loading complaints...
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        Error: {error}
      </div>
    );
  }
  return (
    <main className="container mx-auto p-4">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center mb-6">Manage Complaints</h1>
      {complaints.length === 0 ? (
        <p className="text-center">No complaints found.</p>
      ) : (
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
                <th className="px-4 py-2 border">Actions</th>
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
                  <td className="px-4 py-2 border text-sm">
                    <div className="flex space-x-2">
                      {complaint.status !== "resolved" && (
                        <button
                          onClick={() => handleResolve(complaint._id)}
                          className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                        >
                          <FaCheck className="mr-1" /> Resolve
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(complaint._id)}
                        className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
              <FaTrash className="mr-2" /> Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this complaint?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200 shadow"
              >
                <FaTrash className="mr-1" /> Yes, Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="w-full flex items-center justify-center bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition duration-200 shadow"
              >
                <FaTimes className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </main>
  );
}
