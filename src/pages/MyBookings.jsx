import React, { useEffect, useState } from "react";

import API from "../services/api";

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {

    try {

      const response =
        await API.get("/bookings/my");

      setBookings(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmCancel) return;

    try {

      await API.put(`/bookings/${id}/cancel`);

      fetchBookings();

    } catch (error) {

      alert("Unable to cancel booking.");

    }
  };

  return (
    <div className="container py-5">

      <h2 className="mb-4">
        My Bookings
      </h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (

        <div className="alert alert-info">
          You don't have any bookings yet.
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Parking Lot</th>
                <th>Slot</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr key={booking.id}>

                  <td>
                    {booking.id}
                  </td>

                  <td>
                    {booking.parkingLot?.name ||
                      booking.parkingLotName ||
                      "-"}
                  </td>

                  <td>
                    {booking.slot?.slotNumber ||
                      booking.slotId ||
                      "-"}
                  </td>

                  <td>
                    {booking.bookingDate}
                  </td>

                  <td>
                    {booking.startTime}
                  </td>

                  <td>
                    {booking.endTime}
                  </td>

                  <td>
                    ₹{booking.amount}
                  </td>

                  <td>
                    <span className="badge bg-primary">
                      {booking.status}
                    </span>
                  </td>

                  <td>

                    {booking.status !== "CANCELLED" && (

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          cancelBooking(booking.id)
                        }
                      >
                        Cancel
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default MyBookings;