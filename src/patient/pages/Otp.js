import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import forgotImage from "../images/Otp.jpg";
import "./Otp.css";

export default function OtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");

    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      setError("Please enter complete 4-digit OTP");
      return;
    }

    if (enteredOtp === "1234") {
      navigate("/ResetPwd");
    } else {
      setError("Invalid OTP");
    }
  };
  const handleResend = () => {
  console.log("Resend OTP clicked");
  // Call API here
};


  return (
    <div className="otp-container">
      <div className="otp-wrapper">
        {/* Left Side */}
        <div className="otp-left">
          <img src={forgotImage} alt="OTP Verification" />
        </div>

        {/* Right Side */}
        <div className="otp-right">
          <div className="otp-card">
            <h2>Verify OTP</h2>
            <p>Enter the 4-digit code sent to your email</p>

            <form onSubmit={handleSubmit}>
              <div className="otp-input-group">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              {error && <p className="otp-error">{error}</p>}
              {/* <small>
                <span> Didn't receive code?  </span>
                <a className="text-primary">
                      Resend 
                </a>
              </small> */}
              <div class="resend-container">
                <span>Didn't receive code?</span>
                <button class="resend-btn" onClick={handleResend}>Resend</button>
              </div>

              <button type="submit" className="otp-btn">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
