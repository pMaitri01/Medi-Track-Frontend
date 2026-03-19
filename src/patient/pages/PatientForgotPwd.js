import React, { useState } from "react";
import forgotImage from "../images/forgotpwd.png";
import "../css/PatientForgotPwd.css";
import { useNavigate } from "react-router-dom";


export default function PatientForgotPwd() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Empty validation
    if (!email) {
      setError("Email Is Required");
      return;
    }

    // Format validation
    if (!validateEmail(email)) {
      setError("Please Enter A Valid Email Address");
      return;
    }

    // If valid
    setError("");
    navigate("/PatientOtp");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <div className="forgot-left">
          <img src={forgotImage} alt="Forgot Password" />
        </div>

        <div className="forgot-right">
          <div className="forgot-card">
            <h3>Enter your email to receive OTP</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // clear error while typing
                }}
                className={error ? "input-error" : ""}
              />

              {error && <p className="error-text">{error}</p>}
            
              <button type="submit">
                Send OTP
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
