import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/PatientProfileSetup.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISEASES     = ["Diabetes", "Blood Pressure", "Asthma", "None"];

const STEPS = [
  { label: "Basic Info",        icon: "👤" },
  { label: "Address",           icon: "🏠" },
  { label: "Medical Info",      icon: "🏥" },
  { label: "Emergency Contact", icon: "📞" },
];

const initialForm = {
  // Step 1
  fullName: "", dob: "", age: "", gender: "", bloodGroup: "", mobile: "9876543210",
  // Step 2
  address: "", city: "", state: "", pincode: "",
  // Step 3
  allergies: "", diseases: [], medications: "",
  // Step 4
  emergencyName: "", relationship: "", emergencyMobile: "",
  photo: null, photoPreview: "",
};

// ── Auto-calculate age from DOB ──
const calcAge = (dob) => {
  if (!dob) return "";
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? String(age) : "";
};

// ── Completion % ──
const calcCompletion = (form) => {
  const fields = [
    form.fullName, form.dob, form.gender, form.bloodGroup,
    form.address, form.city, form.state, form.pincode,
    form.emergencyName, form.relationship, form.emergencyMobile,
  ];
  const filled = fields.filter(f => f.toString().trim()).length;
  return Math.round((filled / fields.length) * 100);
};

const PatientProfileSetup = () => {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const completion = calcCompletion(form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    if (name === "dob") updated.age = calcAge(value);
    setForm(updated);
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleDisease = (disease) => {
    let list = [...form.diseases];
    if (disease === "None") {
      list = list.includes("None") ? [] : ["None"];
    } else {
      list = list.filter(d => d !== "None");
      list.includes(disease) ? list.splice(list.indexOf(disease), 1) : list.push(disease);
    }
    setForm(p => ({ ...p, diseases: list }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }));
  };

  // ── Per-step validation ──
  const validate = (s) => {
    const e = {};
    const t = (f) => form[f].toString().trim();

    if (s === 0) {
      if (!t("fullName"))
        e.fullName = "Full name is required.";
      else if (!/^[a-zA-Z\s]+$/.test(t("fullName")))
        e.fullName = "Only alphabets allowed.";

      if (!t("dob"))
        e.dob = "Date of birth is required.";
      else if (new Date(form.dob) >= new Date())
        e.dob = "Date of birth cannot be a future date.";

      if (!form.gender)   e.gender     = "Please select a gender.";
      if (!t("bloodGroup")) e.bloodGroup = "Please select blood group.";
      if (!/^\d{10}$/.test(t("mobile"))) e.mobile = "Enter valid 10-digit mobile number.";
    }

    if (s === 1) {
      if (!t("address")) e.address = "Address is required.";
      if (!t("city"))    e.city    = "City is required.";
      else if (!/^[a-zA-Z\s]+$/.test(t("city"))) e.city = "Only alphabets allowed.";
      if (!t("state"))   e.state   = "State is required.";
      else if (!/^[a-zA-Z\s]+$/.test(t("state"))) e.state = "Only alphabets allowed.";
      if (!t("pincode"))           e.pincode = "Pincode is required.";
      else if (!/^\d{6}$/.test(t("pincode"))) e.pincode = "Pincode must be 6 digits.";
    }

    if (s === 3) {
      if (!t("emergencyName"))   e.emergencyName   = "Emergency contact name is required.";
      if (!t("relationship"))    e.relationship    = "Relationship is required.";
      if (!t("emergencyMobile")) e.emergencyMobile = "Emergency contact number is required.";
      else if (!/^\d{10}$/.test(t("emergencyMobile"))) e.emergencyMobile = "Must be 10 digits.";
    }

    return e;
  };

  const handleNext = () => {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = () => {
    const errs = validate(3);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    console.log("Patient Profile Submitted:", form);
    setSubmitted(true);
  };

  const f = (name) => ({
    name,
    value: form[name],
    onChange: handleChange,
    className: "pps-input" + (errors[name] ? " err" : ""),
  });

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="pps-page">
        <div className="pps-card">
          <div className="pps-success">
            <div className="pps-success-icon">🎉</div>
            <h2>Profile Complete!</h2>
            <p>Your profile has been set up successfully. You're all set to use MediTrack.</p>
            <button className="pps-btn pps-btn-submit" onClick={() => navigate("/PatientHome")}>
              Go to Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pps-page">

      {/* Banner */}
      <div className="pps-banner">
        ℹ️ Complete your profile to continue using MediTrack
      </div>

      <div className="pps-card">

        {/* ── PROGRESS HEADER ── */}
        <div className="pps-header">
          <div className="pps-step-info">
            <span className="pps-step-label">{STEPS[step].label}</span>
            <span className="pps-step-count">Step {step + 1} of {STEPS.length}</span>
          </div>
          <div className="pps-progress-bar">
            <div className="pps-progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <div className="pps-progress-pct">{((step + 1) / STEPS.length) * 100}% complete</div>

          {/* Step dots */}
          <div className="pps-dots">
            {STEPS.map((s, i) => (
              <>
                <div key={i} className={"pps-dot" + (i < step ? " done" : i === step ? " active" : "")}>
                  {i < step ? "✓" : i + 1}
                </div>
                {i < STEPS.length - 1 && <div key={`line-${i}`} className={"pps-dot-line" + (i < step ? " done" : "")} />}
              </>
            ))}
          </div>
        </div>

        {/* Completion indicator */}
        {completion > 0 && (
          <div className="pps-body" style={{ paddingBottom: 0 }}>
            <div className="pps-completion">
              ✅ Profile {completion}% complete
            </div>
          </div>
        )}

        {/* ── SECTION TITLE ── */}
        <div className="pps-section-title">
          <div className="pps-section-icon">{STEPS[step].icon}</div>
          {STEPS[step].label}
        </div>

        {/* ── STEP CONTENT ── */}
        <div className="pps-body">

          {/* STEP 1 — Basic Info */}
          {step === 0 && (
            <>
              <div className="pps-grid-2">
                <div className="pps-field">
                  <label className="pps-label">Full Name <span className="pps-req">*</span></label>
                  <input {...f("fullName")} type="text" placeholder="Enter full name" />
                  {errors.fullName && <span className="pps-error">{errors.fullName}</span>}
                </div>

                <div className="pps-field">
                  <label className="pps-label">Date of Birth <span className="pps-req">*</span></label>
                  <input {...f("dob")} type="date" max={new Date().toISOString().split("T")[0]} />
                  {errors.dob && <span className="pps-error">{errors.dob}</span>}
                </div>

                <div className="pps-field">
                  <label className="pps-label">Age (auto-calculated)</label>
                  <input className="pps-input" value={form.age} readOnly placeholder="Auto-filled" />
                </div>

                <div className="pps-field">
                  <label className="pps-label">Blood Group <span className="pps-req">*</span></label>
                  <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                    className={"pps-select" + (errors.bloodGroup ? " err" : "")}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.bloodGroup && <span className="pps-error">{errors.bloodGroup}</span>}
                </div>
              </div>

              <div className="pps-field">
                <label className="pps-label">Gender <span className="pps-req">*</span></label>
                <div className="pps-radio-group">
                  {["Male", "Female", "Other"].map(g => (
                    <label key={g} className="pps-radio-label">
                      <input type="radio" name="gender" value={g}
                        checked={form.gender === g} onChange={handleChange} />
                      {g}
                    </label>
                  ))}
                </div>
                {errors.gender && <span className="pps-error">{errors.gender}</span>}
              </div>

              <div className="pps-field">
                <label className="pps-label">Mobile Number <span className="pps-req">*</span></label>
                <input {...f("mobile")} type="tel" placeholder="10-digit mobile" />
                {errors.mobile && <span className="pps-error">{errors.mobile}</span>}
              </div>
            </>
          )}

          {/* STEP 2 — Address */}
          {step === 1 && (
            <>
              <div className="pps-field">
                <label className="pps-label">Address Line <span className="pps-req">*</span></label>
                <input {...f("address")} type="text" placeholder="House no, Street, Area" />
                {errors.address && <span className="pps-error">{errors.address}</span>}
              </div>
              <div className="pps-grid-2">
                <div className="pps-field">
                  <label className="pps-label">City <span className="pps-req">*</span></label>
                  <input {...f("city")} type="text" placeholder="City" />
                  {errors.city && <span className="pps-error">{errors.city}</span>}
                </div>
                <div className="pps-field">
                  <label className="pps-label">State <span className="pps-req">*</span></label>
                  <input {...f("state")} type="text" placeholder="State" />
                  {errors.state && <span className="pps-error">{errors.state}</span>}
                </div>
                <div className="pps-field">
                  <label className="pps-label">Pincode <span className="pps-req">*</span></label>
                  <input {...f("pincode")} type="text" placeholder="6-digit pincode" maxLength={6} />
                  {errors.pincode && <span className="pps-error">{errors.pincode}</span>}
                </div>
              </div>
            </>
          )}

          {/* STEP 3 — Medical Info */}
          {step === 2 && (
            <>
              <div className="pps-field">
                <label className="pps-label">Known Allergies</label>
                <textarea name="allergies" value={form.allergies} onChange={handleChange}
                  className="pps-textarea" placeholder="e.g. Penicillin, Pollen (leave blank if none)" />
              </div>

              <div className="pps-field">
                <label className="pps-label">Existing Diseases</label>
                <div className="pps-checkbox-group">
                  {DISEASES.map(d => (
                    <label key={d} className="pps-checkbox-label">
                      <input type="checkbox" checked={form.diseases.includes(d)}
                        onChange={() => handleDisease(d)} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pps-field">
                <label className="pps-label">Current Medications</label>
                <textarea name="medications" value={form.medications} onChange={handleChange}
                  className="pps-textarea" placeholder="List any medications you are currently taking" />
              </div>
            </>
          )}

          {/* STEP 4 — Emergency Contact */}
          {step === 3 && (
            <>
              <div className="pps-grid-2">
                <div className="pps-field">
                  <label className="pps-label">Contact Name <span className="pps-req">*</span></label>
                  <input {...f("emergencyName")} type="text" placeholder="Full name" />
                  {errors.emergencyName && <span className="pps-error">{errors.emergencyName}</span>}
                </div>
                <div className="pps-field">
                  <label className="pps-label">Relationship <span className="pps-req">*</span></label>
                  <input {...f("relationship")} type="text" placeholder="e.g. Father, Spouse" />
                  {errors.relationship && <span className="pps-error">{errors.relationship}</span>}
                </div>
                <div className="pps-field">
                  <label className="pps-label">Contact Number <span className="pps-req">*</span></label>
                  <input {...f("emergencyMobile")} type="tel" placeholder="10-digit number" />
                  {errors.emergencyMobile && <span className="pps-error">{errors.emergencyMobile}</span>}
                </div>
              </div>

              <div className="pps-field">
                <label className="pps-label">Profile Photo</label>
                <div className="pps-photo-wrap">
                  {form.photoPreview
                    ? <img src={form.photoPreview} alt="Preview" className="pps-photo-preview" />
                    : <div className="pps-photo-placeholder">👤</div>}
                  <label className="pps-upload-btn">
                    📷 Upload Photo
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
                  </label>
                </div>
              </div>
            </>
          )}

        </div>

        {/* ── FOOTER ── */}
        <div className="pps-footer">
          {step > 0
            ? <button className="pps-btn pps-btn-back" onClick={handleBack}>← Back</button>
            : <span />}

          {step < STEPS.length - 1
            ? <button className="pps-btn pps-btn-next" onClick={handleNext}>Next →</button>
            : <button className="pps-btn pps-btn-submit" onClick={handleSubmit}>✅ Save & Continue</button>}
        </div>

      </div>
    </div>
  );
};

export default PatientProfileSetup;
