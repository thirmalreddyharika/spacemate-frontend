import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  const userRole = String(user?.role || "").replace("ROLE_", "").toUpperCase();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && userRole !== role.toUpperCase()) {
    const destination = {
      ADMIN: "/admin",
      OWNER: "/owner",
      USER: "/user",
    }[userRole] || "/login";
    return <Navigate to={destination} replace />;
  }

  return children;
}