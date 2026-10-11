import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {

  const { isAuthenticated } = useAuth();

  return (
    <div>

      <section className="hero-section">
        <div className="container text-center">

          <h1 className="display-4 fw-bold">
            Smart Parking Made Easy
          </h1>

          <p className="lead mt-3">
            Find, reserve and manage parking spaces with SpaceMate.
          </p>

          <div className="mt-4">

            {isAuthenticated ? (
              <Link
                to="/parking-lots"
                className="btn btn-light btn-lg me-2"
              >
                Find Parking
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-light btn-lg me-2"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-light btn-lg"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </section>

      <section className="container py-5">

        <h2 className="text-center mb-5">
          Why SpaceMate?
        </h2>

        <div className="row g-4">

          <div className="col-md-3">
            <div className="feature-card">
              <h4>🔐</h4>
              <h5>Secure</h5>
              <p>
                JWT based secure authentication.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="feature-card">
              <h4>📍</h4>
              <h5>Easy Search</h5>
              <p>
                Find available parking spaces easily.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="feature-card">
              <h4>⏰</h4>
              <h5>Real-Time Slots</h5>
              <p>
                Check available slots before booking.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="feature-card">
              <h4>💳</h4>
              <h5>Easy Payment</h5>
              <p>
                Complete your booking with payment.
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;