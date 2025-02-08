// BookingForm.js
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function BookingForm({ packageId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check for a JWT token (adjust this based on your auth implementation)
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Please sign in to book this package.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Booking failed');
      }
      setMessage('Booking successful!');
      setFormData({ name: '', email: '', additionalInfo: '' });
    } catch (error) {
      setMessage('Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // If no token, show a prompt to sign in.
  if (!token) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p>Please sign in to book this package.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Book This Package</h2>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
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
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Additional Information</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Any special requirements or notes?"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}

BookingForm.propTypes = {
  packageId: PropTypes.string.isRequired,
};
