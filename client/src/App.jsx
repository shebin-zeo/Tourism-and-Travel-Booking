
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Header from "./componets/Header"
import PrivateRoute from "./componets/PrivateRoute" 
import AdminSignIn from "./pages/AdminSignIn";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPrivateRoute from "./componets/AdminPrivateRoute";
export default function App() {
  return (
    <BrowserRouter>
    <Header />
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />} >
        <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Add more admin-only routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}