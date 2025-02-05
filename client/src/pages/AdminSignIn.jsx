import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { FiLock } from 'react-icons/fi';

export default function AdminSignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch('/api/auth/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data || data.error) {
        dispatch(signInFailure(data.message || 'Invalid credentials'));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/admin/dashboard');
    } catch {
      dispatch(signInFailure('Server error. Please try again.'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <FiLock className="text-gray-700 text-5xl mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Admin Login</h2>
          <p className="text-gray-500">Enter your credentials to access the dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        <div className="text-center mt-6 text-gray-600">
          <p>
            Not an admin?{' '}
            <Link to="/sign-in" className="text-blue-600 hover:underline">Sign in as User</Link>
          </p>
        </div>
      </div>
    </div>
  );
}