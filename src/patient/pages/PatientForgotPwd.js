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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    setError("Email Is Required");
    return;
  }

  if (!validateEmail(email)) {
    setError("Please Enter A Valid Email Address");
    return;
  }

  setError("");

  try {
    console.log(process.env.REACT_APP_API_URL);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/patient/send-otp`, 
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    // store email for next page
    localStorage.setItem("resetEmail", email);

    navigate("/PatientOtp");

  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  }
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
