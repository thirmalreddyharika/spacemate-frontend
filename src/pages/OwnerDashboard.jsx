import api from "../api";
import { useEffect, useState } from "react";


export default function OwnerDashboard() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // CHANGE to your real endpoint
        const res = await api.get("/api/owner/spaces");
        console.log("Owner data:", res.data);
        setSpaces(Array.isArray(res.data) ? res.data : res.data?.content || []);
      } catch (err) {
        console.error("Owner dashboard error:", err);
        const status = err.response?.status;
        setError(
          status === 403 ? "Access denied (403). Check backend role/CORS."
          : status === 404 ? "API not found (404). Check the URL."
          : !err.response ? "Cannot reach server. Try again in a minute."
          : `Error ${status}`
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading dashboard…</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Owner Dashboard</h2>
      {spaces.length === 0 ? (
        <p>No spaces added yet.</p>
      ) : (
        spaces.map((s) => (
          <div key={s.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            {/* CHANGE field names to match your entity */}
            <h3>{s.name}</h3>
            <p>{s.location}</p>
            <p>₹{s.price}</p>
          </div>
        ))
      )}
    </div>
  );
}