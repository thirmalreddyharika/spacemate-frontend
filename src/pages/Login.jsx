import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email: email.trim(), password });
      const token = res.data.token || res.data.jwt || res.data.accessToken;
      const userData = res.data.user || {
        id: res.data.userId,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      };
      const role = String(userData.role || res.data.role || "")
        .replace("ROLE_", "")
        .toUpperCase();

      if (!token || !["ADMIN", "OWNER", "USER"].includes(role)) {
        setError("Invalid login response from server.");
        return;
      }

      login(token, { ...userData, role });

      navigate(role === "ADMIN" ? "/admin" : role === "OWNER" ? "/owner" : "/user");
    } catch (err) {
      console.error(err);
      setError(
        !err.response ? "Server not reachable. Wait a minute and try again."
        : err.response.status === 401 || err.response.status === 403 ? "Wrong email or password."
        : `Login failed (${err.response.status})`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", padding: 24, border: "1px solid #ddd", borderRadius: 10 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10 }} />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10 }} />
        <button type="submit" disabled={loading} style={{ padding: 10, cursor: "pointer" }}>
          {loading ? "Logging in…" : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}