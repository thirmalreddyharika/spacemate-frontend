
import { useMemo, useState } from "react";

const initialBookings = [
  {
    id: "SM1001",
    parkingLot: "Central Parking",
    location: "City Center",
    date: "2026-10-12",
    time: "09:00 AM",
    duration: 2,
    amount: 60,
    status: "Confirmed",
  },
  {
    id: "SM1002",
    parkingLot: "Tech Park Parking",
    location: "Technology District",
    date: "2026-10-13",
    time: "10:30 AM",
    duration: 3,
    amount: 120,
    status: "Upcoming",
  },
  {
    id: "SM1003",
    parkingLot: "Mall Parking",
    location: "Shopping District",
    date: "2026-10-10",
    time: "02:00 PM",
    duration: 2,
    amount: 70,
    status: "Completed",
  },
];

export default function UserDashboard() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(searchText) ||
        booking.parkingLot.toLowerCase().includes(searchText) ||
        booking.location.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "Upcoming" || booking.status === "Confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const totalSpent = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce((total, booking) => total + booking.amount, 0);

  function cancelBooking(booking) {
    if (booking.status === "Completed") {
      setMessage("Completed bookings cannot be cancelled.");
      setSelectedBooking(null);
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((item) =>
        item.id === booking.id
          ? { ...item, status: "Cancelled" }
          : item
      )
    );

    setMessage(
      `Demo: booking ${booking.id} was cancelled locally. Connect your backend to persist this change.`
    );

    setSelectedBooking(null);
  }

  function statusClass(status) {
    switch (status) {
      case "Confirmed":
        return "user-status-confirmed";
      case "Upcoming":
        return "user-status-upcoming";
      case "Completed":
        return "user-status-completed";
      case "Cancelled":
        return "user-status-cancelled";
      default:
        return "";
    }
  }

  return (
    <main className="user-dashboard">
      <style>{`
        .user-dashboard {
          min-height: 100vh;
          padding: 32px;
          background: #f5f7fb;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
        }

        .user-dashboard * {
          box-sizing: border-box;
        }

        .user-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 28px;
        }

        .user-dashboard-header h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .user-dashboard-header p {
          margin: 0;
          color: #64748b;
          line-height: 1.5;
        }

        .user-dashboard-date {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          color: #475569;
          font-size: 14px;
        }

        .user-dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .user-stat-card {
          padding: 22px;
          background: #fff;
          border: 1px solid #e5eaf2;
          border-radius: 14px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, .03);
        }

        .user-stat-label {
          display: block;
          margin-bottom: 14px;
          color: #64748b;
          font-size: 14px;
        }

        .user-stat-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
        }

        .user-stat-note {
          display: block;
          margin-top: 9px;
          color: #64748b;
          font-size: 12px;
        }

        .user-bookings-panel {
          padding: 24px;
          background: #fff;
          border: 1px solid #e5eaf2;
          border-radius: 15px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, .03);
        }

        .user-bookings-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .user-bookings-heading h2 {
          margin: 0 0 7px;
          font-size: 21px;
        }

        .user-bookings-heading p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .user-bookings-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .user-bookings-filters input,
        .user-bookings-filters select {
          min-width: 180px;
          padding: 11px 13px;
          border: 1px solid #d8dfeb;
          border-radius: 9px;
          background: #fff;
          color: #172033;
          font-size: 14px;
        }

        .user-bookings-filters input {
          flex: 1;
        }

        .user-bookings-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .user-bookings-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          white-space: nowrap;
        }

        .user-bookings-table th {
          padding: 14px 12px;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .user-bookings-table td {
          padding: 17px 12px;
          border-bottom: 1px solid #edf0f5;
          font-size: 14px;
        }

        .user-bookings-table tbody tr:last-child td {
          border-bottom: none;
        }

        .user-booking-name {
          font-weight: 700;
        }

        .user-booking-location {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 12px;
        }

        .user-status {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .user-status-confirmed {
          color: #047857;
          background: #d1fae5;
        }

        .user-status-upcoming {
          color: #1d4ed8;
          background: #dbeafe;
        }

        .user-status-completed {
          color: #475569;
          background: #e2e8f0;
        }

        .user-status-cancelled {
          color: #b91c1c;
          background: #fee2e2;
        }

        .user-view-button {
          padding: 8px 12px;
          border: 1px solid #c7d2fe;
          border-radius: 8px;
          background: #eef2ff;
          color: #4338ca;
          font-weight: 700;
          cursor: pointer;
        }

        .user-view-button:hover {
          background: #e0e7ff;
        }

        .user-empty-state {
          padding: 36px 12px;
          color: #64748b;
          text-align: center;
        }

        .user-dashboard-message {
          padding: 14px 16px;
          margin-bottom: 18px;
          border-radius: 9px;
          background: #eef2ff;
          color: #3730a3;
          line-height: 1.5;
        }

        .user-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(15, 23, 42, .55);
        }

        .user-booking-modal {
          width: 100%;
          max-width: 440px;
          padding: 26px;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 20px 60px rgba(0, 0, 0, .2);
        }

        .user-booking-modal h2 {
          margin: 0 0 18px;
        }

        .user-modal-detail {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 13px 0;
          border-bottom: 1px solid #edf0f5;
          font-size: 14px;
        }

        .user-modal-detail span {
          color: #64748b;
        }

        .user-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 22px;
        }

        .user-modal-actions button {
          flex: 1;
          padding: 11px;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .user-modal-close {
          border: 1px solid #d8dfeb;
          background: #fff;
          color: #334155;
        }

        .user-modal-cancel {
          border: none;
          background: #dc2626;
          color: #fff;
        }

        @media (max-width: 1050px) {
          .user-dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .user-dashboard {
            padding: 18px;
          }

          .user-dashboard-header h1 {
            font-size: 25px;
          }

          .user-dashboard-stats {
            gap: 12px;
          }

          .user-stat-card {
            padding: 16px;
          }

          .user-stat-value {
            font-size: 24px;
          }

          .user-bookings-panel {
            padding: 16px;
          }

          .user-bookings-filters input,
          .user-bookings-filters select {
            width: 100%;
            min-width: 0;
          }
        }
      `}</style>

      <header className="user-dashboard-header">
        <div>
          <h1>My Dashboard</h1>
          <p>Manage your parking bookings and track your expenses.</p>
        </div>

        <div className="user-dashboard-date">
          📅{" "}
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </header>

      <section
        className="user-dashboard-stats"
        aria-label="Booking statistics"
      >
        <div className="user-stat-card">
          <span className="user-stat-label">Total Bookings</span>
          <strong className="user-stat-value">{totalBookings}</strong>
          <span className="user-stat-note">All booking records</span>
        </div>

        <div className="user-stat-card">
          <span className="user-stat-label">Upcoming Bookings</span>
          <strong className="user-stat-value">{upcomingBookings}</strong>
          <span className="user-stat-note">Confirmed and upcoming</span>
        </div>

        <div className="user-stat-card">
          <span className="user-stat-label">Completed Bookings</span>
          <strong className="user-stat-value">{completedBookings}</strong>
          <span className="user-stat-note">Successfully completed</span>
        </div>

        <div className="user-stat-card">
          <span className="user-stat-label">Total Spending</span>
          <strong className="user-stat-value">
            ₹{totalSpent.toLocaleString("en-IN")}
          </strong>
          <span className="user-stat-note">Excludes cancelled bookings</span>
        </div>
      </section>

      {message && (
        <div className="user-dashboard-message" role="status">
          {message}
        </div>
      )}

      <section className="user-bookings-panel">
        <div className="user-bookings-heading">
          <div>
            <h2>My Parking Bookings</h2>
            <p>View your reservation details and booking status.</p>
          </div>
        </div>

        <div className="user-bookings-filters">
          <input
            type="search"
            placeholder="Search booking ID, lot, or location..."
            aria-label="Search bookings"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Filter bookings by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="user-bookings-table-wrap">
          <table className="user-bookings-table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Parking Lot</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>

                  <td>
                    <span className="user-booking-name">
                      {booking.parkingLot}
                    </span>
                    <span className="user-booking-location">
                      {booking.location}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      `${booking.date}T12:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    <span className="user-booking-location">
                      {booking.time}
                    </span>
                  </td>

                  <td>
                    {booking.duration}{" "}
                    {booking.duration === 1 ? "hour" : "hours"}
                  </td>

                  <td>₹{booking.amount}</td>

                  <td>
                    <span
                      className={`user-status ${statusClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="user-view-button"
                      onClick={() => {
                        setMessage("");
                        setSelectedBooking(booking);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="user-empty-state">
              <h3>No bookings found</h3>
              <p>Try changing your search or status filter.</p>
            </div>
          )}
        </div>
      </section>

      {selectedBooking && (
        <div
          className="user-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBooking(null);
            }
          }}
        >
          <section
            className="user-booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-booking-modal-title"
          >
            <h2 id="user-booking-modal-title">Booking Details</h2>

            <div className="user-modal-detail">
              <span>Booking ID</span>
              <strong>{selectedBooking.id}</strong>
            </div>

            <div className="user-modal-detail">
              <span>Parking Lot</span>
              <strong>{selectedBooking.parkingLot}</strong>
            </div>

            <div className="user-modal-detail">
              <span>Location</span>
              <strong>{selectedBooking.location}</strong>
            </div>

            <div className="user-modal-detail">
              <span>Date</span>
              <strong>{selectedBooking.date}</strong>
            </div>

            <div className="user-modal-detail">
              <span>Time</span>
              <strong>{selectedBooking.time}</strong>
            </div>

            <div className="user-modal-detail">
              <span>Duration</span>
              <strong>{selectedBooking.duration} hour(s)</strong>
            </div>

            <div className="user-modal-detail">
              <span>Amount</span>
              <strong>₹{selectedBooking.amount}</strong>
            </div>

            <div className="user-modal-detail">
              <span>Status</span>
              <strong>{selectedBooking.status}</strong>
            </div>

            <div className="user-modal-actions">
              <button
                type="button"
                className="user-modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>

              {selectedBooking.status !== "Completed" &&
                selectedBooking.status !== "Cancelled" && (
                  <button
                    type="button"
                    className="user-modal-cancel"
                    onClick={() => cancelBooking(selectedBooking)}
                  >
                    Cancel Booking
                  </button>
                )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
