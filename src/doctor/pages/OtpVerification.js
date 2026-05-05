import { useState, useEffect, useRef } from "react";
import "../css/OtpVerification.css";

const TIMER_SEC = 30;

const OtpVerification = ({ email, onBack, onSuccess }) => {
  const [otp, setOtp]         = useState(["", "", "", ""]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer]     = useState(TIMER_SEC);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  // countdown timer
  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;           // only digits
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setOtp(pasted.split(""));
      inputs.current[3]?.focus();
    }
    e.preventDefault();
  };

  const otpValue = otp.join("");

const handleVerify = async () => {
  const otpValue = otp.join("");
  const email = localStorage.getItem("resetEmail");

  if (otpValue.length < 4) {
    setError("Enter valid OTP");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/doctor/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
        credentials:"include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    localStorage.setItem("resetOtp", otpValue);

    onSuccess();
  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
};

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    setError("");
    setTimer(TIMER_SEC);
    setCanResend(false);
    inputs.current[0]?.focus();

     try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/doctor/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    console.log("OTP resent");
  } catch (err) {
    setError("Failed to resend OTP");
  }
  };

  return (
    <div className="dotp-page">
      <div className="dotp-card">
        <div className="dotp-icon">📩</div>
        <h2 className="dotp-title">Verify OTP</h2>
        <p className="dotp-subtitle">
          Enter the 4-digit OTP sent to <strong>{email}</strong>
        </p>

        {/* OTP boxes */}
        <div className="dotp-otp-row" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              className={"dotp-otp-box" + (error ? " dotp-error" : "")}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <p className="dotp-error-text" style={{ textAlign: "center", marginBottom: 8 }}>{error}</p>}

        <button
          className="dotp-btn"
          onClick={handleVerify}
          disabled={otpValue.length < 4 || loading}
          style={{ marginTop: 12 }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="dotp-timer">
          {canResend ? (
            <button className="dotp-resend" onClick={handleResend}>Resend OTP</button>
          ) : (
            <>Resend OTP in <span>{timer}s</span></>
          )}
        </div>

        <div className="dotp-links" style={{ marginTop: 12 }}>
          <button className="dotp-link" onClick={() => onBack("forgot")}>← Back</button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
