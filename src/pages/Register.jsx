import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      await API.post("/auth/register", formData);

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="text-center mb-4">
          Create Account
        </h2>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Name</label>

            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>

            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Register As</label>

            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">User</option>
              <option value="OWNER">Parking Lot Owner</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-3">
          Already have an account?
          {" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;