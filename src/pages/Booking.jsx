import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../services/api";

const Booking = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const { lot, slot } = location.state || {};

  const [bookingDate, setBookingDate] = useState("");

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (!lot || !slot) {

    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          Please select a parking slot first.
        </div>

      </div>
    );
  }

  const handleBooking = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const response = await API.post("/bookings", {

        parkingLotId: lot.id,

        slotId: slot.id,

        bookingDate,

        startTime,

        endTime

      });

      navigate("/payment", {
        state: {
          booking: response.data
        }
      });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Booking failed."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-7">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="mb-4">
                Reserve Parking Slot
              </h3>

              <div className="booking-info mb-4">

                <p>
                  <strong>Parking Lot:</strong>{" "}
                  {lot.name}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {lot.location}
                </p>

                <p>
                  <strong>Slot:</strong>{" "}
                  {slot.slotNumber}
                </p>

                <p>
                  <strong>Price:</strong>{" "}
                  ₹{lot.pricePerHour}/hour
                </p>

              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking}>

                <div className="mb-3">

                  <label>
                    Booking Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={bookingDate}
                    onChange={(e) =>
                      setBookingDate(e.target.value)
                    }
                    required
                  />

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label>
                      Start Time
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      value={startTime}
                      onChange={(e) =>
                        setStartTime(e.target.value)
                      }
                      required
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>
                      End Time
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      value={endTime}
                      onChange={(e) =>
                        setEndTime(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >

                  {loading
                    ? "Processing..."
                    : "Confirm Booking"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Booking;