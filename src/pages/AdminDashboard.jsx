import React from "react";

const AdminDashboard = () => {

  return (
    <div className="container py-5">

      <h2 className="mb-4">
        Admin Dashboard
      </h2>

      <div className="row g-4">

        <div className="col-md-3">

          <div className="dashboard-card">
            <h5>Users</h5>
            <h2>0</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="dashboard-card">
            <h5>Owners</h5>
            <h2>0</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="dashboard-card">
            <h5>Bookings</h5>
            <h2>0</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="dashboard-card">
            <h5>Payments</h5>
            <h2>0</h2>
          </div>

        </div>

      </div>

      <div className="row mt-5 g-4">

        <div className="col-md-4">

          <button className="btn btn-primary w-100 p-3">
            Manage Users
          </button>

        </div>

        <div className="col-md-4">

          <button className="btn btn-success w-100 p-3">
            Manage Owners
          </button>

        </div>

        <div className="col-md-4">

          <button className="btn btn-warning w-100 p-3">
            Manage Parking Lots
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;