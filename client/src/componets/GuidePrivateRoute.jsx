import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// This helper function mimics what our backend does.
const verifyGuide = (user) => {
  return user && user.role === "guide";
};

export default function GuidePrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if (!verifyGuide(currentUser)) {
    return <Navigate to="/guide/signin" replace />;
  }
  return <Outlet />;
}
