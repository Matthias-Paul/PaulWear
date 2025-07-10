
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const { loginUser } = useSelector((state) => state.user);

  if (!loginUser) return <Navigate to="/login" />;

  if (role && loginUser.role !== role) return <Navigate to="/" />;

  return <Outlet />; 
};

export default ProtectedRoute;
