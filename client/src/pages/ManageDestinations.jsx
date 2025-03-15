import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaImage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If editing an existing destination, store that record here; otherwise null for "Add New"
  const [editingDestination, setEditingDestination] = useState(null);

  // Form data for the modal (including images)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrls: [], // We'll store images in an array
  });

  // Cloudinary states
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // 1) Fetch destinations on mount
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch destinations");
        }
        setDestinations(data.destinations);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  // 2) Handle opening the modal for adding a new destination
  const openModalForNew = () => {
    setEditingDestination(null);
    // Reset form data
    setFormData({ name: "", description: "", imageUrls: [] });
    setIsModalOpen(true);
  };

  // 3) Handle opening the modal for editing an existing destination
  const openModalForEdit = (destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      imageUrls: destination.imageUrls || [],
    });
    setIsModalOpen(true);
  };

  // 4) Handle changes in text fields (Name, Description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5) Cloudinary Upload
  const handleImageUpload = () => {
    // Limit to 6 images total
    if (formData.imageUrls.length >= 6) {
      setImageUploadError("You can only upload up to 6 images.");
      return;
    }
    setUploading(true);
    setImageUploadError("");
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "drqoa7h5u",
        upload_preset: "Destination_tour",
        sources: ["local", "url", "camera"],
        folder: "Destination",
        multiple: true,
        max_files: 6 - formData.imageUrls.length,
      },
      (error, result) => {
        if (error) {
          setImageUploadError("Image upload failed.");
          setUploading(false);
          return;
        }
        if (result.event === "success") {
          // Add the newly uploaded image URL to our array
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, result.info.secure_url],
          }));
        }
        if (result.event === "close") {
          setUploading(false);
        }
      }
    );
  };

  // 6) Remove image from state
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // 7) Submit the form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description) {
      toast.error("Please fill in name and description.");
      return;
    }

    // Build the payload
    const payload = {
      name: formData.name,
      description: formData.description,
      imageUrls: formData.imageUrls,
    };

    try {
      let res;
      if (editingDestination) {
        // Update
        res = await fetch(`/api/destinations/${editingDestination._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch("/api/destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Operation failed.");
      }
      toast.success(editingDestination ? "Destination updated!" : "Destination created!");

      // Close modal
      setIsModalOpen(false);
      setEditingDestination(null);
      // Refresh the list
      const updatedRes = await fetch("/api/destinations");
      const updatedData = await updatedRes.json();
      setDestinations(updatedData.destinations);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 8) Delete a destination
  const handleDelete = async (destinationId) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      const res = await fetch(`/api/destinations/${destinationId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete destination");
      }
      toast.success("Destination deleted successfully!");
      setDestinations(destinations.filter((dest) => dest._id !== destinationId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Manage Destinations</h1>
          <button
            onClick={openModalForNew}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" /> Add Destination
          </button>
        </div>

        {/* Table or loading/error states */}
        {loading ? (
          <p className="text-center">Loading destinations...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : destinations.length === 0 ? (
          <p className="text-center">No destinations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border">Destination ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border text-sm">{dest._id}</td>
                    <td className="px-4 py-2 border text-sm">{dest.name}</td>
                    <td className="px-4 py-2 border text-sm">
                      {dest.description.length > 60
                        ? dest.description.slice(0, 60) + "..."
                        : dest.description}
                    </td>
                    <td className="px-4 py-2 border text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModalForEdit(dest)}
                          className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dest._id)}
                          className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
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
      </div>

      {/* Modal for Create/Update Destination */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingDestination ? "Update Destination" : "Add New Destination"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  rows={3}
                  required
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 mb-1 flex items-center">
                  <FaImage className="mr-2 text-gray-500" />
                  Images
                </label>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="mt-2 p-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>
                {imageUploadError && (
                  <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>
                )}

                {/* Display images */}
                {formData.imageUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt="Destination"
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                {editingDestination ? "Update Destination" : "Create Destination"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
