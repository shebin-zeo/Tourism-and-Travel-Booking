import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for update functionality
  const [selectedListing, setSelectedListing] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    description: '',
    destination: '',
    packageType: '',
    regularPrice: 0,
    discountPrice: 0,
    duration: 0,
    offer: false,
    accommodations: false,
    transport: false,
    itinerary: '',
  });
  // NEW: State for dynamic extra preferences in update modal.
  const [updatePreferences, setUpdatePreferences] = useState([]);
  const [newPreference, setNewPreference] = useState('');
  
  // States for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteListingId, setDeleteListingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification modal state
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  // Helper to show notifications for 3 seconds
  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  // Fetch all listings when the component mounts.
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listing', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch listings');
      }
      setListings(data.listings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal.
  const openDeleteModal = (id) => {
    setDeleteListingId(id);
    setIsDeleteModalOpen(true);
  };

  // Delete a listing after confirmation.
  const handleDeleteConfirmed = async () => {
    if (!deleteListingId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/listing/${deleteListingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || 'Failed to delete listing', 'error');
      } else {
        showNotification('Listing deleted successfully', 'success');
        fetchListings(); // Refresh the list
      }
    } catch (err) {
      showNotification('Error deleting listing: ' + err.message, 'error');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
      setDeleteListingId(null);
    }
  };

  // Toggle the package availability (enable/disable).
  const handleToggleAvailability = async (listing) => {
    try {
      // Treat missing enabled as true (active)
      const currentEnabled = typeof listing.enabled === 'boolean' ? listing.enabled : true;
      const updatedEnabled = !currentEnabled;
      const updatedListing = { ...listing, enabled: updatedEnabled };
  
      // Optimistically update UI
      setListings((prev) =>
        prev.map((l) => (l._id === listing._id ? updatedListing : l))
      );
  
      const res = await fetch(`/api/listing/${listing._id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: updatedEnabled }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        // Revert update on error
        setListings((prev) =>
          prev.map((l) => (l._id === listing._id ? listing : l))
        );
        showNotification(data.message || 'Failed to update package availability', 'error');
      } else {
        showNotification(
          `Package ${updatedEnabled ? 'enabled' : 'disabled'} successfully`,
          'success'
        );
      }
    } catch (err) {
      showNotification('Error updating package availability: ' + err.message, 'error');
    }
  };

  // Open the update modal and pre-fill the form with the selected listing data.
  const openUpdateModal = (listing) => {
    setSelectedListing(listing);
    setUpdateFormData({
      title: listing.title,
      description: listing.description,
      destination: listing.destination,
      packageType: listing.packageType,
      regularPrice: listing.regularPrice,
      discountPrice: listing.discountPrice,
      duration: listing.duration,
      offer: listing.offer,
      accommodations: listing.accommodations,
      transport: listing.transport,
      itinerary: Array.isArray(listing.itinerary) ? listing.itinerary.join('\n') : '',
    });
    // NEW: Pre-fill dynamic preferences from the listing (if any)
    setUpdatePreferences(Array.isArray(listing.preferences) ? listing.preferences : []);
    setNewPreference('');
    setIsUpdateModalOpen(true);
  };

  // Handle changes in the update form.
  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // NEW: Handle new preference input change.
  const handleNewPreferenceChange = (e) => {
    setNewPreference(e.target.value);
  };

  // NEW: Add new preference to the dynamic list.
  const handleAddPreference = () => {
    if (newPreference.trim() !== "") {
      setUpdatePreferences((prev) => [...prev, newPreference.trim()]);
      setNewPreference('');
    }
  };

  // NEW: Remove a preference from the dynamic list.
  const handleRemovePreference = (index) => {
    setUpdatePreferences((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the updated listing data.
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/listing/${selectedListing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updateFormData,
          itinerary: updateFormData.itinerary.split('\n'),
          // NEW: Use the dynamic preferences array
          preferences: updatePreferences,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.message || 'Failed to update listing', 'error');
      } else {
        showNotification('Listing updated successfully', 'success');
        setIsUpdateModalOpen(false);
        fetchListings(); // Refresh the list
      }
    } catch (err) {
      showNotification('Error updating listing: ' + err.message, 'error');
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Admin Dashboard - Listings
      </h1>

      {loading && <p>Loading packages...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && listings.length === 0 && (
        <p>No packages found. Please create a new package.</p>
      )}

      {!loading && listings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Destination</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Duration</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{listing.title}</td>
                  <td className="py-2 px-4 border-b">{listing.destination}</td>
                  <td className="py-2 px-4 border-b">{listing.packageType}</td>
                  <td className="py-2 px-4 border-b">${listing.regularPrice}</td>
                  <td className="py-2 px-4 border-b">{listing.duration} days</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {listing.enabled ? 'Enabled' : 'Disabled'}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => openUpdateModal(listing)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => openDeleteModal(listing._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggleAvailability(listing)}
                      className={`px-3 py-1 text-white rounded ${
                        listing.enabled
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {listing.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Update Listing</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={updateFormData.title}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={updateFormData.description}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={updateFormData.destination}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Type</label>
                <input
                  type="text"
                  name="packageType"
                  value={updateFormData.packageType}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Regular Price</label>
                  <input
                    type="number"
                    name="regularPrice"
                    value={updateFormData.regularPrice}
                    onChange={handleUpdateInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Discount Price</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={updateFormData.discountPrice}
                    onChange={handleUpdateInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Duration (days)</label>
                  <input
                    type="number"
                    name="duration"
                    value={updateFormData.duration}
                    onChange={handleUpdateInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Itinerary</label>
                  <textarea
                    name="itinerary"
                    value={updateFormData.itinerary}
                    onChange={handleUpdateInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter each day on a new line"
                    required
                  />
                </div>
              </div>
              {/* NEW: Extra Preferences Dynamic Field */}
              <div>
                <label className="block text-gray-700">Extra Preferences</label>
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={handleNewPreferenceChange}
                    placeholder="Enter a preference"
                    className="p-2 border rounded-l w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreference}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 focus:outline-none"
                  >
                    Add
                  </button>
                </div>
                {updatePreferences.length > 0 && (
                  <ul className="list-disc ml-4 mt-2 text-gray-700">
                    {updatePreferences.map((pref, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{pref}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePreference(index)}
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="offer"
                    checked={updateFormData.offer}
                    onChange={handleUpdateInputChange}
                    className="mr-2"
                  />
                  <span>Offer</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="accommodations"
                    checked={updateFormData.accommodations}
                    onChange={handleUpdateInputChange}
                    className="mr-2"
                  />
                  <span>Accommodations</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="transport"
                    checked={updateFormData.transport}
                    onChange={handleUpdateInputChange}
                    className="mr-2"
                  />
                  <span>Transport</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Listing</h2>
            <p className="mb-4">Are you sure you want to delete this package?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleteLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50">
          <p className={`text-lg ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {notification.message}
          </p>
        </div>
      )}
    </main>
  );
}
