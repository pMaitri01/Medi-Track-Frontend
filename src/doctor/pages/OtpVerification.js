import { useState, useEffect, useRef } from "react";
import "../css/ForgotPassword.css";

const DUMMY_OTP = "1234";
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

  const handleVerify = () => {
    if (!otpValue)           { setError("OTP is required."); return; }
    if (otpValue.length < 4) { setError("Enter valid 4-digit OTP."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otpValue === DUMMY_OTP) {
        onSuccess();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 1200);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimer(TIMER_SEC);
    setCanResend(false);
    inputs.current[0]?.focus();
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-icon">📩</div>
        <h2 className="fp-title">Verify OTP</h2>
        <p className="fp-subtitle">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        {/* OTP boxes */}
        <div className="fp-otp-row" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              className={"fp-otp-box" + (error ? " error" : "")}
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

        {error && <p className="fp-error" style={{ textAlign: "center", marginBottom: 8 }}>{error}</p>}

        <button
          className="fp-btn"
          onClick={handleVerify}
          disabled={otpValue.length < 6 || loading}
          style={{ marginTop: 12 }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="fp-timer">
          {canResend ? (
            <button className="fp-resend" onClick={handleResend}>Resend OTP</button>
          ) : (
            <>Resend OTP in <span>{timer}s</span></>
          )}
        </div>

        <div className="fp-links" style={{ marginTop: 12 }}>
          <button className="fp-link" onClick={() => onBack("forgot")}>← Back</button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
