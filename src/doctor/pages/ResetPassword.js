import { useState } from "react";
import "../css/ResetPassword.css";

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
const strengthClass = ["", "drpwd-weak", "drpwd-medium", "drpwd-medium", "drpwd-strong"];

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
      <div className="drpwd-page">
        <div className="drpwd-card">
          <div className="drpwd-success-icon">✅</div>
          <h2 className="drpwd-title">Password Reset!</h2>
          <p className="drpwd-subtitle">Your password has been reset successfully.</p>
          <button className="drpwd-btn" onClick={onDone}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="drpwd-page">
      <div className="drpwd-card">
        <div className="drpwd-icon">🔒</div>
        <h2 className="drpwd-title">Reset Password</h2>
        <p className="drpwd-subtitle">Create a strong new password for your account</p>

        {/* New Password */}
        <div className="drpwd-field">
          <label className="drpwd-label">New Password</label>
          <div className="drpwd-input-wrap">
            <input
              className={"drpwd-input" + (errors.pwd ? " drpwd-error" : "")}
              type={showPwd.pwd ? "text" : "password"}
              placeholder="Enter new password"
              value={pwd}
              onChange={(e) => { setPwd(e.target.value); setErrors(p => ({ ...p, pwd: "" })); }}
            />
            <button className="drpwd-eye" onClick={() => toggle("pwd")}>
              {showPwd.pwd ? "🙈" : "👁️"}
            </button>
          </div>
          {/* strength bars */}
          {pwd && (
            <>
              <div className="drpwd-strength">
                {[1,2,3,4].map(i => (
                  <div key={i} className={"drpwd-strength-bar" + (i <= strength ? " " + strengthClass[strength] : "")} />
                ))}
              </div>
              <span className={"drpwd-strength-label " + strengthClass[strength]}>
                {strengthLabel[strength]}
              </span>
            </>
          )}
          {errors.pwd && <span className="drpwd-error-text">{errors.pwd}</span>}
        </div>

        {/* Confirm Password */}
        <div className="drpwd-field">
          <label className="drpwd-label">Confirm Password</label>
          <div className="drpwd-input-wrap">
            <input
              className={"drpwd-input" + (errors.confirm ? " drpwd-error" : "")}
              type={showPwd.confirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: "" })); }}
            />
            <button className="drpwd-eye" onClick={() => toggle("confirm")}>
              {showPwd.confirm ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirm && <span className="drpwd-error-text">{errors.confirm}</span>}
        </div>

        <button
          className="drpwd-btn"
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
