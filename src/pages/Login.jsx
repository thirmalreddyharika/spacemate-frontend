
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

      if (!data || !data.token) {
        setError("Invalid response from server. Missing authentication token.");
        return;
      }

      // Support both nested user object and flat backend response
      const userObj = data.user || {
        id: data.userId,
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      const role = String(
        userObj.role || data.role || ""
      ).toUpperCase();

      if (!["ADMIN", "OWNER", "USER"].includes(role)) {
        setError("Invalid account role.");
        return;
      }

      login(data.token, {
        ...userObj,
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
      const serverMessage =
        err.response?.data?.message ||
        (err.response?.data && typeof err.response.data === "object"
          ? Object.values(err.response.data)[0]
          : null) ||
        err.message ||
        "Login failed. Check your email and password.";
      setError(serverMessage);
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
