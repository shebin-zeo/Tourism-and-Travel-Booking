// src/pages/AdminDashboard.jsx
import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaBoxOpen, FaClipboardList, FaUsers, FaPlusCircle, FaUserPlus,FaNewspaper,FaExclamationTriangle } from "react-icons/fa";

export default function AdminDashboard() {
  const adminOptions = [
    { name: "Manage Destinations", icon: <FaMapMarkedAlt />, path: "/admin/manage-destinations" },
    { name: "Manage Packages", icon: <FaBoxOpen />, path: "/admin/manage-packages" },
    { name: "Create Package", icon: <FaPlusCircle />, path: "/admin/create-package" },
    { name: "Manage Bookings", icon: <FaClipboardList />, path: "/admin/manage-bookings" },
    { name: "Manage Users", icon: <FaUsers />, path: "/admin/manage-users" },
    { name: "Create Guide", icon: <FaUserPlus />, path: "/admin/create-guide" }, // New Option
    { name: "Blog Approvals", icon: <FaNewspaper />, path: "/admin/manage-blog" }, // New option for blog approvals
    { name: "Manage Complaints", icon: <FaExclamationTriangle />, path: "/admin/manage-complaints" },
  
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome, Admin. Use the options below to efficiently manage the system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
          {adminOptions.map((option, index) => (
            <Link to={option.path} key={index} className="bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg p-4 flex items-center space-x-4 border border-gray-200 hover:border-blue-500">
              <div className="text-blue-600 text-3xl">{option.icon}</div>
              <span className="text-lg font-medium text-gray-800">{option.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
