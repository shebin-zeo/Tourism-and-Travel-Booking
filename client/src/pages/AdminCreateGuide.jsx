import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminCreateGuide() {
  // Always call hooks at the top
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to display notifications for 3 seconds
  const showNotification = (message, type) => {
    setNotification({ visible: true, message, type });
    setTimeout(() => {
      setNotification({ visible: false, message: '', type: '' });
    }, 3000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/guide/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create guide');
      }
      showNotification('Guide created successfully!', 'success');
      // Reset the form
      setFormData({ username: '', name: '', email: '', password: '', phone: '' });
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <>
      {(!currentUser || currentUser.role !== 'admin') ? (
        <Navigate to="/admin/signin" replace />
      ) : (
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Create New Guide</h1>
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto space-y-6 bg-white p-6 rounded shadow"
          >
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
            >
              Create Guide
            </button>
          </form>

          {/* Notification Popup */}
          {notification.visible && (
            <div
              className={`fixed bottom-4 right-4 bg-white border-l-4 p-4 rounded shadow-lg z-50 ${
                notification.type === 'success' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <p
                className={`font-semibold ${
                  notification.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {notification.message}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
