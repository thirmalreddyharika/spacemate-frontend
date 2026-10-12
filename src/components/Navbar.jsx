
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const role = String(user?.role || "").toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? (
        role === "ADMIN" ? "/admin" :
        role === "OWNER" ? "/owner" : "/"
      ) : "/login"} className="logo">
        SpaceMate
      </Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            {role === "ADMIN" && (
              <Link to="/admin">Admin Dashboard</Link>
            )}

            {role === "OWNER" && (
              <Link to="/owner">Owner Dashboard</Link>
            )}

            {role === "USER" && (
              <>
                <Link to="/">Home</Link>
                <Link to="/user">Dashboard</Link>
                <Link to="/slots">Available Slots</Link>
                <Link to="/my-bookings">My Bookings</Link>
              </>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
