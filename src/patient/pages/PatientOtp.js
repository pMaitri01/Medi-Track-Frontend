import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import forgotImage from "../images/Otp.jpg";
import "../css/PatientOtp.css";

export default function PatientOtp() {
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

  const handleSubmit = async (e) => {
  e.preventDefault();

  const enteredOtp = otp.join("");

  if (enteredOtp.length < 4) {
    setError("Please enter complete 4-digit OTP");
    return;
  }

  const email = localStorage.getItem("resetEmail");

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/patient/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    // ✅ store OTP for next step
    localStorage.setItem("resetOtp", enteredOtp);

    navigate("/PatientResetPwd");

  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  }
};
 const handleResend = async () => {
  const email = localStorage.getItem("resetEmail");

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/patient/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
    } else {
      alert("OTP resent successfully");
    }

  } catch (err) {
    console.error(err);
    setError("Error resending OTP");
  }
};


  return (
    <div className="PatOtp-otp-container">
      <div className="PatOtp-otp-wrapper">
        {/* Left Side */}
        <div className="PatOtp-otp-left">
          <img src={forgotImage} alt="OTP Verification" />
        </div>

        {/* Right Side */}
        <div className="PatOtp-otp-right">
          <div className="PatOtp-otp-card">
            <h2>Verify OTP</h2>
            <p>Enter the 4-digit code sent to your email</p>

            <form onSubmit={handleSubmit}>
              <div className="PatOtp-otp-input-group">
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

              {error && <p className="PatOtp-otp-error">{error}</p>}
              {/* <small>
                <span> Didn't receive code?  </span>
                <a className="PatOtp-text-primary">
                      Resend 
                </a>
              </small> */}
              <div class="resend-container">
                <span>Didn't receive code?</span>
                <button class="resend-btn" onClick={handleResend}>Resend</button>
              </div>

              <button type="submit" className="PatOtp-otp-btn">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
