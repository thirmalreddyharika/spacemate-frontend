import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark spacemate-navbar">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          🅿️ SpaceMate
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >

          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/parking-lots">
                    Parking Lots
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">
                    My Bookings
                  </Link>
                </li>
              </>
            )}

            {user?.role === "OWNER" && (
              <li className="nav-item">
                <Link className="nav-link" to="/owner">
                  Owner Dashboard
                </Link>
              </li>
            )}

            {user?.role === "ADMIN" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin Dashboard
                </Link>
              </li>
            )}

          </ul>

          <div className="d-flex align-items-center">

            {isAuthenticated ? (
              <>
                <span className="text-white me-3">
                  Welcome, {user?.name}
                </span>

                <button
                  className="btn btn-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light me-2"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-light"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;