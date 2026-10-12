import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function UserDashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  // Filtering & Search
  const [activeTab, setActiveTab] = useState("allotments"); // 'allotments' | 'reserve'
  const [bookingSearch, setBookingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [lotSearch, setLotSearch] = useState("");

  // Slot Allotment Modal State
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotSlots, setLotSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [allotmentForm, setAllotmentForm] = useState({
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "12:00",
  });
  const [submittingAllotment, setSubmittingAllotment] = useState(false);

  // Initial Data Load
  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, lotsRes] = await Promise.all([
        API.get("/bookings/my").catch(() => ({ data: [] })),
        API.get("/lots/approved").catch(() => ({ data: [] })),
      ]);

      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setParkingLots(Array.isArray(lotsRes.data) ? lotsRes.data : []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      showFeedback("Failed to load live data from server. Please refresh.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showFeedback = (text, type = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: "", type: "" }), 5000);
  };

  // Open slot picker for a chosen lot
  const handleOpenSlotModal = async (lot) => {
    setSelectedLot(lot);
    setSelectedSlot(null);
    setLoadingSlots(true);
    try {
      let slotsRes;
      try {
        slotsRes = await API.get(`/slots/lot/${lot.id}`);
      } catch {
        slotsRes = await API.get(`/parking-lots/${lot.id}/slots`);
      }
      setLotSlots(Array.isArray(slotsRes.data) ? slotsRes.data : []);
    } catch (err) {
      console.error("Failed to load slots:", err);
      setLotSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Live price calculation for modal
  const estimatedCost = useMemo(() => {
    if (!selectedLot || !allotmentForm.startTime || !allotmentForm.endTime) return 0;
    try {
      const [startH, startM] = allotmentForm.startTime.split(":").map(Number);
      const [endH, endM] = allotmentForm.endTime.split(":").map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;
      const diffMin = endMin - startMin;
      if (diffMin <= 0) return 0;
      const hours = Math.ceil(diffMin / 60);
      return hours * Number(selectedLot.pricePerHour || 0);
    } catch {
      return 0;
    }
  }, [selectedLot, allotmentForm.startTime, allotmentForm.endTime]);

  // Submit slot allotment booking
  const handleConfirmAllotment = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      showFeedback("Please select an available parking slot.", "error");
      return;
    }

    if (estimatedCost <= 0) {
      showFeedback("End time must be after start time.", "error");
      return;
    }

    setSubmittingAllotment(true);
    try {
      const response = await API.post("/bookings", {
        parkingLotId: selectedLot.id,
        slotId: selectedSlot.id,
        bookingDate: allotmentForm.bookingDate,
        startTime: allotmentForm.startTime,
        endTime: allotmentForm.endTime,
      });

      const newBooking = response.data;

      // Automatically complete payment for quick allotment confirmation
      try {
        await API.post("/payments", {
          bookingId: newBooking.id,
          amount: newBooking.amount || estimatedCost,
        });
      } catch {
        // Payment fallback if mock
      }

      showFeedback(
        `Parking Slot ${selectedSlot.slotNumber} successfully allotted at ${selectedLot.name}!`,
        "success"
      );

      setSelectedLot(null);
      setSelectedSlot(null);
      setActiveTab("allotments");
      fetchData();
    } catch (err) {
      showFeedback(
        err.response?.data?.message || err.message || "Failed to allot slot.",
        "error"
      );
    } finally {
      setSubmittingAllotment(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this parking allotment?")) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      showFeedback(`Allotment #${id} cancelled successfully.`, "success");
      fetchData();
    } catch (err) {
      showFeedback(
        err.response?.data?.message || "Failed to cancel booking.",
        "error"
      );
    }
  };

  // Computed stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const totalSpent = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const query = bookingSearch.toLowerCase();
      const lotName = (b.slot?.parkingLot?.name || b.parkingLot?.name || "").toLowerCase();
      const slotNum = (b.slot?.slotNumber || "").toLowerCase();
      const idMatch = String(b.id || "").includes(query);

      const matchesSearch = !query || lotName.includes(query) || slotNum.includes(query) || idMatch;
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, bookingSearch, statusFilter]);

  // Filtered parking lots
  const filteredLots = useMemo(() => {
    return parkingLots.filter((lot) => {
      const query = lotSearch.toLowerCase();
      return (
        !query ||
        lot.name.toLowerCase().includes(query) ||
        lot.location.toLowerCase().includes(query)
      );
    });
  }, [parkingLots, lotSearch]);

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">
            🅿️ Parking Allotment Dashboard
          </h2>
          <p className="text-muted mb-0">
            Welcome back, <strong>{user?.name || "Driver"}</strong>! Manage your reserved parking slots and book new allotments in real time.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setActiveTab("reserve")}
        >
          ➕ Find & Reserve Parking
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback.text && (
        <div
          className={`alert ${
            feedback.type === "error" ? "alert-danger" : "alert-success"
          } alert-dismissible fade show`}
          role="alert"
        >
          {feedback.text}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">TOTAL ALLOTMENTS</span>
            <h3 className="fw-bold my-1 text-primary">{totalBookings}</h3>
            <span className="text-muted small">Lifetime reservations</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">CONFIRMED / ACTIVE</span>
            <h3 className="fw-bold my-1 text-success">{confirmedBookings}</h3>
            <span className="text-muted small">Active allotted spots</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">PENDING ALLOTMENTS</span>
            <h3 className="fw-bold my-1 text-warning">{pendingBookings}</h3>
            <span className="text-muted small">Awaiting payment/confirmation</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">TOTAL EXPENSE</span>
            <h3 className="fw-bold my-1 text-info">₹{totalSpent.toLocaleString("en-IN")}</h3>
            <span className="text-muted small">Excluding cancelled</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "allotments" ? "active" : ""}`}
            onClick={() => setActiveTab("allotments")}
          >
            📋 My Parking Allotments ({bookings.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reserve" ? "active" : ""}`}
            onClick={() => setActiveTab("reserve")}
          >
            🚗 Reserve Available Parking Lots ({parkingLots.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: My Allotments Table */}
      {activeTab === "allotments" && (
        <div className="card shadow-sm border-0 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="fw-bold mb-0">My Reserved Parking Slots</h4>
            <div className="d-flex gap-2 flex-wrap">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by ID, lot, or slot..."
                style={{ minWidth: "220px" }}
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                style={{ width: "150px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-2">Loading parking allotments...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <h5 className="text-muted">No parking allotments found</h5>
              <p className="text-muted mb-3">
                {bookings.length === 0
                  ? "You don't have any parking reservations yet. Find and reserve a slot now!"
                  : "No bookings match your search filters."}
              </p>
              {bookings.length === 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab("reserve")}
                >
                  Find Available Parking Lots
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th># ID</th>
                    <th>Parking Facility</th>
                    <th>Allotted Slot</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const lot = b.slot?.parkingLot || b.parkingLot;
                    return (
                      <tr key={b.id}>
                        <td className="fw-bold text-muted">#{b.id}</td>
                        <td>
                          <strong>{lot?.name || "SpaceMate Parking"}</strong>
                          <div className="small text-muted">
                            📍 {lot?.location || "City Center"}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-dark fs-6 px-2 py-1">
                            {b.slot?.slotNumber || "Slot #"}
                          </span>
                        </td>
                        <td>
                          <div>📅 {b.bookingDate}</div>
                          <div className="small text-muted">
                            ⏰ {b.startTime} - {b.endTime}
                          </div>
                        </td>
                        <td className="fw-bold text-success">
                          ₹{b.amount}
                        </td>
                        <td>
                          <span
                            className={`badge px-2 py-1 ${
                              b.status === "CONFIRMED"
                                ? "bg-success"
                                : b.status === "PENDING"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td>
                          {b.status !== "CANCELLED" ? (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelBooking(b.id)}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-muted small">Cancelled</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reserve Parking Lots Grid */}
      {activeTab === "reserve" && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">Approved Parking Facilities</h4>
              <p className="text-muted small mb-0">
                Choose a parking facility to view real-time slot allotment.
              </p>
            </div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by lot name or location..."
              style={{ maxWidth: "280px" }}
              value={lotSearch}
              onChange={(e) => setLotSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-2">Loading parking lots...</p>
            </div>
          ) : filteredLots.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <h5>No parking facilities found</h5>
              <p className="text-muted">
                Please check back later or contact your parking administrator.
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredLots.map((lot) => (
                <div className="col-md-6 col-lg-4" key={lot.id}>
                  <div className="card shadow-sm border-0 h-100 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0 text-truncate" title={lot.name}>
                        {lot.name}
                      </h5>
                      <span className="badge bg-success">Approved</span>
                    </div>

                    <p className="text-muted small mb-3">
                      📍 {lot.location}
                    </p>

                    <div className="d-flex justify-content-between py-2 border-top border-bottom small text-muted mb-3">
                      <span>Total Capacity:</span>
                      <strong>{lot.totalSlots || "10"} Slots</strong>
                    </div>

                    <div className="d-flex justify-content-between align-items-baseline mb-3">
                      <span className="text-muted small">Hourly Rate:</span>
                      <span className="fs-5 fw-bold text-primary">
                        ₹{lot.pricePerHour}/hr
                      </span>
                    </div>

                    <button
                      className="btn btn-primary w-100 mt-auto"
                      onClick={() => handleOpenSlotModal(lot)}
                    >
                      🅿️ View & Allot Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Slot Allotment Modal */}
      {selectedLot && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  🅿️ Allot Slot at {selectedLot.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedLot(null)}
                />
              </div>

              <div className="modal-body p-4">
                <div className="mb-3">
                  <p className="mb-1 text-muted">
                    📍 <strong>Location:</strong> {selectedLot.location}
                  </p>
                  <p className="mb-0 text-muted">
                    💰 <strong>Rate:</strong> ₹{selectedLot.pricePerHour}/hour
                  </p>
                </div>

                <hr />

                {/* Slot Selection Visual Grid */}
                <h6 className="fw-bold mb-2">
                  1. Select an Available Parking Spot:
                </h6>

                {loadingSlots ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                    <span className="ms-2 text-muted">Loading parking spots...</span>
                  </div>
                ) : lotSlots.length === 0 ? (
                  <div className="alert alert-warning">
                    No individual slots registered for this lot yet. Please select another lot.
                  </div>
                ) : (
                  <>
                    <div className="d-flex gap-3 mb-3 small text-muted">
                      <span>🟩 Available</span>
                      <span>🟥 Booked / Occupied</span>
                      <span>⬛ Maintenance</span>
                    </div>

                    <div
                      className="d-flex flex-wrap gap-2 p-3 bg-light rounded mb-4"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {lotSlots.map((slot) => {
                        const isAvailable =
                          slot.status === "AVAILABLE" && slot.available !== false;
                        const isSelected = selectedSlot?.id === slot.id;

                        let btnClass = "btn-outline-secondary";
                        if (isSelected) {
                          btnClass = "btn-primary";
                        } else if (isAvailable) {
                          btnClass = "btn-outline-success";
                        } else if (slot.status === "MAINTENANCE") {
                          btnClass = "btn-secondary disabled";
                        } else {
                          btnClass = "btn-outline-danger disabled";
                        }

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            className={`btn ${btnClass} p-2 text-center`}
                            style={{ width: "95px" }}
                            disabled={!isAvailable}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <div className="fw-bold">{slot.slotNumber}</div>
                            <small style={{ fontSize: "10px" }}>
                              {slot.status}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Booking Form Details */}
                <h6 className="fw-bold mb-3">
                  2. Allotment Schedule:
                </h6>

                <form onSubmit={handleConfirmAllotment}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">
                        Reservation Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={allotmentForm.bookingDate}
                        onChange={(e) =>
                          setAllotmentForm({
                            ...allotmentForm,
                            bookingDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        required
                        value={allotmentForm.startTime}
                        onChange={(e) =>
                          setAllotmentForm({
                            ...allotmentForm,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        required
                        value={allotmentForm.endTime}
                        onChange={(e) =>
                          setAllotmentForm({
                            ...allotmentForm,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="small text-muted">Selected Slot:</div>
                      <strong>
                        {selectedSlot ? selectedSlot.slotNumber : "None Selected"}
                      </strong>
                    </div>

                    <div className="text-end">
                      <div className="small text-muted">Estimated Total:</div>
                      <strong className="fs-5 text-success">
                        ₹{estimatedCost}
                      </strong>
                    </div>
                  </div>

                  <div className="modal-footer border-0 p-0">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedLot(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success px-4"
                      disabled={!selectedSlot || submittingAllotment || estimatedCost <= 0}
                    >
                      {submittingAllotment
                        ? "Allotting Slot..."
                        : "Confirm Allotment & Reserve"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
