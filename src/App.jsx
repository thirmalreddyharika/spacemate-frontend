import React, { useState } from "react";
import "./index.css";

function App() {

  // Current page
  const [page, setPage] = useState("home");

  // Parking slots
  const [slots, setSlots] = useState([
    { id: 1, name: "Slot 1", available: true },
    { id: 2, name: "Slot 2", available: true },
    { id: 3, name: "Slot 3", available: true },
    { id: 4, name: "Slot 4", available: true },
    { id: 5, name: "Slot 5", available: true },
    { id: 6, name: "Slot 6", available: true },
  ]);

  // Selected slot
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Confirmed booking
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Login information
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // -----------------------------
  // SELECT SLOT
  // -----------------------------

  const selectSlot = (slot) => {

    if (!slot.available) {
      return;
    }

    setSelectedSlot(slot);
    setBookingConfirmed(false);

    setPage("booking");
  };


  // -----------------------------
  // CONFIRM BOOKING
  // -----------------------------

  const confirmBooking = () => {

    if (!selectedSlot) {
      return;
    }

    // Make selected slot occupied
    setSlots((previousSlots) =>
      previousSlots.map((slot) =>
        slot.id === selectedSlot.id
          ? { ...slot, available: false }
          : slot
      )
    );

    setBookingConfirmed(true);
  };


  // -----------------------------
  // LOGIN
  // -----------------------------

  const handleLogin = (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    // Get name from email
    const name = email.split("@")[0];

    setUserEmail(email);
    setUserName(name);

    setIsLoggedIn(true);

    setPage("home");
  };


  // -----------------------------
  // LOGOUT
  // -----------------------------

  const handleLogout = () => {

    setIsLoggedIn(false);
    setUserEmail("");
    setUserName("");

    setPage("home");
  };


  return (
    <div>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        >
          SpaceMate
        </div>

        <div className="nav-links">

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("slots")}>
            Available Slots
          </button>

          <button onClick={() => setPage("bookings")}>
            My Bookings
          </button>

          <button onClick={() => setPage("login")}>
            {isLoggedIn ? "My Account" : "Login"}
          </button>

        </div>

      </nav>


      {/* ================= HOME ================= */}

      {page === "home" && (

        <section className="hero">

          <h1>
            Welcome to SpaceMate
          </h1>

          <p>
            Smart and simple space booking at your fingertips.
          </p>

          {isLoggedIn && (
            <p className="welcome-user">
              Welcome, <strong>{userName}</strong>!
            </p>
          )}

          <button
            className="primary-btn"
            onClick={() => setPage("slots")}
          >
            View Available Slots
          </button>

        </section>

      )}


      {/* ================= AVAILABLE SLOTS ================= */}

      {page === "slots" && (

        <section className="section">

          <h2>
            Available Slots
          </h2>

          <div className="slots">

            {slots.map((slot) => (

              <div
                className="slot-card"
                key={slot.id}
              >

                <h3>
                  {slot.name}
                </h3>

                <p
                  className={
                    slot.available
                      ? "available"
                      : "occupied"
                  }
                >
                  {slot.available
                    ? "Available"
                    : "Occupied"}
                </p>

                <button
                  className="select-btn"
                  disabled={!slot.available}
                  onClick={() => selectSlot(slot)}
                >
                  {slot.available
                    ? "Select Slot"
                    : "Occupied"}
                </button>

              </div>

            ))}

          </div>

        </section>

      )}


      {/* ================= BOOKING ================= */}

      {page === "booking" && selectedSlot && (

        <section className="section">

          <h2>
            Confirm Booking
          </h2>

          <div className="booking">

            <p>
              <strong>
                Selected Slot:
              </strong>{" "}
              {selectedSlot.name}
            </p>

            <p>
              <strong>
                User:
              </strong>{" "}
              {isLoggedIn
                ? userEmail
                : "Guest"}
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {bookingConfirmed
                ? "Confirmed"
                : "Available"}
            </p>


            {!bookingConfirmed && (

              <button
                className="primary-btn"
                onClick={confirmBooking}
              >
                Confirm Booking
              </button>

            )}


            {bookingConfirmed && (

              <div>

                <p className="success">
                  ✓ Booking confirmed successfully!
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setPage("bookings")}
                >
                  View My Booking
                </button>

              </div>

            )}

          </div>

        </section>

      )}


      {/* ================= MY BOOKINGS ================= */}

      {page === "bookings" && (

        <section className="section">

          <h2>
            My Bookings
          </h2>


          {bookingConfirmed && selectedSlot ? (

            <div className="booking">

              <h3>
                Booking Details
              </h3>

              <p>
                <strong>
                  User:
                </strong>{" "}
                {userEmail || "Guest"}
              </p>

              <p>
                <strong>
                  Slot:
                </strong>{" "}
                {selectedSlot.name}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                <span className="available">
                  Confirmed
                </span>
              </p>

              <p>
                <strong>
                  Booking Type:
                </strong>{" "}
                Parking Space
              </p>

            </div>

          ) : (

            <div className="booking">

              <p>
                You don't have any confirmed
                bookings yet.
              </p>

              <button
                className="primary-btn"
                onClick={() => setPage("slots")}
              >
                Book a Slot
              </button>

            </div>

          )}

        </section>

      )}


      {/* ================= LOGIN ================= */}

      {page === "login" && (

        <section className="section">

          <div className="login-box">

            {!isLoggedIn ? (

              <>

                <h2>
                  Login to SpaceMate
                </h2>

                <form
                  onSubmit={handleLogin}
                >

                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="submit"
                    className="primary-btn"
                  >
                    Login
                  </button>

                </form>

              </>

            ) : (

              <>

                <h2>
                  My Account
                </h2>

                <div className="account-info">

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {userName}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {userEmail}
                  </p>

                  <p className="success">
                    ✓ Logged in successfully
                  </p>

                </div>

                <button
                  className="primary-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>

            )}

          </div>

        </section>

      )}


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <p>
          © 2026 SpaceMate. Smart Space Booking System.
        </p>

      </footer>

    </div>
  );
}

export default App;