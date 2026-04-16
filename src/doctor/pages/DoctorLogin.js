import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/DoctorLogin.css";
import { useDoctor } from "../../context/DoctorContext";
import doctorImage from "../images/doclogin.png";

export default function DoctorLogin() {
  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setDoctor } = useDoctor();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Enter valid email (example: abc@gmail.com)";
    }
    if (name === "password") {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleBlur = (e) => {
    const error = validateField(e.target.name, e.target.value);
    setErrors((prev) => ({ ...prev, [e.target.name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateField("email",    formData.email);
    const passErr  = validateField("password", formData.password);
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/doctor/login`,
        {
          method:      "POST",
          headers:     { "Content-Type": "application/json" },
          credentials: "include",
          body:        JSON.stringify({ email: formData.email, password: formData.password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const fullDoctor = data.doc || data.doctor || data.data;

        if (!fullDoctor) {
          setErrors({ status: "Invalid server response" });
          return;
        }

        const status = (fullDoctor.status || "").toLowerCase();

        const doctor = {
          id:                fullDoctor._id,
          fullName:          fullDoctor.fullName,
          email:             fullDoctor.email,
          specialization:    fullDoctor.specialization,
          status,
          isProfileComplete: fullDoctor.isProfileComplete,
        };

        localStorage.setItem("doctor", JSON.stringify(doctor));
        setDoctor(doctor);

        if (status === "pending") {
          navigate("/DoctorWaiting", { state: { doctor } });
        } else if (status === "rejected") {
          navigate("/DoctorRejected", {
            state: { reason: fullDoctor.rejectionReason || "No reason provided", doctor },
          });
        } else if (status === "approved") {
          navigate(doctor.isProfileComplete ? "/DoctorDashboard" : "/DoctorProfile");
        } else {
          setErrors({ status: "Unknown doctor status" });
        }
      } else {
        const msg = (data.message || data.msg || "").toLowerCase();
        if (msg.includes("pending") || msg.includes("not approved")) {
          navigate("/DoctorWaiting");
        } else if (msg.includes("reject")) {
          navigate("/DoctorRejected", { state: { reason: data.message || "" } });
        } else {
          setErrors({ password: data.message || data.msg || "Invalid email or password." });
        }
      }
    } catch {
      setErrors({ status: "Server error. Please try again." });
    }
  };

  return (
    <div className="dlogin-page-wrapper">
      <div className="dlogin-main-title-box">
        <h1>DOC <span>TOR</span></h1>
        <p className="dlogin-head-subtext">LOGIN</p>
      </div>

      <div className="dlogin-split-card">

        {/* LEFT — Form */}
        <div className="dlogin-form-container">
          <h2 className="dlogin-title">Login</h2>

          {errors.status && (
            <div className="dlogin-status-alert">{errors.status}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`dlogin-input-field${errors.email ? " is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <span className="dlogin-error-msg">{errors.email}</span>
            )}

            <div className="dlogin-password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`dlogin-input-field${errors.password ? " is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span
                className="dlogin-toggle-eye-icon"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <span className="dlogin-error-msg">{errors.password}</span>
            )}

            <div className="dlogin-utility-row">
              <small>
                <input type="checkbox" className="dlogin-checkbox-style" /> Remember me
              </small>
              <Link to="/DoctorForgotPassword" className="dlogin-link-teal">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="dlogin-submit-btn">Login</button>

            <div style={{ textAlign: "center" }}>
              <small style={{ color: "#666" }}>
                Don't have account?{" "}
                <Link
                  to="/DoctorRegister"
                  className="dlogin-link-teal"
                  style={{ marginLeft: "5px", fontWeight: "600" }}
                >
                  Register
                </Link>
              </small>
            </div>
          </form>
        </div>

        {/* RIGHT — Image */}
        <div className="dlogin-image-container">
          <img src={doctorImage} alt="Doctor Login Illustration" />
        </div>

      </div>
    </div>
  );
}
