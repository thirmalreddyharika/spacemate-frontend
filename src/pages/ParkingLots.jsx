
import { useMemo, useState } from "react";

const initialParkingLots = [
  {
    id: 1,
    name: "Central Parking",
    location: "City Center",
    totalSpaces: 120,
    availableSpaces: 35,
    pricePerHour: 30,
    status: "Open",
  },
  {
    id: 2,
    name: "Tech Park Parking",
    location: "Technology District",
    totalSpaces: 200,
    availableSpaces: 72,
    pricePerHour: 40,
    status: "Open",
  },
  {
    id: 3,
    name: "Metro Parking",
    location: "Metro Station",
    totalSpaces: 80,
    availableSpaces: 0,
    pricePerHour: 25,
    status: "Full",
  },
  {
    id: 4,
    name: "Mall Parking",
    location: "Shopping District",
    totalSpaces: 150,
    availableSpaces: 48,
    pricePerHour: 35,
    status: "Open",
  },
  {
    id: 5,
    name: "Airport Parking",
    location: "Airport Road",
    totalSpaces: 250,
    availableSpaces: 96,
    pricePerHour: 50,
    status: "Open",
  },
  {
    id: 6,
    name: "Residential Parking",
    location: "Green Avenue",
    totalSpaces: 60,
    availableSpaces: 12,
    pricePerHour: 20,
    status: "Open",
  },
];

