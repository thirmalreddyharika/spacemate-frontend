import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../services/api";

const Payment = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const { booking } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!booking) {

    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          No booking selected.
        </div>

      </div>
    );
  }

  const handlePayment = async () => {

    setLoading(true);

    setError("");

    try {

      const response = await API.post("/payments", {
        bookingId: booking.id,
        amount: booking.amount
      });

      navigate("/booking-confirmation", {
        state: {
          booking,
          payment: response.data
        }
      });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Payment failed."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body text-center">

              <h2>
                Payment
              </h2>

              <hr />

              <p>
                Booking ID:
                {" "}
                <strong>
                  {booking.id}
                </strong>
              </p>

              <p>
                Amount:
                {" "}
                <strong>
                  ₹{booking.amount}
                </strong>
              </p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <button
                className="btn btn-success w-100"
                onClick={handlePayment}
                disabled={loading}
              >

                {loading
                  ? "Processing Payment..."
                  : "Pay Now"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Payment;