// AdminUsers.jsx
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // State for update modal.
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    username: '',
    email: '',
    role: '',
  });
  // State for delete modal.
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  // Notification state.
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server did not return JSON. Please check the backend.');
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Open update modal.
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setUpdateFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsUpdateModalOpen(true);
  };

  // Close update modal.
  const closeUpdateModal = () => {
    setSelectedUser(null);
    setIsUpdateModalOpen(false);
  };

  // Handle update form input changes.
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated user data.
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/user/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(updateFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update user');
      }
      setUsers(users.map((u) => (u._id === selectedUser._id ? data.user : u)));
      showNotification('User updated successfully!', 'success');
      closeUpdateModal();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Open the custom delete modal.
  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Close the custom delete modal.
  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  // Confirm deletion.
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/user/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON on deletion.');
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }
      setUsers(users.filter((u) => u._id !== userToDelete));
      showNotification('User deleted successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading users...</div>;
  }
  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Manage Users</h1>
      
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-200">
              <tr>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border text-sm">{user._id}</td>
                  <td className="px-4 py-2 border text-sm">{user.username}</td>
                  <td className="px-4 py-2 border text-sm">{user.email}</td>
                  <td className="px-4 py-2 border text-sm">{user.role}</td>
                  <td className="px-4 py-2 border text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openUpdateModal(user)}
                        className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                      >
                        <FaEdit className="mr-1" /> Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(user._id)}
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

      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Update User</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={updateFormData.username}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updateFormData.email}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Role</label>
                <select
                  name="role"
                  value={updateFormData.role}
                  onChange={handleUpdateInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
                >
                  <FaTimes className="mr-1" /> Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                >
                  <FaCheck className="mr-1" /> Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm mx-auto p-6">
            <h2 className="text-xl font-bold mb-4 text-indigo-600 flex items-center">
              <FaTrash className="mr-2" /> Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this user?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
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