export default function ParkingLots() {
  const [parkingLots] = useState(initialParkingLots);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedLot, setSelectedLot] = useState(null);
  const [hours, setHours] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");

  const filteredLots = useMemo(() => {
    return parkingLots.filter((lot) => {
      const matchesSearch =
        lot.name.toLowerCase().includes(search.toLowerCase()) ||
        lot.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Available" && lot.availableSpaces > 0) ||
        (filter === "Full" && lot.availableSpaces === 0);

      return matchesSearch && matchesFilter;
    });
  }, [parkingLots, search, filter]);

  const totalSpaces = parkingLots.reduce(
    (sum, lot) => sum + lot.totalSpaces,
    0
  );

  const availableSpaces = parkingLots.reduce(
    (sum, lot) => sum + lot.availableSpaces,
    0
  );

  function handleBooking(lot) {
    if (lot.availableSpaces === 0) {
      setBookingMessage("Sorry, this parking lot is full.");
      return;
    }

    setSelectedLot(lot);
    setHours(1);
    setBookingMessage("");
  }

  function confirmBooking() {
    if (!selectedLot || selectedLot.availableSpaces <= 0) {
      setBookingMessage("No parking spaces are available.");
      return;
    }

    setBookingMessage(
      `Demo booking prepared for ${selectedLot.name} for ${hours} hour(s). Connect your booking API to confirm a real reservation.`
    );
    setSelectedLot(null);
  }

  return (
    <main className="parking-page">
      <style>{`
        .parking-page {
          min-height: 100vh;
          padding: 32px;
          background: #f5f7fb;
          color: #172033;
          font-family: Arial, Helvetica, sans-serif;
          box-sizing: border-box;
        }

        .parking-page * {
          box-sizing: border-box;
        }

        .parking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .parking-header h1 {
          margin: 0 0 8px;
          font-size: 30px;
        }

        .parking-header p {
          margin: 0;
          color: #64748b;
        }

        .parking-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 28px;
        }

        .parking-stat {
          background: white;
          border: 1px solid #e5eaf2;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.03);
        }

        .parking-stat span {
          display: block;
          color: #64748b;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .parking-stat strong {
          font-size: 28px;
        }

        .parking-toolbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .parking-search {
          flex: 1;
          min-width: 220px;
        }

        .parking-search input,
        .parking-toolbar select,
        .parking-modal select {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d8dfeb;
          border-radius: 9px;
          background: white;
          color: #172033;
          font-size: 14px;
          outline: none;
        }

        .parking-search input:focus,
        .parking-toolbar select:focus,
        .parking-modal select:focus {
          border-color: #4f46e5;
        }

        .parking-toolbar select {
          width: 170px;
        }

        .parking-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .parking-card {
          background: white;
          border: 1px solid #e5eaf2;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.03);
        }

        .parking-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
        }

        .parking-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 23px;
        }

        .parking-status {
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .parking-status.open {
          color: #047857;
          background: #d1fae5;
        }

        .parking-status.full {
          color: #b91c1c;
          background: #fee2e2;
        }

        .parking-card h2 {
          margin: 0 0 8px;
          font-size: 19px;
        }

        .parking-location {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 20px;
        }

        .parking-info {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #edf0f5;
          font-size: 14px;
        }

        .parking-info span {
          color: #64748b;
        }

        .parking-info strong {
          text-align: right;
        }

        .parking-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin: 20px 0;
        }

        .parking-price strong {
          font-size: 25px;
        }

        .parking-price span {
          color: #64748b;
          font-size: 13px;
        }

        .parking-button {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 9px;
          background: #4f46e5;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .parking-button:hover {
          background: #4338ca;
        }

        .parking-button:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .parking-empty {
          grid-column: 1 / -1;
          background: white;
          padding: 40px 20px;
          border-radius: 14px;
          text-align: center;
          color: #64748b;
        }

        .parking-message {
          margin-bottom: 18px;
          padding: 14px;
          border-radius: 9px;
          background: #eef2ff;
          color: #3730a3;
          line-height: 1.5;
        }

        .parking-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: grid;
          place-items: center;
          padding: 20px;
          z-index: 1000;
        }

        .parking-modal {
          width: 100%;
          max-width: 440px;
          background: white;
          padding: 26px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .parking-modal h2 {
          margin: 0 0 10px;
        }

        .parking-modal p {
          color: #64748b;
          line-height: 1.5;
        }

        .parking-modal label {
          display: block;
          font-weight: 600;
          margin: 18px 0 8px;
        }

        .parking-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 22px;
        }

        .parking-secondary-button {
          flex: 1;
          padding: 12px;
          border: 1px solid #d8dfeb;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        .parking-modal-actions .parking-button {
          flex: 1;
        }

        @media (max-width: 1000px) {
          .parking-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .parking-page {
            padding: 18px;
          }

          .parking-header h1 {
            font-size: 25px;
          }

          .parking-stats {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .parking-stat {
            padding: 18px;
          }

          .parking-stat strong {
            font-size: 24px;
          }

          .parking-grid {
            grid-template-columns: 1fr;
          }

          .parking-toolbar select {
            width: 100%;
          }
        }
      `}</style>

      <header className="parking-header">
        <div>
          <h1>Parking Lots</h1>
          <p>Find available parking spaces and compare hourly rates.</p>
        </div>
      </header>

      <section className="parking-stats" aria-label="Parking statistics">
        <div className="parking-stat">
          <span>Total parking lots</span>
          <strong>{parkingLots.length}</strong>
        </div>

        <div className="parking-stat">
          <span>Available spaces</span>
          <strong>{availableSpaces}</strong>
        </div>

        <div className="parking-stat">
          <span>Total spaces</span>
          <strong>{totalSpaces}</strong>
        </div>
      </section>

      {bookingMessage && (
        <div className="parking-message" role="status">
          {bookingMessage}
        </div>
      )}

      <section className="parking-toolbar" aria-label="Search parking lots">
        <div className="parking-search">
          <input
            type="search"
            placeholder="Search by parking lot or location..."
            aria-label="Search parking lots"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          aria-label="Filter parking lots"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="All">All parking lots</option>
          <option value="Available">Available spaces</option>
          <option value="Full">Full parking lots</option>
        </select>
      </section>

      <section className="parking-grid" aria-label="Parking lot results">
        {filteredLots.length > 0 ? (
          filteredLots.map((lot) => (
            <article className="parking-card" key={lot.id}>
              <div className="parking-card-top">
                <div className="parking-icon" aria-hidden="true">
                  P
                </div>

                <span
                  className={`parking-status ${
                    lot.availableSpaces > 0 ? "open" : "full"
                  }`}
                >
                  {lot.availableSpaces > 0 ? "Available" : "Full"}
                </span>
              </div>

              <h2>{lot.name}</h2>
              <p className="parking-location">📍 {lot.location}</p>

              <div className="parking-info">
                <span>Available spaces</span>
                <strong>{lot.availableSpaces}</strong>
              </div>

              <div className="parking-info">
                <span>Total spaces</span>
                <strong>{lot.totalSpaces}</strong>
              </div>

              <div className="parking-price">
                <strong>₹{lot.pricePerHour}</strong>
                <span>/ hour</span>
              </div>

              <button
                type="button"
                className="parking-button"
                disabled={lot.availableSpaces === 0}
                onClick={() => handleBooking(lot)}
              >
                {lot.availableSpaces > 0
                  ? "Book Parking"
                  : "Parking Full"}
              </button>
            </article>
          ))
        ) : (
          <div className="parking-empty">
            <h2>No parking lots found</h2>
            <p>Try another search term or change the filter.</p>
          </div>
        )}
      </section>

      {selectedLot && (
        <div
          className="parking-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLot(null);
            }
          }}
        >
          <section
            className="parking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="parking-modal-title"
          >
            <h2 id="parking-modal-title">Book Parking</h2>

            <p>
              You selected <strong>{selectedLot.name}</strong> at{" "}
              {selectedLot.location}.
            </p>

            <div className="parking-info">
              <span>Rate</span>
              <strong>₹{selectedLot.pricePerHour}/hour</strong>
            </div>

            <label htmlFor="parking-hours">Parking duration</label>

            <select
              id="parking-hours"
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((hour) => (
                <option key={hour} value={hour}>
                  {hour} {hour === 1 ? "hour" : "hours"}
                </option>
              ))}
            </select>

            <div className="parking-price">
              <strong>₹{selectedLot.pricePerHour * hours}</strong>
              <span>estimated total</span>
            </div>

            <div className="parking-modal-actions">
              <button
                type="button"
                className="parking-secondary-button"
                onClick={() => setSelectedLot(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="parking-button"
                onClick={confirmBooking}
              >
                Continue
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
