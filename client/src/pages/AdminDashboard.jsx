// src/pages/AdminDashboard.jsx
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, Admin! Use the links below to manage the system:</p>
      <ul className="mt-4 space-y-2">
        <li><Link to="/admin/manage-destinations" className="text-blue-700">Manage Destinations</Link></li>
        <li><Link to="/admin/manage-packages" className="text-blue-700">Manage Packages</Link></li>
        <li><Link to="/admin/manage-bookings" className="text-blue-700">Manage Bookings</Link></li>
        <li><Link to="/admin/manage-users" className="text-blue-700">Manage Users</Link></li>
      </ul>
    </div>
  );
}
