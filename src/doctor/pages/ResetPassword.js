import { useState } from "react";
import "../css/ForgotPassword.css";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const getStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/\d/.test(pwd))           score++;
  if (/[@$!%*?&]/.test(pwd))    score++;
  return score;
};

const strengthLabel = ["", "Weak", "Medium", "Medium", "Strong"];
const strengthClass = ["", "weak", "medium", "medium", "strong"];

const ResetPassword = ({ onDone }) => {
  const [pwd, setPwd]         = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState({ pwd: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(pwd);

  const validate = () => {
    const e = {};
    if (!pwd)
      e.pwd = "Password is required.";
    else if (!PWD_REGEX.test(pwd))
      e.pwd = "Min 8 chars with uppercase, lowercase, number and special character.";

    if (!confirm)
      e.confirm = "Please confirm your password.";
    else if (pwd !== confirm)
      e.confirm = "Passwords do not match.";

    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1200);
  };

  const toggle = (field) => setShowPwd(p => ({ ...p, [field]: !p[field] }));

  if (success) {
    return (
      <div className="fp-page">
        <div className="fp-card">
          <div className="fp-success-icon">✅</div>
          <h2 className="fp-title">Password Reset!</h2>
          <p className="fp-subtitle">Your password has been reset successfully.</p>
          <button className="fp-btn" onClick={onDone}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <div className="fp-card">
        <div className="fp-icon">🔒</div>
        <h2 className="fp-title">Reset Password</h2>
        <p className="fp-subtitle">Create a strong new password for your account</p>

        {/* New Password */}
        <div className="fp-field">
          <label className="fp-label">New Password</label>
          <div className="fp-input-wrap">
            <input
              className={"fp-input" + (errors.pwd ? " error" : "")}
              type={showPwd.pwd ? "text" : "password"}
              placeholder="Enter new password"
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setErrors(p => ({ ...p, pwd: "" })); }}
            />
            <button className="fp-eye" onClick={() => toggle("pwd")}>
              {showPwd.pwd ? "🙈" : "👁️"}
            </button>
          </div>
          {/* strength bars */}
          {pwd && (
            <>
              <div className="fp-strength">
                {[1,2,3,4].map(i => (
                  <div key={i} className={"fp-strength-bar" + (i <= strength ? " " + strengthClass[strength] : "")} />
                ))}
              </div>
              <span className={"fp-strength-label " + strengthClass[strength]}>
                {strengthLabel[strength]}
              </span>
            </>
          )}
          {errors.pwd && <span className="fp-error">{errors.pwd}</span>}
        </div>

        {/* Confirm Password */}
        <div className="fp-field">
          <label className="fp-label">Confirm Password</label>
          <div className="fp-input-wrap">
            <input
              className={"fp-input" + (errors.confirm ? " error" : "")}
              type={showPwd.confirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: "" })); }}
            />
            <button className="fp-eye" onClick={() => toggle("confirm")}>
              {showPwd.confirm ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirm && <span className="fp-error">{errors.confirm}</span>}
        </div>

        <button
          className="fp-btn"
          onClick={handleSubmit}
          disabled={!pwd || !confirm || loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
