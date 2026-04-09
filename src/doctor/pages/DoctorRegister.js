import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/DoctorRegister.css";

const SPECIALIZATIONS = [
  "Cardiologist", "Neurologist", "Orthopedic", "Dermatologist",
  "Pediatrician", "Gynecologist", "Psychiatrist", "Ophthalmologist",
  "General Physician", "ENT Specialist",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const init = {
  fullName: "", email: "", mobile: "", password: "", confirmPassword: "",
  specialization: "", qualification: "", experience: "", licenseNumber: "",
};

const DoctorRegister = () => {
  const [form, setForm]       = useState(init);
  const [errors, setErrors]   = useState({});
  const [show, setShow]       = useState({ pwd: false, cpwd: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  // validate single field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const t = value.toString().trim();
    let msg = "";

    if (name === "fullName") {
      if (!t)                              msg = "Full name is required.";
      else if (!/^[a-zA-Z\s]+$/.test(t))  msg = "Only alphabets allowed.";
    }
    if (name === "email") {
      if (!t)                              msg = "Email is required.";
      else if (!EMAIL_RE.test(t))          msg = "Enter a valid email address.";
    }
    if (name === "mobile") {
      if (!t)                              msg = "Mobile number is required.";
      else if (!/^\d{10}$/.test(t))        msg = "Must be exactly 10 digits.";
    }
    if (name === "password") {
      if (!t)                              msg = "Password is required.";
      else if (value.length < 6)           msg = "Password must be at least 6 characters.";
    }
    if (name === "confirmPassword") {
      if (!t)                              msg = "Please confirm your password.";
      else if (value !== form.password)    msg = "Passwords do not match.";
    }
    if (name === "specialization") {
      if (!t)                              msg = "Please select a specialization.";
    }
    if (name === "qualification") {
      if (!t)                              msg = "Qualification is required.";
    }
    if (name === "experience") {
      if (!t)                              msg = "Experience is required.";
      else if (isNaN(value) || Number(value) <= 0) msg = "Experience must be greater than 0.";
    }
    if (name === "licenseNumber") {
      if (!t)                              msg = "License registration number is required.";
    }

    if (msg) setErrors(p => ({ ...p, [name]: msg }));
  };

  const handleReset = () => {
    setForm(init);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    const t = (f) => form[f].toString().trim();

    // Full Name
    if (!t("fullName"))
      e.fullName = "Full name is required.";
    else if (!/^[a-zA-Z\s]+$/.test(t("fullName")))
      e.fullName = "Only alphabets allowed.";

    // Email
    if (!t("email"))
      e.email = "Email is required.";
    else if (!EMAIL_RE.test(t("email")))
      e.email = "Enter a valid email address.";

    // Mobile
    if (!t("mobile"))
      e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(t("mobile")))
      e.mobile = "Must be exactly 10 digits.";

    // Password
    if (!t("password"))
      e.password = "Password is required.";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters.";

    // Confirm Password
    if (!t("confirmPassword"))
      e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    // Specialization
    if (!t("specialization"))
      e.specialization = "Please select a specialization.";

    // Qualification
    if (!t("qualification"))
      e.qualification = "Qualification is required.";

    // Experience
    if (!t("experience"))
      e.experience = "Experience is required.";
    else if (isNaN(form.experience) || Number(form.experience) <= 0)
      e.experience = "Experience must be greater than 0.";

    // License Number
    if (!t("licenseNumber"))
      e.licenseNumber = "License registration number is required.";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        fullName:       form.fullName,   // ✅ FIXED
        email:          form.email,
        mobile:         form.mobile,
        password:       form.password,
        specialization: form.specialization,
        qualification:  form.qualification,
        experience:     Number(form.experience),
        licenseNumber:  form.licenseNumber,
      }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("pendingDoctor", JSON.stringify({
          name: form.fullName, email: form.email, specialization: form.specialization,
        }));
        navigate("/DoctorLogin");
      } else {
        setErrors(p => ({ ...p, submit: data.message || "Registration failed. Please try again." }));
      }
    } catch {
      // UI demo fallback
      sessionStorage.setItem("pendingDoctor", JSON.stringify({
        name: form.fullName, email: form.email, specialization: form.specialization,
      }));
      navigate("/DoctorWaiting");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name, type = "text", placeholder = "") => ({
    name, type, placeholder,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    className: "dr-input" + (errors[name] ? " err" : ""),
  });

  return (
    <div className="dr-page">
      <div className="dr-card">

        {/* Header */}
        <div className="dr-header">
          <div className="dr-header-top">
            <div className="dr-header-icon">⚕️</div>            
            <div>
              <h1>Doctor Registration</h1>
              <p>Submit your details. Your account will be reviewed by admin before login.</p>
            </div>
          </div>
        </div>

        <div className="dr-body">
          <form onSubmit={handleSubmit} noValidate>

            {/* ── Basic Details ── */}
            <div className="dr-section">
              <div className="dr-section-title">
                <div className="dr-section-icon">👤</div> Basic Details
              </div>

              <div className="dr-grid-2">
                <div className="dr-field">
                  <label className="dr-label">Full Name <span className="dr-req">*</span></label>
                  <input {...inp("fullName", "text", "Dr. Full Name")} />
                  {errors.fullName && <span className="dr-error">{errors.fullName}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">Email ID <span className="dr-req">*</span></label>
                  <input {...inp("email", "email", "doctor@email.com")} />
                  {errors.email && <span className="dr-error">{errors.email}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">Mobile Number <span className="dr-req">*</span></label>
                  <input {...inp("mobile", "tel", "10-digit number")} maxLength={10} />
                  {errors.mobile && <span className="dr-error">{errors.mobile}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">Password <span className="dr-req">*</span></label>
                  <div className="dr-pwd-wrap">
                    <input {...inp("password", show.pwd ? "text" : "password", "Min 6 characters")} />
                    <button type="button" className="dr-eye"
                      onClick={() => setShow(p => ({ ...p, pwd: !p.pwd }))}>
                      {show.pwd ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <span className="dr-error">{errors.password}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">Confirm Password <span className="dr-req">*</span></label>
                  <div className="dr-pwd-wrap">
                    <input {...inp("confirmPassword", show.cpwd ? "text" : "password", "Re-enter password")} />
                    <button type="button" className="dr-eye"
                      onClick={() => setShow(p => ({ ...p, cpwd: !p.cpwd }))}>
                      {show.cpwd ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="dr-error">{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>

            {/* ── Professional Details ── */}
            <div className="dr-section">
              <div className="dr-section-title">
                <div className="dr-section-icon">🏥</div> Professional Details
              </div>

              <div className="dr-grid-2">
                <div className="dr-field">
                  <label className="dr-label">Specialization <span className="dr-req">*</span></label>
                  <select name="specialization" value={form.specialization}
                    onChange={handleChange} onBlur={handleBlur}
                    className={"dr-select" + (errors.specialization ? " err" : "")}>
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.specialization && <span className="dr-error">{errors.specialization}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">Qualification <span className="dr-req">*</span></label>
                  <input {...inp("qualification", "text", "e.g. MBBS, MD")} />
                  {errors.qualification && <span className="dr-error">{errors.qualification}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">Experience (years) <span className="dr-req">*</span></label>
                  <input {...inp("experience", "number", "e.g. 5")} min="1" />
                  {errors.experience && <span className="dr-error">{errors.experience}</span>}
                </div>

                <div className="dr-field">
                  <label className="dr-label">License Registration No. <span className="dr-req">*</span></label>
                  <input {...inp("licenseNumber", "text", "e.g. MCI-12345")} />
                  {errors.licenseNumber && <span className="dr-error">{errors.licenseNumber}</span>}
                </div>
              </div>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                color: "#dc2626", borderRadius: 8, padding: "10px 14px",
                fontSize: 13, marginBottom: 14,
              }}>
                ❌ {errors.submit}
              </div>
            )}

            {/* ── Buttons ── */}
            <div className="dr-submit-wrap">
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" className="dr-reset-btn" onClick={handleReset}>
                  Reset
                </button>
                <button type="submit" className="dr-submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
              <p className="dr-login-link">
                Already registered? <Link to="/DoctorLogin">Login here</Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
