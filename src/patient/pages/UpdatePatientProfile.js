import React from "react";
import "../css/UpdatePatientProfile.css";
import { useNavigate } from "react-router-dom";

const MOCK = {
  firstName: "Rahul",
  lastName: "Sharma",
  gender: "Male",
  dob: "1992-07-14",
  mobile: "+91 98765 43210",
  email: "rahul.sharma@email.com",
  address: "B-204, Sunrise Apartments, Adajan Road",
  city: "Surat",
  state: "Gujarat",
  pincode: "395009",
  bloodGroup: "B+",
  allergies: "Penicillin, Dust mites",
  diseases: "Type 2 Diabetes, Hypertension",
  medications: "Metformin 500mg (twice daily), Amlodipine 5mg",
  weight: "74",
  emergencyContact: "+91 91234 56789",
};

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

const TagRow = ({ text, color }) => {
  if (!text) return <span className="tag-row--empty">Not provided</span>;

  return (
    <div className="tag-row">
      {text.split(",").map((t, i) => (
        <Chip key={i} label={t.trim()} color={color} />
      ))}
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="field">
    <span className="field__label">{label}</span>
    <div className={`field__value ${!value ? "field__value--empty" : ""}`}>
      {value || "—"}
    </div>
  </div>
);

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
function PatientProfilePage() {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/PatientHome"); // match your route
  };
  const age = calcAge(MOCK.dob);

  return (
    <div className="page-wrapper">
      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar__left">
          <button className="back-btn" onClick={goToDashboard}>‹ Dashboard</button>
          <span className="topbar__divider">|</span>
          <span className="topbar__breadcrumb">
            My <strong>Profile</strong>
          </span>
        </div>

        <div className="topbar__right">
          <span className="topbar__bell">🔔</span>
          <div className="avatar avatar--sm">{getInitials(MOCK)}</div>
        </div>
      </nav>

      <div className="page-body">
        {/* Hero */}
        <div className="hero-card card-in">
          <div className="hero-inner">
            <div className="avatar-wrap">
              <div className="avatar avatar--lg">
                {getInitials(MOCK)}
              </div>
              <div className="avatar__badge">✏️</div>
            </div>

            <div>
              <h2 className="hero__name">
                {MOCK.firstName} {MOCK.lastName}
              </h2>

              <p className="hero__sub">
                Patient {age ? `· ${age} years old` : ""}
              </p>

              <div className="hero__tags">
                {MOCK.bloodGroup && (
                  <Chip label={`🩸 ${MOCK.bloodGroup}`} color="#EF4444" />
                )}
                {MOCK.weight && (
                  <Chip label={`⚖️ ${MOCK.weight} kg`} color="#14B8A6" />
                )}
                {MOCK.city && (
                  <Chip
                    label={`📍 ${MOCK.city}, ${MOCK.state}`}
                    color="#F59E0B"
                  />
                )}
              </div>
            </div>
          </div>

          <button className="teal-btn">✏️ Edit Profile</button>
        </div>

        {/* Content */}
        <div className="cols">
          {/* Row 1 */}
          <div className="row side-by-side card-in card-in--d1">
            <SectionCard icon="👤" title="Personal Info" flex>
              <div className="two-col">
                <Field label="Gender" value={MOCK.gender} />
                <Field label="Date of Birth" value={formatDob(MOCK.dob)} />
                <Field label="Mobile" value={MOCK.mobile} />
                <Field
                  label="Emergency Contact"
                  value={MOCK.emergencyContact}
                />
                <Field label="Blood Group" value={MOCK.bloodGroup} />
                <Field
                  label="Weight"
                  value={MOCK.weight ? `${MOCK.weight} kg` : null}
                />
              </div>
            </SectionCard>

            <SectionCard icon="📧" title="Contact Info" flex>
              <div className="stack">
                <Field label="Email Address" value={MOCK.email} />
                <Field label="Mobile Number" value={MOCK.mobile} />
                <Field
                  label="Emergency Contact"
                  value={MOCK.emergencyContact}
                />
              </div>
            </SectionCard>
          </div>

          {/* Row 2 */}
          <div className="card-in card-in--d2">
            <SectionCard icon="📍" title="Address Info">
              <div className="stack">
                <Field label="Street / Locality" value={MOCK.address} />
                <div className="three-col">
                  <Field label="City" value={MOCK.city} />
                  <Field label="State" value={MOCK.state} />
                  <Field label="Pincode" value={MOCK.pincode} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Row 3 */}
          <div className="row side-by-side card-in card-in--d3">
            <SectionCard icon="⚠️" title="Allergies" flex>
              <TagRow text={MOCK.allergies} color="#EF4444" />
            </SectionCard>

            <SectionCard icon="🫀" title="Conditions / Diseases" flex>
              <TagRow text={MOCK.diseases} color="#8B5CF6" />
            </SectionCard>
          </div>

          {/* Row 4 */}
          <div className="card-in card-in--d4">
            <SectionCard icon="💊" title="Current Medications">
              <TagRow text={MOCK.medications} color="#0EA5E9" />
            </SectionCard>
          </div>
        </div>

        <div className="footer">
          © 2026 MediTrack. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default PatientProfilePage;
