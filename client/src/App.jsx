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
import BookingPage from './pages/BookPackage';
import ManageBooking from "./pages/ManageBooking"

// New public components for package listing and detail
import Packages from "./componets/Packages";
import PackageDetails from "./componets/PackageDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* Public User Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* New Routes for viewing packages */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />

        {/* Private user routes */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>

      {/* Admin Routes */}
      <Routes>
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-package" element={<CreatePackage />} />
          <Route path="/admin/manage-packages" element={<ManagePackages />} />
          <Route path="/admin/manage-bookings" element={<ManageBooking />} />
          {/* Add more admin-only routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
