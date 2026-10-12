import { useNavigate } from "react-router-dom";

const ParkingLotCard = ({ lot }) => {

  const navigate = useNavigate();

  return (
    <div className="card shadow-sm h-100">

      <div className="card-body">

        <h5 className="card-title text-primary">
          {lot.name}
        </h5>

        <p className="card-text">
          📍 {lot.location}
        </p>

        <p>
          🅿️ Total Slots: {lot.totalSlots}
        </p>

        <p>
          💰 Price: ₹{lot.pricePerHour}/hour
        </p>

        <p>
          Status:
          <span className="badge bg-success ms-2">
            {lot.status || "ACTIVE"}
          </span>
        </p>

        <button
          className="btn btn-primary w-100"
          onClick={() => navigate(`/slots/${lot.id}`)}
        >
          View Slots
        </button>

      </div>
    </div>
  );
};

export default ParkingLotCard;