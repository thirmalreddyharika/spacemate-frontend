
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      if (!data.token || !data.user) {
        setError("The server did not return a token and user.");
        return;
      }

      const role = String(data.user.role || "").toUpperCase();

      if (!["ADMIN", "OWNER", "USER"].includes(role)) {
        setError("Your account has an invalid role.");
        return;
      }

      login(data.token, { ...data.user, role });

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "OWNER") {
        navigate("/owner", { replace: true });
      } else {
        const from = location.state?.from;

        navigate(
          from && from.startsWith("/") && !from.startsWith("//")
            ? from
            : "/",
          { replace: true }
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="login-box">
        <h2>Login to SpaceMate</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
