import { useState, useEffect, useRef } from "react";
import "../css/DoctorProfile.css";

const initialState = {
  fullName: "", dob: "", gender: "", profilePic: null, profilePicPreview: "",
  workingDays: "", workingHours: "", about: "",
  mobile: "", emergencyContact: "", hospitalName: "", address: "", city: "", state: "", mapLink: "",
};

const STEPS = [
  { label: "Personal Details",     icon: "🧑‍⚕️" },
  { label: "Professional Details", icon: "🏥"    },
  { label: "Contact & Location",   icon: "📞"    },
];

// ── Custom Calendar Date Picker ──
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const CustomDatePicker = ({ value, onChange, error }) => {
  const today  = new Date();
  const parsed = value ? new Date(value + "T00:00:00") : null;

  const [open, setOpen]           = useState(false);
  const [viewYear, setViewYear]   = useState(parsed ? parsed.getFullYear()  : today.getFullYear() - 25);
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth()     : today.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange({ target: { name: "dob", value: `${viewYear}-${mm}-${dd}` } });
    setOpen(false);
  };

  const displayValue = parsed
    ? `${String(parsed.getDate()).padStart(2,"0")} ${MONTH_NAMES[parsed.getMonth()]} ${parsed.getFullYear()}`
    : "";

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (d) => parsed && d &&
    parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === d;

  const isTodayCell = (d) => d &&
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;

  return (
    <div className="cdp-wrap" ref={ref}>
      <div className={"cdp-trigger" + (error ? " dp-input-error" : "")} onClick={() => setOpen(o => !o)}>
        <span className={displayValue ? "cdp-value" : "cdp-placeholder"}>
          {displayValue || "Select date"}
        </span>
        <span className="cdp-icon">📅</span>
      </div>

      {open && (
        <div className="cdp-popup">
          <div className="cdp-header">
            <button className="cdp-nav" onClick={prevMonth}>&#8249;</button>
            <div className="cdp-month-year">
              <select className="cdp-month-sel" value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select className="cdp-year-sel" value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}>
                {Array.from({ length: 80 }, (_, i) => today.getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button className="cdp-nav" onClick={nextMonth}>&#8250;</button>
          </div>

          <div className="cdp-grid">
            {DAY_NAMES.map(d => <div key={d} className="cdp-day-name">{d}</div>)}
            {cells.map((d, i) => (
              <div key={i}
                className={
                  "cdp-cell" +
                  (!d ? " cdp-empty" : "") +
                  (isSelected(d) ? " cdp-selected" : "") +
                  (isTodayCell(d) && !isSelected(d) ? " cdp-today" : "")
                }
                onClick={() => d && selectDay(d)}
              >
                {d || ""}
              </div>
            ))}
          </div>

          <div className="cdp-footer">
            <button className="cdp-clear" onClick={() => { onChange({ target: { name: "dob", value: "" } }); setOpen(false); }}>
              Clear
            </button>
            <button className="cdp-today-btn" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Field lives OUTSIDE DoctorProfile so it never gets recreated on re-render ──
const Field = ({ label, name, type = "text", options, textarea, required, value, onChange, error }) => (
  <div className="dp-field">
    <label className="dp-label">
      {label} {required && <span className="dp-required">*</span>}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className={"dp-input" + (error ? " dp-input-error" : "")}
      />
    ) : (type === "date") ? (
      <CustomDatePicker value={value} onChange={onChange} error={error} />
    ) : options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={"dp-input dp-select" + (error ? " dp-input-error" : "")}
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={"dp-input" + (error ? " dp-input-error" : "")}
      />
    )}
    {error && <span className="dp-error-msg">{error}</span>}
  </div>
);

const DoctorProfile = () => {
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState(initialState);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);   // API call in progress
  const [apiError, setApiError]   = useState("");       // server-side error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //clear previous pic error
    setErrors((prev) => ({ ...prev, profilePic: "" }));

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profilePic: "Only image files are allowed (jpg, png, etc.)." }));
      return;
    }
    setForm((prev) => ({ ...prev, profilePic: file, profilePicPreview: URL.createObjectURL(file) }));
  };

  // ── scroll to first field that has an error ──
  const scrollToFirstError = (errs) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[name="${firstKey}"], .cdp-trigger`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // ── per-step validation ──
  const validate = (stepIndex) => {
    const e = {};
    const t = (field) => form[field].toString().trim();

    if (stepIndex === 0) {
      // Profile picture
      if (!form.profilePic)
        e.profilePic = "Profile picture is required.";

      // Full name
      if (!t("fullName"))
        e.fullName = "Full name is required.";
      else if (t("fullName").length < 3)
        e.fullName = "Full name must be at least 3 characters.";
      else if (!/^[a-zA-Z\s.'-]+$/.test(t("fullName")))
        e.fullName = "Full name can only contain letters, spaces, dots, or hyphens.";

      // Date of birth
      if (!t("dob")) {
        e.dob = "Date of birth is required.";
      } else {
        const dob = new Date(form.dob + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob >= today)
          e.dob = "Date of birth cannot be today or a future date.";
        else {
          const age = today.getFullYear() - dob.getFullYear();
          if (age < 25) e.dob = "Doctor must be at least 25 years old.";
          else if (age > 80) e.dob = "Age cannot exceed 80 years.";
        }
      }

      // Gender
      if (!t("gender"))
        e.gender = "Please select a gender.";
    }

    if (stepIndex === 1) {
      // if (!t("specialization"))
      //   e.specialization = "Specialization is required.";
      // else if (t("specialization").length < 3)
      //   e.specialization = "Specialization must be at least 3 characters.";

      // if (!t("qualification"))
      //   e.qualification = "Qualification is required.";
      // else if (t("qualification").length < 2)
      //   e.qualification = "Enter a valid qualification (e.g. MBBS, MD).";

      // if (!t("experience"))
      //   e.experience = "Experience is required.";
      // else if (isNaN(form.experience) || Number(form.experience) <= 0)
      //   e.experience = "Experience must be a positive number greater than 0.";
      // else if (Number(form.experience) > 60)
      //   e.experience = "Experience cannot exceed 60 years.";

      // if (!t("licenseNumber"))
      //   e.licenseNumber = "License / registration number is required.";
      // else if (!/^[a-zA-Z0-9/\\-]{5,}$/.test(t("licenseNumber")))
      //   e.licenseNumber = "Enter a valid license number (min 5 alphanumeric characters).";

      if (!t("workingDays"))
        e.workingDays = "Working days are required (e.g. Mon–Fri).";
      else if (t("workingDays").length < 3)
        e.workingDays = "Enter valid working days (e.g. Mon–Fri).";

      if (!t("workingHours"))
        e.workingHours = "Working hours are required (e.g. 9 AM – 5 PM).";
      else if (t("workingHours").length < 3)
        e.workingHours = "Enter valid working hours (e.g. 9 AM – 5 PM).";

      if (!t("about"))
        e.about = "About Doctor is required.";
      else if (t("about").length < 20)
        e.about = "About Doctor must be at least 20 characters.";
    }

    if (stepIndex === 2) {
      if (!t("mobile"))
        e.mobile = "Mobile number is required.";
      else if (!/^\d{10}$/.test(t("mobile")))
        e.mobile = "Mobile number must be exactly 10 digits.";

      if (!t("emergencyContact"))
        e.emergencyContact = "Emergency contact number is required.";
      else if (!/^\d{10}$/.test(t("emergencyContact")))
        e.emergencyContact = "Emergency contact must be exactly 10 digits.";
      else if (t("mobile") === t("emergencyContact"))
        e.emergencyContact = "Emergency contact must be different from mobile number.";

      if (!t("hospitalName"))
        e.hospitalName = "Hospital / clinic name is required.";
      else if (t("hospitalName").length < 3)
        e.hospitalName = "Name must be at least 3 characters.";

      if (!t("address"))
        e.address = "Address is required.";
      else if (t("address").length < 10)
        e.address = "Address must be at least 10 characters.";

      if (!t("city"))
        e.city = "City is required.";
      else if (!/^[a-zA-Z\s]{2,}$/.test(t("city")))
        e.city = "Enter a valid city name (letters only).";

      if (!t("state"))
        e.state = "State is required.";
      else if (!/^[a-zA-Z\s]{2,}$/.test(t("state")))
        e.state = "Enter a valid state name (letters only).";

      if (!t("mapLink"))
        e.mapLink = "Map link is required.";
      else if (!/^https?:\/\/.+\..+/.test(t("mapLink")))
        e.mapLink = "Enter a valid URL starting with http:// or https://.";
    }

    return e;
  };

  const handleNext = () => {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      scrollToFirstError(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep((s) => s - 1); };

  // ── Submit — sends profile data to backend API ──
  const handleSubmit = async () => {
    // Step 3 validation
    const errs = validate(2);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      scrollToFirstError(errs);
      return;
    }

    // Get JWT token stored during doctor login
     const token = localStorage.getItem("doctorToken"); // token generated
    // if (!token) {
    //   // Token missing — redirect to login
    //   alert("Session expired. Please login again.");
    //   window.location.href = "/DoctorLogin";
    //   return;
    // }

    setLoading(true);
    setApiError("");

    try {
      // Build FormData (required for profile image upload)
      const formData = new FormData();

      // Personal details
      formData.append("gender",           form.gender);
      formData.append("dob",              form.dob);

      // Professional details
      // formData.append("specialization",   form.specialization);
      // formData.append("qualification",    form.qualification);
      // formData.append("experience",       form.experience);
      // formData.append("licenseNumber",    form.licenseNumber);
      formData.append("workingDays",      form.workingDays);
      formData.append("workingHours",     form.workingHours);
      formData.append("about",            form.about);

      // Contact & location — field name mapping
      formData.append("mobile",           form.mobile);
      formData.append("emergencyContact", form.emergencyContact);
      formData.append("clinicName",       form.hospitalName);   // hospitalName → clinicName
      formData.append("clinicAddress",    form.address);        // address → clinicAddress
      formData.append("city",             form.city);
      formData.append("state",            form.state);
      formData.append("mapLink",          form.mapLink);

      // Profile picture (file object)
      if (form.profilePic) {
        formData.append("profilePic", form.profilePic);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/doctor/complete-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,   // JWT — required by protect middleware
          },
          body: formData,
          // Note: Do NOT set Content-Type header — browser sets it automatically for FormData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiry
        if (response.status === 401) {
          localStorage.removeItem("doctorToken");
          alert("Session expired. Please login again.");
          window.location.href = "/DoctorLogin";
          return;
        }
        throw new Error(data.message || "Profile update failed. Please try again.");
      }

      // Success
      setSubmitted(true);

    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // shorthand to pass common props to Field
  const f = (name) => ({ value: form[name], onChange: handleChange, error: errors[name] });

  if (submitted) {
    return (
      <div className="dp-page">
        <div className="dp-success">
          <div className="dp-success-icon">✅</div>
          <h2>Profile Saved!</h2>
          <p>Your doctor profile has been submitted successfully.</p>
          <button className="dp-btn dp-btn-save"
            onClick={() => { setSubmitted(false); setStep(0); setForm(initialState); }}>
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-page">
      <div className="dp-page-header">
        <h1>Doctor Profile</h1>
        <p>Complete all 3 sections to set up your profile</p>
      </div>

      {/* STEPPER */}
      <div className="dp-stepper">
        {STEPS.map((s, i) => (
          <div key={i} className="dp-step-item">
            <div className={"dp-step-circle" + (i < step ? " done" : i === step ? " active" : "")}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={"dp-step-label" + (i === step ? " active" : "")}>{s.label}</span>
            {i < STEPS.length - 1 && <div className={"dp-step-line" + (i < step ? " done" : "")} />}
          </div>
        ))}
      </div>

      {/* CARD */}
      <div className="dp-card">
        <div className="dp-card-title">
          <span className="dp-card-icon">{STEPS[step].icon}</span>
          {STEPS[step].label}
        </div>

        {step === 0 && (
          <>
            <div className="dp-profile-pic-row">
              <div className="dp-avatar-wrap">
                {form.profilePicPreview
                  ? <img src={form.profilePicPreview} alt="Profile" className="dp-avatar" />
                  : <div className="dp-avatar-placeholder"><span>Photo</span></div>}
                <label className="dp-upload-btn">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              </div>
            </div>
            <div className="dp-grid-2">
              <Field label="Full Name"     name="fullName" required {...f("fullName")} />
              <Field label="Date of Birth" name="dob" type="date" required {...f("dob")} />
              <Field label="Gender" name="gender" options={["Male", "Female", "Other"]} required {...f("gender")} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="dp-grid-2">
              {/* <Field label="Specialization"        name="specialization" required {...f("specialization")} />
              <Field label="Qualification"         name="qualification"  required {...f("qualification")} />
              <Field label="Experience (years)"    name="experience" type="number" min="0" required {...f("experience")} />
              <Field label="License / Reg. Number" name="licenseNumber"  required {...f("licenseNumber")} /> */}
              <Field label="Working Days"          name="workingDays" {...f("workingDays")} />
              <Field label="Working Hours"         name="workingHours" {...f("workingHours")} />
            </div>
            <Field label="About Doctor" name="about" textarea {...f("about")} />
          </>
        )}

        {step === 2 && (
          <>
            <div className="dp-grid-2">
              <Field label="Mobile Number"     name="mobile" type="tel" required {...f("mobile")} />
              <Field label="Emergency Contact" name="emergencyContact" type="tel" {...f("emergencyContact")} />
              <Field label="Hospital / Clinic" name="hospitalName" required {...f("hospitalName")} />
              <Field label="City"              name="city"  required {...f("city")} />
              <Field label="State"             name="state" required {...f("state")} />
              <Field label="Map Link"          name="mapLink" type="url" {...f("mapLink")} />
            </div>
            <Field label="Address" name="address" {...f("address")} />
          </>
        )}
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="dp-api-error">
          ❌ {apiError}
        </div>
      )}

      {/* NAVIGATION */}
      <div className="dp-actions">
        {step > 0 && (
          <button className="dp-btn dp-btn-back" onClick={handleBack} disabled={loading}>← Back</button>
        )}
        {step < STEPS.length - 1
          ? <button className="dp-btn dp-btn-save" onClick={handleNext}>Next →</button>
          : <button className="dp-btn dp-btn-save" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
        }
      </div>
    </div>
  );
};

export default DoctorProfile;
