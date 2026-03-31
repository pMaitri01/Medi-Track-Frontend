import { useState, useEffect, useRef } from "react";
import "../css/DoctorProfile.css";

const initialState = {
  fullName: "", dob: "", gender: "", profilePic: null, profilePicPreview: "",
  workingDays: "", workingHours: "", about: "",
  mobile: "", emergencyContact: "", hospitalName: "", address: "", city: "", state: "", mapLink: "",
};

const STEPS = [
  { label: "Personal Details", icon: "🧑‍⚕️" },
  { label: "Professional Details", icon: "🏥" },
  { label: "Contact & Location", icon: "📞" },
];

// Date Picker (unchanged)
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const CustomDatePicker = ({ value, onChange }) => {
  const today = new Date();
  const parsed = value ? new Date(value + "T00:00:00") : null;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange({ target: { name: "dob", value: `${viewYear}-${mm}-${dd}` } });
    setOpen(false);
  };

  return (
    <div className="cdp-wrap" ref={ref}>
      <div className="cdp-trigger" onClick={() => setOpen(o => !o)}>
        <span>{parsed ? parsed.toDateString() : "Select date"}</span>
      </div>

      {open && (
        <div className="cdp-popup">
          <div className="cdp-grid">
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className="cdp-cell" onClick={() => selectDay(i + 1)}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, name, type = "text", options, textarea, value, onChange }) => (
  <div className="dp-field">
    <label>{label}</label>
    {textarea ? (
      <textarea name={name} value={value} onChange={onChange} />
    ) : type === "date" ? (
      <CustomDatePicker value={value} onChange={onChange} />
    ) : options ? (
      <select name={name} value={value} onChange={onChange}>
        <option value="">Select</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange} />
    )}
  </div>
);

const DoctorProfile = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(prev => ({
      ...prev,
      profilePic: file,
      profilePicPreview: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });

      await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/complete-profile`, {
        method: "POST",
        body: formData,
      });

      setSubmitted(true);

    } catch (err) {
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const f = (name) => ({ value: form[name], onChange: handleChange });

  if (submitted) {
    return <h2 style={{ textAlign: "center" }}>✅ Profile Saved</h2>;
  }

  return (
    <div className="dp-page">
      <h1>Doctor Profile</h1>

      <div className="dp-card">

        {step === 0 && (
          <>
            <div>
              {form.profilePicPreview
                ? <img src={form.profilePicPreview} alt="" className="dp-avatar" />
                : <div className="dp-avatar-placeholder">User</div>}
              <input type="file" onChange={handleImageChange} />
            </div>

            <Field label="Full Name" name="fullName" {...f("fullName")} />
            <Field label="DOB" name="dob" type="date" {...f("dob")} />
            <Field label="Gender" name="gender" options={["Male","Female","Other"]} {...f("gender")} />
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Working Days" name="workingDays" {...f("workingDays")} />
            <Field label="Working Hours" name="workingHours" {...f("workingHours")} />
            <Field label="About" name="about" textarea {...f("about")} />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Mobile" name="mobile" {...f("mobile")} />
            <Field label="Emergency Contact" name="emergencyContact" {...f("emergencyContact")} />
            <Field label="Hospital" name="hospitalName" {...f("hospitalName")} />
            <Field label="City" name="city" {...f("city")} />
            <Field label="State" name="state" {...f("state")} />
            <Field label="Map Link" name="mapLink" {...f("mapLink")} />
            <Field label="Address" name="address" {...f("address")} />
          </>
        )}

      </div>

      <div className="dp-actions">
        {step > 0 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 2
          ? <button onClick={() => setStep(s => s + 1)}>Next</button>
          : <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Submit"}
            </button>
        }
      </div>
    </div>
  );
};

export default DoctorProfile;