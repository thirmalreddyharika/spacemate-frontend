import { Link, useLocation } from "react-router-dom";

const BookingConfirmation = () => {

  const location = useLocation();

  const { booking, payment } =
    location.state || {};

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-7">

          <div className="card shadow text-center">

            <div className="card-body p-5">

              <div className="success-icon">
                ✓
              </div>

              <h2 className="text-success">
                Booking Confirmed!
              </h2>

              <p className="mt-3">
                Your parking slot has been successfully
                reserved.
              </p>

              {booking && (
                <div className="text-start mt-4">

                  <p>
                    <strong>Booking ID:</strong>{" "}
                    {booking.id}
                  </p>

                  <p>
                    <strong>Slot:</strong>{" "}
                    {booking.slot?.slotNumber ||
                      booking.slotId}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {booking.bookingDate}
                  </p>

                  <p>
                    <strong>Amount:</strong>{" "}
                    ₹{booking.amount}
                  </p>

                </div>
              )}

              {payment && (
                <p className="text-success">
                  Payment successful.
                </p>
              )}

              <Link
                to="/my-bookings"
                className="btn btn-primary mt-3"
              >
                View My Bookings
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingConfirmation;