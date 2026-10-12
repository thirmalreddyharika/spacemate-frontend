import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [lots, setLots] = useState([]);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("lots"); // 'lots' | 'accounts' | 'bookings'

  const showFeedback = (text, type = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: "", type: "" }), 5000);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [lotsRes, usersRes, ownersRes, bookingsRes] = await Promise.all([
        API.get("/admin/lots").catch(() => ({ data: [] })),
        API.get("/admin/users").catch(() => ({ data: [] })),
        API.get("/admin/owners").catch(() => ({ data: [] })),
        API.get("/admin/bookings").catch(() => ({ data: [] })),
      ]);

      setLots(Array.isArray(lotsRes.data) ? lotsRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setOwners(Array.isArray(ownersRes.data) ? ownersRes.data : []);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showFeedback("Failed to load administrative data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Approve lot
  const handleApproveLot = async (id) => {
    try {
      await API.put(`/admin/lots/${id}/approve`);
      showFeedback(`Parking Lot #${id} approved successfully!`, "success");
      fetchAdminData();
    } catch (err) {
      showFeedback(
        err.response?.data?.message || "Failed to approve lot.",
        "error"
      );
    }
  };

  // Reject lot
  const handleRejectLot = async (id) => {
    if (!window.confirm("Are you sure you want to reject this parking lot?")) return;
    try {
      await API.put(`/admin/lots/${id}/reject`);
      showFeedback(`Parking Lot #${id} rejected.`, "success");
      fetchAdminData();
    } catch (err) {
      showFeedback(
        err.response?.data?.message || "Failed to reject lot.",
        "error"
      );
    }
  };

  // Computed metrics
  const pendingLotsCount = lots.filter((l) => l.status === "PENDING").length;
  const approvedLotsCount = lots.filter((l) => l.status === "APPROVED").length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">🛡️ SpaceMate Admin Portal</h2>
          <p className="text-muted mb-0">
            Welcome, <strong>{user?.name || "Administrator"}</strong>! Oversee system parking facilities, manage approvals, and monitor all allotments.
          </p>
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={fetchAdminData}
        >
          🔄 Refresh Data
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

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">PENDING LOT APPROVALS</span>
            <h3 className="fw-bold my-1 text-warning">{pendingLotsCount}</h3>
            <span className="text-muted small">Requires admin review</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">APPROVED LOTS</span>
            <h3 className="fw-bold my-1 text-success">{approvedLotsCount}</h3>
            <span className="text-muted small">Active in driver search</span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">REGISTERED ACCOUNTS</span>
            <h3 className="fw-bold my-1 text-primary">
              {users.length + owners.length}
            </h3>
            <span className="text-muted small">
              {users.length} Drivers, {owners.length} Owners
            </span>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100 p-3">
            <span className="text-muted small fw-semibold">TOTAL ALLOTMENTS</span>
            <h3 className="fw-bold my-1 text-info">{bookings.length}</h3>
            <span className="text-muted small">System-wide reservations</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "lots" ? "active" : ""}`}
            onClick={() => setActiveTab("lots")}
          >
            🏢 Parking Lot Approvals ({lots.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            👥 Accounts ({users.length + owners.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Allotment Records ({bookings.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Lots Management & Approvals */}
      {activeTab === "lots" && (
        <div className="card shadow-sm border-0 p-3">
          <h4 className="fw-bold mb-3">Parking Lots Review & Approval</h4>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-2">Loading parking lots...</p>
            </div>
          ) : lots.length === 0 ? (
            <div className="text-center py-4 bg-light rounded text-muted">
              No parking facilities registered in the system yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th># ID</th>
                    <th>Facility Name</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Capacity</th>
                    <th>Hourly Rate</th>
                    <th>Status</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot) => (
                    <tr key={lot.id}>
                      <td className="fw-bold text-muted">#{lot.id}</td>
                      <td>
                        <strong>{lot.name}</strong>
                      </td>
                      <td className="text-muted">📍 {lot.location}</td>
                      <td>
                        <div>{lot.owner?.name || "Owner"}</div>
                        <div className="small text-muted">{lot.owner?.email}</div>
                      </td>
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
                        <div className="d-flex gap-1">
                          {lot.status !== "APPROVED" && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleApproveLot(lot.id)}
                            >
                              ✓ Approve
                            </button>
                          )}
                          {lot.status !== "REJECTED" && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRejectLot(lot.id)}
                            >
                              ✕ Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Registered Accounts */}
      {activeTab === "accounts" && (
        <div className="card shadow-sm border-0 p-3">
          <h4 className="fw-bold mb-3">System Accounts (Drivers & Owners)</h4>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th># ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Account Role</th>
                </tr>
              </thead>
              <tbody>
                {[...owners, ...users].map((acc) => (
                  <tr key={`${acc.role}-${acc.id}`}>
                    <td className="fw-bold text-muted">#{acc.id}</td>
                    <td>
                      <strong>{acc.name}</strong>
                    </td>
                    <td>{acc.email}</td>
                    <td>{acc.phone || "—"}</td>
                    <td>
                      <span
                        className={`badge px-2 py-1 ${
                          acc.role === "ADMIN"
                            ? "bg-danger"
                            : acc.role === "OWNER"
                            ? "bg-primary"
                            : "bg-info text-dark"
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Allotment Audit */}
      {activeTab === "bookings" && (
        <div className="card shadow-sm border-0 p-3">
          <h4 className="fw-bold mb-3">System-wide Allotment Audit</h4>

          {bookings.length === 0 ? (
            <div className="text-center py-4 bg-light rounded text-muted">
              No allotments recorded in the system yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th># ID</th>
                    <th>Driver</th>
                    <th>Parking Facility</th>
                    <th>Slot</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const lot = b.slot?.parkingLot || b.parkingLot;
                    return (
                      <tr key={b.id}>
                        <td className="fw-bold text-muted">#{b.id}</td>
                        <td>
                          <strong>{b.user?.name || "Driver"}</strong>
                          <div className="small text-muted">{b.user?.email}</div>
                        </td>
                        <td>{lot?.name || "Parking Facility"}</td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}