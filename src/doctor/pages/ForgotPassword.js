import { useState } from "react";
import "../css/ForgotPassword.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = ({ onBack, onNext }) => {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const validate = () => {
    if (!email.trim())              return "Email is required.";
    if (!EMAIL_REGEX.test(email))   return "Enter a valid email address.";
    return "";
  };

 const handleSubmit = async () => {
  const err = validate();
  if (err) { setError(err); return; }

  setLoading(true);

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/doctor/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    localStorage.setItem("resetEmail", email);

    setDone(true);
  } catch (err) {
    setError("Something went wrong");
  }

  setLoading(false);
};

  if (done) {
    return (
      <div className="fp-page">
        <div className="fp-card">
          <div className="fp-success-icon">📧</div>
          <h2 className="fp-title">OTP Sent!</h2>
          <p className="fp-subtitle">
            We've sent a 4-digit OTP to <strong>{email}</strong>. Check your inbox.
          </p>
          <button className="fp-btn" onClick={() => onNext(email)}>
            Continue to Verify OTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-icon">🔑</div>
        <h2 className="fp-title">Forgot Password</h2>
        <p className="fp-subtitle">Enter your registered email to receive OTP</p>

        <div className="fp-field">
          <label className="fp-label">Email Address</label>
          <input
            className={"fp-input" + (error ? " error" : "")}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <span className="fp-error">{error}</span>}
        </div>

        <button
          className="fp-btn"
          onClick={handleSubmit}
          disabled={!email.trim() || loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <div className="fp-links">
          <button className="fp-link" onClick={() => onBack("login")}>← Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
