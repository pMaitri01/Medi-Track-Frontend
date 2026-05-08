import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "../css/PatientRegistration.css";
import registerImage from "../images/register.jpeg";

// ── Validation helpers ────────────────────────────────────────────────────────
const ALPHA_RE = /^[A-Za-z]+$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\d{10}$/;
const PASS_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

function validate(formData) {
  const e = {};

  if (!ALPHA_RE.test(formData.firstName))
    e.firstName = "First name must contain only alphabets.";

  if (!ALPHA_RE.test(formData.lastName))
    e.lastName = "Last name must contain only alphabets.";

  if (!formData.gender)
    e.gender = "Please select a gender.";

  if (!formData.dob)
    e.dob = "Date of birth is required.";

  if (!PHONE_RE.test(formData.mobile))
    e.mobile = "Mobile number must be exactly 10 digits.";

  if (!EMAIL_RE.test(formData.email))
    e.email = "Enter a valid email address (e.g. abc@gmail.com).";

  if (!formData.address.trim())
    e.address = "Address is required.";

  if (!PASS_RE.test(formData.password))
    e.password = "Password must be 6+ chars with uppercase, lowercase, number & special character.";

  if (formData.password !== formData.confirmPassword)
    e.confirmPassword = "Passwords do not match.";

  return e;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", gender: "", dob: "",
    mobile: "", email: "", address: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Clear field error as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  // Validate email on blur
  const handleEmailBlur = () => {
    if (formData.email && !EMAIL_RE.test(formData.email))
      setErrors((p) => ({ ...p, email: "Enter a valid email address (e.g. abc@gmail.com)." }));
    else
      setErrors((p) => ({ ...p, email: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/patient/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.msg || "Registration successful!", {
          autoClose: 5000,
        });
        navigate("/patient/login");
      } else {
        toast.error(data.msg || "Registration failed. Please try again.",{
          autoClose: 5000, // 4 seconds (default is ~3s)
        });
      }
    } catch {
      toast.error("Server error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: render inline error
  const Err = ({ field }) =>
    errors[field] ? <p className="PatReg-error">{errors[field]}</p> : null;

  return (
    <div className="PatReg-container">
      <div className="PatReg-card">

        {/* Left image */}
        <div className="PatReg-left">
          <img src={registerImage} alt="Register" />
        </div>

        {/* Right form */}
        <div className="PatReg-right">
          <div className="PatReg-form-box">
            <h2 className="PatReg-heading">Patient Registration</h2>

            <form onSubmit={handleSubmit} noValidate>

              {/* ── Basic Information ── */}
              <h3 className="PatReg-section-title">Basic Information</h3>

              <div className="PatReg-row">
                <div className="PatReg-field">
                  <input
                    className={`PatReg-input${errors.firstName ? " PatReg-input--error" : ""}`}
                    type="text" name="firstName" placeholder="First Name"
                    value={formData.firstName} onChange={handleChange}
                  />
                  <Err field="firstName" />
                </div>
                <div className="PatReg-field">
                  <input
                    className={`PatReg-input${errors.lastName ? " PatReg-input--error" : ""}`}
                    type="text" name="lastName" placeholder="Last Name"
                    value={formData.lastName} onChange={handleChange}
                  />
                  <Err field="lastName" />
                </div>
              </div>

              <div className="PatReg-row">
                <div className="PatReg-field">
                  <select
                    className={`PatReg-input${errors.gender ? " PatReg-input--error" : ""}`}
                    name="gender" value={formData.gender} onChange={handleChange}
                  >
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <Err field="gender" />
                </div>
                <div className="PatReg-field">
                  <input
                    className={`PatReg-input${errors.dob ? " PatReg-input--error" : ""}`}
                    type="date" name="dob"
                    max={new Date().toISOString().split("T")[0]}
                    value={formData.dob} onChange={handleChange}
                  />
                  <Err field="dob" />
                </div>
              </div>

              {/* ── Contact Details ── */}
              <h3 className="PatReg-section-title">Contact Details</h3>

              <div className="PatReg-row">
                <div className="PatReg-field">
                  <input
                    className={`PatReg-input${errors.mobile ? " PatReg-input--error" : ""}`}
                    type="text" name="mobile" placeholder="Mobile Number"
                    value={formData.mobile} onChange={handleChange} maxLength={10}
                  />
                  <Err field="mobile" />
                </div>
                <div className="PatReg-field">
                  <input
                    className={`PatReg-input${errors.email ? " PatReg-input--error" : ""}`}
                    type="email" name="email" placeholder="Email Address"
                    value={formData.email} onChange={handleChange} onBlur={handleEmailBlur}
                  />
                  <Err field="email" />
                </div>
              </div>

              <div className="PatReg-field PatReg-field--full">
                <textarea
                  className={`PatReg-textarea${errors.address ? " PatReg-input--error" : ""}`}
                  name="address" placeholder="Full Address"
                  value={formData.address} onChange={handleChange}
                />
                <Err field="address" />
              </div>

              {/* ── Login Credentials ── */}
              <h3 className="PatReg-section-title">Login Credentials</h3>

              <div className="PatReg-row">
                <div className="PatReg-field">
                  <div className="PatReg-pwd-wrap">
                    <input
                      className={`PatReg-input${errors.password ? " PatReg-input--error" : ""}`}
                      type={showPassword ? "text" : "password"}
                      name="password" placeholder="Password"
                      value={formData.password} onChange={handleChange}
                    />
                    <span className="PatReg-eye" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <Err field="password" />
                </div>
                <div className="PatReg-field">
                  <div className="PatReg-pwd-wrap">
                    <input
                      className={`PatReg-input${errors.confirmPassword ? " PatReg-input--error" : ""}`}
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword" placeholder="Confirm Password"
                      value={formData.confirmPassword} onChange={handleChange}
                    />
                    <span className="PatReg-eye" onClick={() => setShowConfirm((p) => !p)}>
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <Err field="confirmPassword" />
                </div>
              </div>

              <button
                type="submit"
                className="PatReg-btn"
                disabled={submitting}
              >
                {submitting ? "Registering..." : "Register"}
              </button>

              <p className="PatReg-login-link">
                Already have an account?{" "}
                <Link to="/patient/login" className="PatReg-link">Login</Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
