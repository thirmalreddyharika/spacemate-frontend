import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const dashboardPath = {
    ADMIN: "/admin",
    OWNER: "/owner",
    USER: "/user",
  }[user?.role] || "/login";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 24px", background: "#1f2937", color: "white"
    }}>
      <Link to="/" style={{ color: "#a5b4fc", fontSize: 24, fontWeight: "bold", textDecoration: "none" }}>
        SpaceMate
      </Link>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <Link to={dashboardPath} style={{ color: "#a5b4fc" }}>Dashboard</Link>
            <button onClick={handleLogout} style={{
              background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}