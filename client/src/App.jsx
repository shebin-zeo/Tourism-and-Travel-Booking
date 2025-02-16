import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./componets/Header";
import PrivateRoute from "./componets/PrivateRoute";
import AdminSignIn from "./pages/AdminSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPrivateRoute from "./componets/AdminPrivateRoute";
import CreatePackage from "./pages/CreatePackage";
import ManagePackages from "./pages/ManagePackages";
import BookingPage from "./pages/BookPackage";

// Booking related details
import ManageBooking from "./pages/ManageBooking";
import ManageUser from "./componets/ManageUser";
import UserBookings from "./pages/UserBookings";

// Package components
import Packages from "./componets/Packages";
import PackageDetails from "./componets/PackageDetail";

// Blog components
import BlogSubmit from "./componets/BlogSubmit";
import ManageBlog from "./componets/ManageBlog";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/Blogdetails";

// Guide components
import GuideDashboard from "./pages/GuideDashboard";
import GuidePrivateRoute from "./componets/GuidePrivateRoute";
import AdminCreateGuide from "./pages/AdminCreateGuide";
import GuideSignIn from "./pages/GuideSignIn";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Private User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog/submit" element={<BlogSubmit />} />
          <Route path="/my-bookings" element={<UserBookings />} />
        </Route>
        
        {/* Guide Routes */}
        <Route path="/guide/signin" element={<GuideSignIn />} />
        <Route element={<GuidePrivateRoute />}>
          <Route path="/guide/dashboard" element={<GuideDashboard />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-package" element={<CreatePackage />} />
          <Route path="/admin/manage-packages" element={<ManagePackages />} />
          <Route path="/admin/manage-bookings" element={<ManageBooking />} />
          <Route path="/admin/manage-users" element={<ManageUser />} />
          <Route path="/admin/manage-blog" element={<ManageBlog />} />
          <Route path="/admin/create-guide" element={<AdminCreateGuide />} />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<div className="container mx-auto p-8 text-center"><h2 className="text-3xl font-bold">404 Not Found</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}
