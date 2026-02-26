import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import resetImage from "../images/ResetPwd-1.jpeg"; // add a relevant image
import "./ResetPwd.css"; 

export default function ResetPwd() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);




  const handleSubmit = (e) => {
  e.preventDefault();

  if (!password || !confirmPassword) {
    setError("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters long");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  // Password successfully reset
  setError("");
  navigate("/"); // redirect to login page
};


  return (
    <div className="otp-container">
      <div className="otp-wrapper">
        {/* Left Side */}
        <div className="otp-left">
          <img src={resetImage} alt="Reset Password" />
        </div>

        {/* Right Side */}
        <div className="otp-right">
          <div className="otp-card">
            <h2>Change Your Password</h2>

            <form onSubmit={handleSubmit}>
              {/* <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              /> */}
              <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="New Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <span
    className="toggle-eye"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

<div className="password-field">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
  <span
    className="toggle-eye"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

              {error && <p className="otp-error">{error}</p>}

              <button type="submit" className="otp-btn">
                Reset Password
              </button>
            </form>

            <p style={{ marginTop: "15px", fontSize: "14px" }}>
              Remembered your password?{" "}
              <span
                style={{ color: "#0aa5a5", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}