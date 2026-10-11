import React from "react";

const OwnerDashboard = () => {

  return (
    <div className="container py-5">

      <h2 className="mb-4">
        Parking Lot Owner Dashboard
      </h2>

      <div className="row g-4">

        <div className="col-md-3">

          <div className="dashboard-card">
            <h5>Parking Lots</h5>
            <h2>0</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="dashboard-card">
            <h5>Total Slots</h5>
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
            <h5>Earnings</h5>
            <h2>₹0</h2>
          </div>

        </div>

      </div>

      <div className="row mt-5 g-4">

        <div className="col-md-4">
          <button className="btn btn-primary w-100 p-3">
            Register Parking Lot
          </button>
        </div>

        <div className="col-md-4">
          <button className="btn btn-success w-100 p-3">
            Manage Slots
          </button>
        </div>

        <div className="col-md-4">
          <button className="btn btn-warning w-100 p-3">
            View Bookings
          </button>
        </div>

      </div>

    </div>
  );
};

export default OwnerDashboard;