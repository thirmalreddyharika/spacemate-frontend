
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
        setError("Invalid response from server.");
        return;
      }

      const role = String(
        data.user.role || ""
      ).toUpperCase();

      if (!["ADMIN", "OWNER", "USER"].includes(role)) {
        setError("Invalid account role.");
        return;
      }

      login(data.token, {
        ...data.user,
        role,
      });

      // Always send each role to its permitted dashboard.
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
        return;
      }

      if (role === "OWNER") {
        navigate("/owner", { replace: true });
        return;
      }

      const from = location.state?.from;

      // Only restore a local application path.
      const safePath =
        typeof from === "string" &&
        from.startsWith("/") &&
        !from.startsWith("//")
          ? from
          : "/user";

      navigate(safePath, { replace: true });
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

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
