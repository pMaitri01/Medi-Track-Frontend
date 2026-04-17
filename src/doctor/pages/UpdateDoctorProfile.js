import { useState, useCallback } from "react";
import "../css/UpdateDoctorProfile.css";

// ── SVG Icons ────────────────────────────────────────────────────────────────

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconEdit = ({ color = "white" }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const IconPerson = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#00a99d">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const IconGrad = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#00a99d">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#00a99d">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00a99d" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00a99d" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconDoc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#00a99d">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt12(t) {
  if (!t) return "--";
  const [h, m] = t.split(":").map(Number);
  return `${(h % 12) || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function formatDob(val) {
  if (!val) return "--";
  const d = new Date(val);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ icon, children }) {
  return (
    <div className="section-title">
      {icon}
      {children}
    </div>
  );
}

function Field({ label, viewValue, editing, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {editing ? children : <div className="fval">{viewValue || "--"}</div>}
    </div>
  );
}

function DayChip({ day, active, editing, onToggle }) {
  return (
    <div
      className={`day-chip${active ? "" : " off"}${editing ? " clickable" : ""}`}
      onClick={() => editing && onToggle(day)}
    >
      {day}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_ACTIVE_DAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

const initialForm = {
  gender: "Male",
  dob: "1985-03-15",
  mobile: "+91 98765 43210",
  emg: "+91 90000 12345",
  spec: "Cardiologist",
  qual: "MBBS, MD",
  exp: "12",
  lic: "MH-2024-0042",
  svc: "In-Clinic & Online Consultation",
  clinic: "Mehta Heart Care Center",
  addr: "204 Sarthana Rd, Vesu",
  city: "Surat",
  state: "Gujarat",
  map: "https://maps.google.com/",
  from: "09:00",
  to: "18:00",
  about:
    "Dr. Rajesh Mehta is a highly experienced Cardiologist with over 12 years in the field. He specializes in interventional cardiology and preventive heart care, known for his patient-centric approach.",
};

export default function MediTrackProfile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [snapshot, setSnapshot] = useState(null);
  const [activeDays, setActiveDays] = useState(new Set(DEFAULT_ACTIVE_DAYS));
  const [snapshotDays, setSnapshotDays] = useState(null);
  const [toast, setToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = useCallback((day) => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }, []);

  const handleEdit = () => {
    setSnapshot({ ...form });
    setSnapshotDays(new Set(activeDays));
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleCancel = () => {
    if (snapshot) setForm(snapshot);
    if (snapshotDays) setActiveDays(snapshotDays);
    setEditing(false);
  };

  // Derived display values
  const heroSpec = `${form.spec} · ${form.exp} years experience`;
  const badgeLic = `Lic: ${form.lic}`;
  const badgeCity = `${form.city}, ${form.state}`;

  return (
    <div className="page">

      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-left">
          <button className="back-btn">
            <IconBack /> Dashboard
          </button>
          <span className="topbar-sep">|</span>
          <span className="topbar-title">My <strong>Profile</strong></span>
        </div>
        <div className="topbar-right">
          <div className="notif-btn"><IconBell /></div>
          <div className="avatar-header">DR</div>
        </div>
      </div>

      <div className="content">

        {/* ── Hero Card ── */}
        <div className="profile-hero">
          <div className="avatar-wrap">
            <div className="avatar">DR</div>
            <div className="edit-avatar" title="Change photo">
              <IconEdit />
            </div>
          </div>

          <div className="hero-info">
            <div className="hero-name">Dr. Rajesh Mehta</div>
            <div className="hero-spec">{heroSpec}</div>
            <div className="hero-badges">
              <span className="badge badge-teal">{badgeLic}</span>
              <span className="badge badge-blue">{form.svc}</span>
              <span className="badge badge-amber">{badgeCity}</span>
            </div>
          </div>

          <div className="action-btns">
            {editing && (
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            )}
            {editing ? (
              <button className="edit-btn save" onClick={handleSave}>
                <IconCheck /> Save Changes
              </button>
            ) : (
              <button className="edit-btn" onClick={handleEdit}>
                <IconEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Personal + Professional ── */}
        <div className="grid-2">

          {/* Personal Info */}
          <div className="section-card">
            <SectionTitle icon={<IconPerson />}>Personal Info</SectionTitle>

            <div className="field-row">
              <Field label="GENDER" viewValue={form.gender} editing={editing}>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </Field>
              <Field label="DATE OF BIRTH" viewValue={formatDob(form.dob)} editing={editing}>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} />
              </Field>
            </div>

            <div className="field-row">
              <Field label="MOBILE" viewValue={form.mobile} editing={editing}>
                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} />
              </Field>
              <Field label="EMERGENCY CONTACT" viewValue={form.emg} editing={editing}>
                <input type="tel" name="emg" value={form.emg} onChange={handleChange} />
              </Field>
            </div>
          </div>

          {/* Professional Info */}
          <div className="section-card">
            <SectionTitle icon={<IconGrad />}>Professional Info</SectionTitle>

            <div className="field-row">
              <Field label="SPECIALIZATION" viewValue={form.spec} editing={editing}>
                <input type="text" name="spec" value={form.spec} onChange={handleChange} />
              </Field>
              <Field label="QUALIFICATION" viewValue={form.qual} editing={editing}>
                <input type="text" name="qual" value={form.qual} onChange={handleChange} />
              </Field>
            </div>

            <div className="field-row">
              <Field label="EXPERIENCE (YRS)" viewValue={form.exp} editing={editing}>
                <input type="number" name="exp" value={form.exp} onChange={handleChange} min="0" max="60" />
              </Field>
              <Field label="LICENSE NUMBER" viewValue={form.lic} editing={editing}>
                <input type="text" name="lic" value={form.lic} onChange={handleChange} />
              </Field>
            </div>

            <div className="field-row single">
              <Field label="SERVICE TYPE" viewValue={form.svc} editing={editing}>
                <select name="svc" value={form.svc} onChange={handleChange}>
                  <option>In-Clinic Only</option>
                  <option>In-Clinic &amp; Online Consultation</option>
                  <option>Online Consultation Only</option>
                </select>
              </Field>
            </div>
          </div>

        </div>

        {/* ── Clinic Info ── */}
        <div className="full-card">
          <SectionTitle icon={<IconPin />}>Clinic Info</SectionTitle>

          <div className="field-row">
            <Field label="CLINIC NAME" viewValue={form.clinic} editing={editing}>
              <input type="text" name="clinic" value={form.clinic} onChange={handleChange} />
            </Field>
            <Field label="CLINIC ADDRESS" viewValue={form.addr} editing={editing}>
              <input type="text" name="addr" value={form.addr} onChange={handleChange} />
            </Field>
          </div>

          <div className="field-row triple">
            <Field label="CITY" viewValue={form.city} editing={editing}>
              <input type="text" name="city" value={form.city} onChange={handleChange} />
            </Field>
            <Field label="STATE" viewValue={form.state} editing={editing}>
              <input type="text" name="state" value={form.state} onChange={handleChange} />
            </Field>
            <Field
              label="GOOGLE MAP LINK"
              viewValue={form.map.replace("https://", "").substring(0, 28) + "..."}
              editing={editing}
            >
              <input type="url" name="map" value={form.map} onChange={handleChange} />
            </Field>
          </div>
        </div>

        {/* ── Schedule ── */}
        <div className="grid-2">

          {/* Working Days */}
          <div className="section-card">
            <SectionTitle icon={<IconCalendar />}>Working Days</SectionTitle>
            <div className="days-wrap">
              {ALL_DAYS.map((day) => (
                <DayChip
                  key={day}
                  day={day}
                  active={activeDays.has(day)}
                  editing={editing}
                  onToggle={toggleDay}
                />
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="section-card">
            <SectionTitle icon={<IconClock />}>Working Hours</SectionTitle>
            <div className="field-row">
              <Field label="FROM" viewValue={fmt12(form.from)} editing={editing}>
                <input type="time" name="from" value={form.from} onChange={handleChange} />
              </Field>
              <Field label="TO" viewValue={fmt12(form.to)} editing={editing}>
                <input type="time" name="to" value={form.to} onChange={handleChange} />
              </Field>
            </div>
          </div>

        </div>

        {/* ── About / Bio ── */}
        <div className="full-card" style={{ marginTop: "20px" }}>
          <SectionTitle icon={<IconDoc />}>About / Bio</SectionTitle>
          <div className="field single">
            {editing ? (
              <textarea name="about" value={form.about} onChange={handleChange} />
            ) : (
              <div className="fval about-val">{form.about}</div>
            )}
          </div>
        </div>

      </div>{/* /.content */}

      <div className="footer">© 2026 MediTrack. All rights reserved.</div>

      {/* ── Toast ── */}
      <div className={`toast${toast ? " show" : ""}`}>
        <IconCheck /> Profile updated successfully!
      </div>

    </div>
  );
}
