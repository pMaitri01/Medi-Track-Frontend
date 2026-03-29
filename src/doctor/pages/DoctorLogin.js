import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlur = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name === "email") {
    if (!value) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(value)) {
      newErrors.email = "Enter valid email (example: abc@gmail.com)";
    } else {
      delete newErrors.email;
    }
  }

  if (name === "password") {

    if (!value) {
      newErrors.password = "Password is required";
    } else if (value.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  } else {
      delete newErrors.password;
    }
  }

  setErrors(newErrors);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};


  // Stop if errors exist
  if (Object.keys(newErrors).length > 0) return;


  // if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/doctors/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");
        setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
        navigate("/DoctorDashboard");
      } else {
        // Handle status-specific errors
        const msg = data.message || data.msg || "";
        if (msg.toLowerCase().includes("pending") || msg.toLowerCase().includes("not approved")) {
          setErrors({ status: "Your account is not approved yet. Please wait for admin approval." });
        } else if (msg.toLowerCase().includes("reject")) {
          setErrors({ status: "Your registration was rejected. Please contact admin for details." });
        } else {
          setErrors({ ...errors, password: msg || "Invalid email or password." });
        }
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <div className="doctor-login-container">
      <div className="admin-login-card">
        <h2>Doctor's Login</h2>

        <form onSubmit={handleSubmit}>
          {errors.status && (
            <div style={{
              background: errors.status.includes("not approved") ? "#fefce8" : "#fef2f2",
              border: `1px solid ${errors.status.includes("not approved") ? "#fde68a" : "#fecaca"}`,
              color: errors.status.includes("not approved") ? "#92400e" : "#dc2626",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 14,
              lineHeight: 1.5,
            }}>
              {errors.status.includes("not approved") ? "⏳" : "❌"} {errors.status}
            </div>
          )}
          <div className="admin-input-group">
            {/* <label>Email</label> */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

           <div className="admin-input-group">

          {/* wrapper ONLY for input + icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />

            <span
              className="eye-icon-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* error OUTSIDE wrapper */}
          {errors.password && <p className="error">{errors.password}</p>}

        </div>

            <div className="d-flex justify-content-between">
                          <small className="admin-text-rmbr">
                            <input type="checkbox" className="ckb"/> Remember me
                          </small>
                          <small className="admin-text-primary">
                              <Link to="/DoctorForgotPassword" className="admin-text-fpwd">
                                  Forgot Password?
                              </Link>
            
                          </small>
                        </div>

          <button type="submit" className="admin-login-btn">
            Login
          </button>

           <small className="admin-txtregister">
              Don’t have account? 
               {/* <span className="text-primary"> Register</span>  */}
              <Link to="/DoctorSignUp" className="admin-text-primary">
                Register
              </Link>
            </small>

        </form>
      </div>
    </div>
  );
}