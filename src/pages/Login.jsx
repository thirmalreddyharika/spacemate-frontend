import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await API.post("/auth/login", {
        email,
        password
      });

      const data = response.data;

      /*
       Expected backend response:

       {
         token: "...",
         user: {
           id: 1,
           name: "...",
           email: "...",
           role: "USER"
         }
       }
      */

      login(data.token, data.user);

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (data.user.role === "OWNER") {
        navigate("/owner");
      } else {
        navigate("/");
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="text-center mb-4">
          Login
        </h2>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label>Email</label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label>Password</label>

            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-3">

          Don't have an account?
          {" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;