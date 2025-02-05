// src/componets/AdminPrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function AdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  // Allow access only if a user is logged in AND their role is admin
  return currentUser && currentUser.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/signin" />
  );
}
