import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function OwnerDashboard() {
  const { user } = useAuth();

  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  // Register New Lot Modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    location: "",
    totalSlots: 10,
    pricePerHour: 40,
  });
  const [registering, setRegistering] = useState(false);

  // Manage Slots Modal
  const [selectedLotForSlots, setSelectedLotForSlots] = useState(null);
  const [lotSlots, setLotSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [newSlotNumber, setNewSlotNumber] = useState("");
  const [addingSlot, setAddingSlot] = useState(false);

  const showFeedback = (text, type = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: "", type: "" }), 5000);
  };

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [lotsRes, bookingsRes] = await Promise.all([
        API.get("/lots/owner/my-lots").catch(() => ({ data: [] })),
        API.get("/bookings/owner/my-bookings").catch(() => ({ data: [] })),
      ]);

      setLots(Array.isArray(lotsRes.data) ? lotsRes.data : []);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (err) {
      console.error("Failed to load owner data:", err);
      showFeedback("Failed to load your parking lots and allotments.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  // Handle registering a new lot
  const handleRegisterLot = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.location) {
      showFeedback("Please fill out all required fields.", "error");
      return;
    }

    setRegistering(true);
    try {
      await API.post("/lots", {
        name: registerForm.name.trim(),
        location: registerForm.location.trim(),
        totalSlots: Number(registerForm.totalSlots),
        pricePerHour: Number(registerForm.pricePerHour),
      });

      showFeedback(
        `Parking lot "${registerForm.name}" registered successfully! It has been submitted for admin approval.`,
        "success"
      );

      setIsRegisterOpen(false);
      setRegisterForm({
        name: "",
        location: "",
        totalSlots: 10,
        pricePerHour: 40,
      });

      fetchOwnerData();
    } catch (err) {
      showFeedback(
        err.response?.data?.message || err.message || "Failed to register parking lot.",
        "error"
      );
    } finally {
      setRegistering(false);
    }
  };

  // Open manage slots modal
  const handleOpenSlotsModal = async (lot) => {
    setSelectedLotForSlots(lot);
    setLoadingSlots(true);
    try {
      let res;
      try {
        res = await API.get(`/slots/lot/${lot.id}`);
      } catch {
        res = await API.get(`/parking-lots/${lot.id}/slots`);
      }
      setLotSlots(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setLotSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Add individual slot
  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlotNumber.trim()) return;

    setAddingSlot(true);
    try {
      await API.post(`/slots/lot/${selectedLotForSlots.id}`, {
        slotNumber: newSlotNumber.trim(),
      });

      showFeedback(`Slot "${newSlotNumber.trim()}" added successfully!`, "success");
      setNewSlotNumber("");
      handleOpenSlotsModal(selectedLotForSlots);
    } catch (err) {
      showFeedback(
        err.response?.data?.message || "Failed to add slot.",
        "error"
      );
    } finally {
      setAddingSlot(false);
    }
  };

  // Toggle slot maintenance
  const handleToggleMaintenance = async (slot) => {
    try {
      if (slot.status === "MAINTENANCE") {
        await API.put(`/slots/${slot.id}/available`);
        showFeedback(`Slot ${slot.slotNumber} marked as Available.`, "success");
      } else {
        await API.put(`/slots/${slot.id}/maintenance`);
        showFeedback(`Slot ${slot.slotNumber} set to Maintenance.`, "success");
      }
      handleOpenSlotsModal(selectedLotForSlots);
    } catch (err) {
      showFeedback(
        err.response?.data?.message || "Failed to update slot status.",
        "error"
      );
    }
  };

  // Calculated Stats
  const totalLots = lots.length;
  const approvedLots = lots.filter((l) => l.status === "APPROVED").length;
  const totalBookingsReceived = bookings.length;
  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">🏢 Parking Lot Owner Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome, <strong>{user?.name || "Owner"}</strong>! Manage your parking facilities, slots, and track customer allotments.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsRegisterOpen(true)}
        >
          ➕ Register New Parking Lot
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

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">TOTAL PARKING LOTS</span>
            <h3 className="fw-bold my-1 text-primary">{totalLots}</h3>
            <span className="text-muted small">{approvedLots} approved by admin</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">TOTAL ALLOTMENTS</span>
            <h3 className="fw-bold my-1 text-success">{totalBookingsReceived}</h3>
            <span className="text-muted small">Customer bookings received</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">TOTAL REVENUE</span>
            <h3 className="fw-bold my-1 text-info">₹{totalRevenue.toLocaleString("en-IN")}</h3>
            <span className="text-muted small">Confirmed allotments</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">PENDING APPROVALS</span>
            <h3 className="fw-bold my-1 text-warning">
              {lots.filter((l) => l.status === "PENDING").length}
            </h3>
            <span className="text-muted small">Under admin review</span>
          </div>
        </div>
      </div>

      {/* Section 1: My Parking Facilities */}
      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">My Parking Facilities</h4>
          <span className="badge bg-secondary">{lots.length} Facilities</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted mt-2">Loading parking lots...</p>
          </div>
        ) : lots.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <h5>No parking facilities registered yet</h5>
            <p className="text-muted mb-3">
              Start by registering your parking lot to allow drivers to book slots.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setIsRegisterOpen(true)}
            >
              Register Your First Parking Lot
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Facility Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Hourly Rate</th>
                  <th>Approval Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id}>
                    <td>
                      <strong>{lot.name}</strong>
                    </td>
                    <td className="text-muted">📍 {lot.location}</td>
                    <td>{lot.totalSlots || "-"} Slots</td>
                    <td className="fw-bold text-success">
                      ₹{lot.pricePerHour}/hr
                    </td>
                    <td>
                      <span
                        className={`badge px-2 py-1 ${
                          lot.status === "APPROVED"
                            ? "bg-success"
                            : lot.status === "PENDING"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {lot.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleOpenSlotsModal(lot)}
                      >
                        ⚙️ Manage Slots
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Customer Allotments Received */}
      <div className="card shadow-sm border-0 p-3">
        <h4 className="fw-bold mb-3">Customer Parking Allotments Received</h4>

        {bookings.length === 0 ? (
          <div className="text-center py-4 bg-light rounded text-muted">
            No customer reservations recorded yet for your lots.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th># ID</th>
                  <th>Driver / Customer</th>
                  <th>Slot Allotted</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-bold text-muted">#{b.id}</td>
                    <td>
                      <strong>{b.user?.name || "Driver"}</strong>
                      <div className="small text-muted">{b.user?.email}</div>
                    </td>
                    <td>
                      <span className="badge bg-dark px-2 py-1">
                        {b.slot?.slotNumber || "Slot #"}
                      </span>
                    </td>
                    <td>
                      <div>📅 {b.bookingDate}</div>
                      <div className="small text-muted">
                        ⏰ {b.startTime} - {b.endTime}
                      </div>
                    </td>
                    <td className="fw-bold text-success">₹{b.amount}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register New Parking Lot Modal */}
      {isRegisterOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  ➕ Register New Parking Facility
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsRegisterOpen(false)}
                />
              </div>

              <form onSubmit={handleRegisterLot}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Parking Lot Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Metro Express Parking"
                      required
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">
                      Address / Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 5th Main Road, City Center"
                      required
                      value={registerForm.location}
                      onChange={(e) =>
                        setRegisterForm({ ...registerForm, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Total Parking Slots
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="form-control"
                        required
                        value={registerForm.totalSlots}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            totalSlots: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Hourly Rate (₹/hr)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        className="form-control"
                        required
                        value={registerForm.pricePerHour}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            pricePerHour: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsRegisterOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={registering}
                  >
                    {registering ? "Registering..." : "Submit for Approval"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manage Slots Modal */}
      {selectedLotForSlots && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  ⚙️ Manage Slots — {selectedLotForSlots.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedLotForSlots(null)}
                />
              </div>

              <div className="modal-body p-4">
                {/* Add New Slot Inline Form */}
                <form onSubmit={handleAddSlot} className="mb-4">
                  <label className="form-label small fw-semibold">
                    Add New Slot to this Facility
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. B-12 or Slot-15"
                      value={newSlotNumber}
                      onChange={(e) => setNewSlotNumber(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={addingSlot || !newSlotNumber.trim()}
                    >
                      {addingSlot ? "Adding..." : "➕ Add Slot"}
                    </button>
                  </div>
                </form>

                <h6 className="fw-bold mb-3">Allotment Slots List ({lotSlots.length}):</h6>

                {loadingSlots ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                    <span className="ms-2 text-muted">Loading slots...</span>
                  </div>
                ) : lotSlots.length === 0 ? (
                  <div className="alert alert-info">
                    No slots found. Use the field above to add your first slot!
                  </div>
                ) : (
                  <div
                    className="d-flex flex-wrap gap-2 p-3 bg-light rounded"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {lotSlots.map((slot) => {
                      const isMaintenance = slot.status === "MAINTENANCE";
                      return (
                        <div
                          key={slot.id}
                          className="card p-2 text-center shadow-sm"
                          style={{ width: "135px" }}
                        >
                          <div className="fw-bold">{slot.slotNumber}</div>
                          <span
                            className={`badge my-1 ${
                              slot.status === "AVAILABLE"
                                ? "bg-success"
                                : isMaintenance
                                ? "bg-secondary"
                                : "bg-danger"
                            }`}
                          >
                            {slot.status}
                          </span>
                          <button
                            type="button"
                            className={`btn btn-xs mt-1 ${
                              isMaintenance
                                ? "btn-outline-success"
                                : "btn-outline-warning"
                            }`}
                            style={{ fontSize: "11px", padding: "2px 4px" }}
                            onClick={() => handleToggleMaintenance(slot)}
                          >
                            {isMaintenance ? "Make Available" : "Maintenance"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedLotForSlots(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}