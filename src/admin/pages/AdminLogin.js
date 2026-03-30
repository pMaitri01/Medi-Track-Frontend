import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";

// Dummy credentials — replace with real API call later
const DUMMY_EMAIL    = "admin@meditrack.com";
const DUMMY_PASSWORD = "Admin@123";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // ── Input change — clear field error on type ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name])  setErrors(p => ({ ...p, [name]: "" }));
    if (authError)     setAuthError("");
  };

  // ── Blur validation ──
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let msg = "";
    if (name === "email") {
      if (!value.trim())
        msg = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        msg = "Enter a valid email address.";
    }
    if (name === "password" && !value)
      msg = "Password is required.";
    if (msg) setErrors(p => ({ ...p, [name]: msg }));
  };

  // ── Full validation before submit ──
  const validate = () => {
    const e = {};
    if (!form.email.trim())
      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (!form.password)
      e.password = "Password is required.";
    return e;
  };

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setAuthError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (form.email === DUMMY_EMAIL && form.password === DUMMY_PASSWORD) {
        navigate("/admin/dashboard");
      } else {
        setAuthError("Invalid email or password. Please try again.");
      }
    }, 1200);
  };

  const isDisabled = !form.email.trim() || !form.password || loading;

  return (
    <div className="al-page">
      <div className="al-card">

        {/* ── Logo / Title ── */}
        <div className="al-brand">
          <div className="al-brand-icon">⚕️</div>
          <div>
            <h1 className="al-brand-title">MediTrack</h1>
            <p className="al-brand-sub">Admin Panel Login</p>
          </div>
        </div>

        {/* ── Auth error banner ── */}
        {authError && (
          <div className="al-auth-error">
            ❌ {authError}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="al-field">
            <label className="al-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="admin@meditrack.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={"al-input" + (errors.email ? " al-input-err" : "")}
              autoComplete="email"
            />
            {errors.email && <span className="al-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="al-field">
            <label className="al-label">Password</label>
            <div className="al-pwd-wrap">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={"al-input" + (errors.password ? " al-input-err" : "")}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="al-eye"
                onClick={() => setShowPwd(p => !p)}
                tabIndex={-1}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="al-error">{errors.password}</span>}
          </div>

          {/* Forgot password */}
          <div className="al-forgot-row">
            <a href="#!" className="al-forgot-link">Forgot Password?</a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="al-submit-btn"
            disabled={isDisabled}
          >
            {loading ? (
              <span className="al-spinner" />
            ) : (
              "Login to Admin Panel"
            )}
          </button>

        </form>

        {/* ── Hint ── */}
        <p className="al-hint">
          Demo credentials: <strong>admin@meditrack.com</strong> / <strong>Admin@123</strong>
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;
