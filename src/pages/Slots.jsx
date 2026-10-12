import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

const Slots = () => {

  const { lotId } = useParams();

  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);

  const [lot, setLot] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, [lotId]);

  const fetchSlots = async () => {

    try {

      let lotData = null;
      try {
        const lotResponse = await API.get(`/lots/${lotId}`);
        lotData = lotResponse.data;
      } catch {
        const lotResponse = await API.get(`/parking-lots/${lotId}`);
        lotData = lotResponse.data;
      }
      setLot(lotData);

      let slotData = [];
      try {
        const slotResponse = await API.get(`/slots/lot/${lotId}`);
        slotData = slotResponse.data;
      } catch {
        const slotResponse = await API.get(`/parking-lots/${lotId}/slots`);
        slotData = slotResponse.data;
      }
      setSlots(Array.isArray(slotData) ? slotData : []);

    } catch (error) {

      console.error("Error fetching slots:", error);

    } finally {

      setLoading(false);

    }
  };

  const selectSlot = (slot) => {

    if (
      slot.status === "AVAILABLE" ||
      slot.available === true
    ) {
      navigate("/booking", {
        state: {
          lot,
          slot
        }
      });
    }

  };

  return (
    <div className="container py-5">

      {lot && (
        <div className="mb-4">

          <h2>
            {lot.name}
          </h2>

          <p>
            📍 {lot.location}
          </p>

          <p>
            💰 ₹{lot.pricePerHour}/hour
          </p>

        </div>
      )}

      <h4 className="mb-4">
        Select Parking Slot
      </h4>

      {loading ? (
        <p>Loading slots...</p>
      ) : (

        <div className="row g-3">

          {slots.map((slot) => {

            const available =
              slot.status === "AVAILABLE" ||
              slot.available === true;

            return (

              <div
                className="col-6 col-md-3"
                key={slot.id}
              >

                <button
                  className={`slot-box ${
                    available
                      ? "slot-available"
                      : "slot-unavailable"
                  }`}
                  onClick={() =>
                    selectSlot(slot)
                  }
                  disabled={!available}
                >

                  <h5>
                    {slot.slotNumber}
                  </h5>

                  <small>
                    {available
                      ? "Available"
                      : "Occupied"}
                  </small>

                </button>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
};

export default Slots;