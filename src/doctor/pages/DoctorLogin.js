import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";
// Replace this with your actual doctor image path
import doctorImage from "../images/doclogin.png"; 

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

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Enter valid email (example: abc@gmail.com)";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6) error = "Password must be at least 6 characters";
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);
    
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await response.json();
        
        if (response.ok) {
  console.log("LOGIN RESPONSE:", data);

  // ✅ Use FULL doctor data from backend
  const fullDoctor = data.doc;

  const doctor = {
    id: fullDoctor._id,
    fullName: fullDoctor.fullName,
    email: fullDoctor.email,
    specialization: fullDoctor.specialization,
    status: fullDoctor.status,
    isProfileComplete: fullDoctor.isProfileComplete,
  };

  // ✅ Store doctor
  localStorage.setItem("doctor", JSON.stringify(doctor));

  const status = doctor.status?.toLowerCase();

  // ✅ REDIRECTION LOGIC
  if (status === "rejected") {
    navigate("/DoctorRejected", {
      state: {
        reason: fullDoctor.rejectionReason || "No reason provided",
        doctor,
      },
    });

  } else if (status === "pending") {
    navigate("/DoctorWaiting", {
      state: { doctor },
    });

  } else if (status === "approved") 
    {
      if (doctor.isProfileComplete) {
        navigate("/DoctorDashboard");
      } else {
        navigate("/DoctorProfile");
      }
    }
}else {
          const msg = (data.message || data.msg || "").toLowerCase();
          if (msg.includes("pending") || msg.includes("not approved")) {
            navigate("/DoctorWaiting");
          } else if (msg.includes("reject")) {
            navigate("/DoctorRejected", { state: { reason: data.message || "" } });
          } else {
            setErrors({ password: data.message || data.msg || "Invalid email or password." });
          }
        }
      } catch (error) {
        alert("Server Error");
      }
    }
  };

  return (
    <div className="dr-login-page-wrapper">
      <div className="dr-main-title-box">
        <h1>DOC <span>TOR</span></h1>
        <p className="dr-head-subtext">LOGIN</p>
      </div>

      <div className="dr-login-split-card">
        {/* LEFT SIDE - FORM */}
        <div className="dr-form-container">
          <h2 className="dr-login-title">Login</h2>
          
          {errors.status && <div className="dr-status-alert">{errors.status}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`dr-input-field ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <span className="dr-error-msg">{errors.email}</span>}

            <div className="dr-password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`dr-input-field ${errors.password ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="dr-toggle-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="dr-error-msg">{errors.password}</span>}

            <div className="dr-utility-row">
              <small>
                <input type="checkbox" className="dr-checkbox-style" /> Remember me
              </small>
              <Link to="/DoctorForgotPassword" className="dr-link-teal">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="dr-submit-btn">Login</button>

            <div style={{ textAlign: "center" }}>
              <small style={{ color: "#666" }}>
                Don’t have account? 
                <Link to="/DoctorRegister" className="dr-link-teal" style={{ marginLeft: "5px", fontWeight: "600" }}>
                   Register
                </Link>
              </small>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="dr-image-container">
          <img src={doctorImage} alt="Doctor Login Illustration" />
        </div>
      </div>
    </div>
  );
}