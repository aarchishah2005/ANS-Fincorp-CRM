import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    const redirect = user.role === "admin" ? "/admin/dashboard" : "/sales/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;
