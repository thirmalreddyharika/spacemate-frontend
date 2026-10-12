
import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./index.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Slots from "./pages/Slots";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import ParkingLots from "./pages/ParkingLots";
import Payment from "./pages/Payment";

import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All routes inside this group require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <Home />
              </RoleRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <RoleRoute allowedRoles={["OWNER"]}>
                <OwnerDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/user"
            element={
              <RoleRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </RoleRoute>
            }
          />

          <Route path="/slots" element={<Slots />} />
          <Route path="/parking-lots" element={<ParkingLots />} />
          <Route path="/booking" element={<Booking />} />

          <Route
            path="/booking-confirmation"
            element={<BookingConfirmation />}
          />

          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* Unknown paths */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
