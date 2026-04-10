import { useState, useEffect, useRef } from "react";
import "../css/DoctorProfile.css";
import { useNavigate } from "react-router-dom";
const initialState = {
  fullName: "", dob: "", gender: "",
  workingDays: [],
  workingHours: [{ start: "09:00", end: "17:00" }],
  serviceType: [],
  applyAllDays: false,
  about: "",
  mobile: "", emergencyContact: "", hospitalName: "", address: "", city: "", state: "", mapLink: "",
};

const STEPS = [
  { label: "Personal Details",     icon: "⚕️" },
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

// ── Availability constants ────────────────────────────────────────────────────
const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const DAY_SHORT = { Monday:"Mon", Tuesday:"Tue", Wednesday:"Wed", Thursday:"Thu",
                    Friday:"Fri", Saturday:"Sat", Sunday:"Sun" };
const SERVICE_OPTS = [
  { value: "physical", label: "🏥 Physical Consultation" },
  { value: "videocall",    label: "📹 Video Consultation"    },
];

const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const val = `${hh}:${mm}`;
      const ampm = h < 12 ? "AM" : "PM";
      const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h;
      opts.push({ value: val, label: `${String(h12).padStart(2,"0")}:${mm} ${ampm}` });
    }
  }
  return opts;
})();

function WorkingDaysPicker({ selected, onChange, error }) {
  const toggle = (day) => {
    const next = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day];
    onChange(next);
  };
  return (
    <div className="dp-field">
      <label className="dp-label">Working Days <span className="dp-required">*</span></label>
      <div className="dp-day-chips">
        {ALL_DAYS.map((day) => (
          <div
            key={day}
            role="button"
            tabIndex={0}
            className={"dp-day-chip" + (selected.includes(day) ? " dp-day-chip--on" : "")}
            onClick={() => toggle(day)}
            onKeyDown={(e) => e.key === "Enter" && toggle(day)}
          >
            {DAY_SHORT[day]}
          </div>
        ))}
      </div>
      {error && <span className="dp-error-msg">{error}</span>}
    </div>
  );
}

function WorkingHoursSessions({ sessions, onChange, sessionErrors }) {
  const addSession = () =>
    onChange([...sessions, { start: "09:00", end: "17:00" }]);
  const removeSession = (i) =>
    onChange(sessions.filter((_, idx) => idx !== i));
  const updateSession = (i, field, val) =>
    onChange(sessions.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  return (
    <div className="dp-field">
      <label className="dp-label">Working Hours <span className="dp-required">*</span></label>
      <div className="dp-sessions">
        {sessions.map((s, i) => (
          <div key={i} className="dp-session-row">
            <span className="dp-session-num">Session {i + 1}</span>
            <select
              className={"dp-input dp-time-sel" + (sessionErrors?.[i]?.start ? " dp-input-error" : "")}
              value={s.start}
              onChange={(e) => updateSession(i, "start", e.target.value)}
            >
              {TIME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="dp-session-to">to</span>
            <select
              className={"dp-input dp-time-sel" + (sessionErrors?.[i]?.end ? " dp-input-error" : "")}
              value={s.end}
              onChange={(e) => updateSession(i, "end", e.target.value)}
            >
              {TIME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {sessions.length > 1 && (
              <button type="button" className="dp-session-remove"
                onClick={() => removeSession(i)} title="Remove">✕</button>
            )}
            {sessionErrors?.[i] && (
              <span className="dp-error-msg dp-session-err">
                {sessionErrors[i].end || sessionErrors[i].overlap}
              </span>
            )}
          </div>
        ))}
      </div>
      <button type="button" className="dp-add-session-btn" onClick={addSession}>
        ＋ Add Session
      </button>
    </div>
  );
}

function ServiceTypePicker({ selected, onChange, error }) {
  const toggle = (val) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(next);
  };
  return (
    <div className="dp-field">
      <label className="dp-label">Type of Service <span className="dp-required">*</span></label>
      <div className="dp-service-opts">
        {SERVICE_OPTS.map((opt) => (
          <label
            key={opt.value}
            className={"dp-service-chip" + (selected.includes(opt.value) ? " dp-service-chip--on" : "")}
          >
            <input type="checkbox" checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)} style={{ display: "none" }} />
            {opt.label}
          </label>
        ))}
      </div>
      {error && <span className="dp-error-msg">{error}</span>}
    </div>
  );
}

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
  const navigate = useNavigate();
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
      // Working days
      if (!form.workingDays || form.workingDays.length === 0)
        e.workingDays = "Please select at least one working day.";

      // Working hours sessions
      const sessionErrs = {};
      form.workingHours.forEach((s, i) => {
        if (s.start >= s.end)
          sessionErrs[i] = { end: "End time must be after start time." };
      });
      // Check overlaps
      for (let i = 0; i < form.workingHours.length; i++) {
        for (let j = i + 1; j < form.workingHours.length; j++) {
          const a = form.workingHours[i];
          const b = form.workingHours[j];
          if (a.start < b.end && b.start < a.end) {
            sessionErrs[j] = { overlap: `Session ${j + 1} overlaps with session ${i + 1}.` };
          }
        }
      }
      if (Object.keys(sessionErrs).length > 0) e.workingHours = sessionErrs;

      // Service type
      if (!form.serviceType || form.serviceType.length === 0)
        e.serviceType = "Please select at least one service type.";

      if (!form.about || form.about.trim().length < 20)
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
    //  const token = localStorage.getItem("doctorToken"); // token generated
    // if (!token) {
    //   // Token missing — redirect to login
    //   alert("Session expired. Please login again.");
    //   window.location.href = "/DoctorLogin";
    //   return;
    // }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        gender:           form.gender,
        dob:              form.dob,
        workingDays:      form.workingDays,
        workingHours:     form.workingHours,
        serviceType:      form.serviceType,
        about:            form.about,
        mobile:           form.mobile,
        emergencyContact: form.emergencyContact,
        clinicName:       form.hospitalName,
        clinicAddress:    form.address,
        city:             form.city,
        state:            form.state,
        mapLink:          form.mapLink,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/doctor/complete-profile`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiry
        
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
            onClick={() => { setSubmitted(false); setStep(0); setForm(initialState); navigate("/DoctorDashboard"); }}>
            Go to Dashboard
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
          <div className="dp-grid-2">
            <Field label="Full Name"     name="fullName" required {...f("fullName")} />
            <Field label="Date of Birth" name="dob" type="date" required {...f("dob")} />
            <Field label="Gender" name="gender" options={["Male", "Female", "Other"]} required {...f("gender")} />
          </div>
        )}

        {step === 1 && (
          <>
            <WorkingDaysPicker
              selected={form.workingDays}
              onChange={(days) => {
                setForm((p) => ({ ...p, workingDays: days }));
                if (errors.workingDays) setErrors((p) => ({ ...p, workingDays: "" }));
              }}
              error={errors.workingDays}
            />

            <WorkingHoursSessions
              sessions={form.workingHours}
              onChange={(sessions) => {
                setForm((p) => ({ ...p, workingHours: sessions }));
                if (errors.workingHours) setErrors((p) => ({ ...p, workingHours: "" }));
              }}
              sessionErrors={typeof errors.workingHours === "object" ? errors.workingHours : null}
            />

            <ServiceTypePicker
              selected={form.serviceType}
              onChange={(types) => {
                setForm((p) => ({ ...p, serviceType: types }));
                if (errors.serviceType) setErrors((p) => ({ ...p, serviceType: "" }));
              }}
              error={errors.serviceType}
            />

            <Field label="About Doctor" name="about" textarea required {...f("about")} />
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
