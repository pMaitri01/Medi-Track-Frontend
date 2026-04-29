import React, { useEffect, useState } from "react";
import "../css/UpdatePatientProfile.css";
import { useNavigate } from "react-router-dom";

// Helpers
const getInitials = (d) =>
  ((d.firstName?.[0] ?? "") + (d.lastName?.[0] ?? "")).toUpperCase();

const formatDob = (dob) =>
  dob
    ? new Date(dob).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const calcAge = (dob) =>
  dob
    ? Math.floor(
        (Date.now() - new Date(dob).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

// Components
const Chip = ({ label, color }) => (
  <span
    className="chip"
    style={{
      background: `${color}15`,
      color: color,
      border: `1px solid ${color}28`,
    }}
  >
    {label}
  </span>
);

const TagRow = ({ text, name, isEditing, onChange, color }) => {
  // Normalize to display string (for view mode chips)
  let values = [];
  if (Array.isArray(text)) {
    values = text.filter(Boolean);
  } else if (typeof text === "string") {
    values = text.split(",").map((v) => v.trim()).filter(Boolean);
  } else if (text) {
    values = [text];
  }

  // In edit mode: use a local raw string so commas are NOT swallowed while typing
  const [rawInput, setRawInput] = React.useState(values.join(", "));

  // Sync rawInput when switching into edit mode with fresh data
  React.useEffect(() => {
    if (isEditing) {
      setRawInput(values.join(", "));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  if (isEditing) {
    return (
      <div>
        <input
          name={name}
          value={rawInput}
          onChange={(e) => {
            const raw = e.target.value;
            setRawInput(raw); // keep raw string so commas are preserved while typing
            onChange({
              target: {
                name,
                value: raw, // send raw string up — handleUpdate will split on save
              },
            });
          }}
          className="field__input"
          placeholder="e.g. Penicillin, Dust, Pollen"
        />
        <small style={{ color: "#888", marginTop: "4px", display: "block" }}>
          Separate multiple values with a comma
        </small>
      </div>
    );
  }

  if (!values.length)
    return <span className="tag-row--empty">Not provided</span>;

  return (
    <div className="tag-row">
      {values.map((t, i) => (
        <Chip key={i} label={t} color={color} />
      ))}
    </div>
  );
};

const Field = ({ label, name, value, isEditing, onChange }) => {
  const safeValue =
    typeof value === "object" ? JSON.stringify(value) : value;

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      {isEditing ? (
        <input
          className="field__input"
          name={name}
          value={safeValue || ""}
          onChange={onChange}
        />
      ) : (
        <div className={`field__value ${!safeValue ? "field__value--empty" : ""}`}>
          {safeValue || "—"}
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ icon, title, children, flex }) => (
  <div className={`section-card ${flex ? "section-card--flex" : ""}`}>
    <div className="section__header">
      <span className="section__icon">{icon}</span>
      <span className="section__title">{title}</span>
    </div>
    <div className="section__body">{children}</div>
  </div>
);

// Main Component
function UpdatePatientProfile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  const goToDashboard = () => navigate("/PatientHome");

  // Fetch from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/patient/get-profile`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.user) {
          setFormData(data.user);
          setOriginalData(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save / Update API
  const handleUpdate = async () => {
    try {
      // Normalize comma fields: trim each item, store as clean comma-separated string
      const normalizeField = (val) => {
        if (Array.isArray(val)) return val.join(", ");
        if (typeof val === "string") return val.split(",").map((v) => v.trim()).filter(Boolean).join(", ");
        return val;
      };

      const payload = {
        ...formData,
        allergies: normalizeField(formData.allergies),
        diseases: normalizeField(formData.diseases),
        medications: normalizeField(formData.medications),
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patient/update-profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Profile Updated ✅");
        setIsEditing(false);
        setOriginalData(formData);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const age = calcAge(formData?.dob);

  return (
    <div className="page-wrapper">
      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar__left">
          <button className="back-btn" onClick={goToDashboard}>
            ‹ Dashboard
          </button>
          <span className="topbar__divider">|</span>
          <span className="topbar__breadcrumb">
            My <strong>Profile</strong>
          </span>
        </div>
        <div className="topbar__right">
          <span className="topbar__bell">🔔</span>
          <div className="avatar avatar--sm">{getInitials(formData)}</div>
        </div>
      </nav>

      <div className="page-body">
        {/* Hero */}
        <div className="hero-card card-in">
          <div className="hero-inner">
            <div className="avatar-wrap">
              <div className="avatar avatar--lg">{getInitials(formData)}</div>
            </div>
            <div>
              <h2 className="hero__name">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="hero__sub">
                Patient {age ? `· ${age} years old` : ""}
              </p>
              <div className="hero__tags">
                {formData.bloodGroup && (
                  <Chip label={`🩸 ${formData.bloodGroup}`} color="#EF4444" />
                )}
                {formData.weight && (
                  <Chip label={`⚖️ ${formData.weight} kg`} color="#14B8A6" />
                )}
                {formData.city && (
                  <Chip
                    label={`📍 ${formData.city}, ${formData.state}`}
                    color="#F59E0B"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Edit / Save / Cancel buttons */}
          <div className="hero-actions">
            {!isEditing ? (
              <button className="teal-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button className="teal-btn" onClick={handleUpdate}>
                  💾 Save
                </button>
                <button className="teal-btn" onClick={handleCancel}>
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content — same layout as Code 1 */}
        <div className="cols">
          {/* Row 1 */}
          <div className="row side-by-side card-in card-in--d1">
            <SectionCard icon="👤" title="Personal Info" flex>
              <div className="two-col">
                <Field
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <Field
                  label="Date of Birth"
                  name="dob"
                  value={isEditing ? formData.dob : formatDob(formData.dob)}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <Field
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <Field
                  label="Emergency Contact"
                  name="emergencyMobile"
                  value={formData.emergencyContact?.mobile}
                  isEditing={isEditing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact,
                        mobile: e.target.value,
                      },
                    })
                  }
                />
                <Field
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <Field
                  label="Weight"
                  name="weight"
                  value={
                    isEditing
                      ? formData.weight
                      : formData.weight
                      ? `${formData.weight} kg`
                      : null
                  }
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>
            </SectionCard>

            <SectionCard icon="📧" title="Contact Info" flex>
              <div className="stack">
                <Field
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <Field
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <Field
                  label="Emergency Name"
                  name="emergencyName"
                  value={formData.emergencyContact?.name}
                  isEditing={isEditing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: {
                        ...formData.emergencyContact,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </SectionCard>
          </div>

          {/* Row 2 */}
          <div className="card-in card-in--d2">
            <SectionCard icon="📍" title="Address Info">
              <div className="stack">
                <Field
                  label="Street / Locality"
                  name="address"
                  value={formData.address}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <div className="three-col">
                  <Field
                    label="City"
                    name="city"
                    value={formData.city}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <Field
                    label="State"
                    name="state"
                    value={formData.state}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                  <Field
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Row 3 */}
          <div className="row side-by-side card-in card-in--d3">
            <SectionCard icon="⚠️" title="Allergies" flex>
              <TagRow
                text={formData.allergies}
                name="allergies"
                isEditing={isEditing}
                onChange={handleChange}
                color="#EF4444"
              />
            </SectionCard>

            <SectionCard icon="🫀" title="Conditions / Diseases" flex>
              <TagRow
                text={formData.diseases}
                name="diseases"
                isEditing={isEditing}
                onChange={handleChange}
                color="#8B5CF6"
              />
            </SectionCard>
          </div>

          {/* Row 4 */}
          <div className="card-in card-in--d4">
            <SectionCard icon="💊" title="Current Medications">
              <TagRow
                text={formData.medications}
                name="medications"
                isEditing={isEditing}
                onChange={handleChange}
                color="#0EA5E9"
              />
            </SectionCard>
          </div>
        </div>

        <div className="footer">© 2026 MediTrack. All rights reserved.</div>
      </div>
    </div>
  );
}

export default UpdatePatientProfile;