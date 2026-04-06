import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/PatientAppointment.css";
import defaultDoctorImg from "../images/user.png";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const isUpcoming = (dateStr) => new Date(dateStr) >= TODAY;

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

const STATUS_META = {
  confirmed:  { label: "Confirmed",  cls: "pa-badge--confirmed"  },
  completed:  { label: "Completed",  cls: "pa-badge--completed"  },
  cancelled:  { label: "Cancelled",  cls: "pa-badge--cancelled"  },
  rejected:   { label: "Rejected",   cls: "pa-badge--rejected"   },
  pending:    { label: "Pending",    cls: "pa-badge--pending"    },
};

const getBadge = (status = "") => {
  const key = status.toLowerCase();
  return STATUS_META[key] || { label: status, cls: "" };
};

// ── Appointment Card ────────────────────────────────────────────────────────
function AppointmentCard({ appt, onCancel }) {
  const upcoming = isUpcoming(appt.date);
  const badge = getBadge(appt.status);

  return (
    <div className="pa-doc-card">
      {/* Top info row — mirrors doc-card layout */}
      <div className="pa-doc-info">
        <img src={defaultDoctorImg} alt="doctor" className="pa-doc-img" />
        <div className="pa-doc-text">
          <h3>{appt.doctorName}</h3>
          <span className="pa-spec-tag">{appt.specialization}</span>
          <p>📅 {formatDate(appt.date)}</p>
          <p>🕐 {appt.time}</p>
        </div>
      </div>

      {/* Status + footer */}
      <div className="pa-card-footer">
        <span className={`pa-badge ${badge.cls}`}>{badge.label}</span>

        {upcoming && (
          <div className="pa-doc-actions">
            <button
              className="pa-btn-reschedule"
              onClick={() => alert(`Reschedule: ${appt.id}`)}
            >
              📆 Reschedule
            </button>
            <button
              className="pa-btn-cancel"
              onClick={() => onCancel(appt.id)}
            >
              ✖ Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section block ───────────────────────────────────────────────────────────
function Section({ title, appointments, onCancel }) {
  return (
    <section className="pa-section">
      <h2 className="pa-section-title">{title}</h2>
      {appointments.length === 0 ? (
        <p className="pa-empty">No appointments found.</p>
      ) : (
        <div className="pa-grid">
          {appointments.map((appt) => (
            <AppointmentCard key={appt.id} appt={appt} onCancel={onCancel} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function PatientAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/all`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch appointments.");
      const data = await res.json();

      // Normalise backend shape → UI shape
      const mapped = data.map((item) => ({
        id:             item._id,
        doctorName:     item.doctor?.fullName  || item.doctorName  || "Unknown Doctor",
        specialization: item.doctor?.specialization || item.specialization || "—",
        date:           item.date,
        time:           item.time || "—",
        status:         item.status || "Pending",
      }));

      setAppointments(mapped);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
    );
  };

  const upcoming = appointments.filter((a) => isUpcoming(a.date)).sort(byDateDesc);
  const past     = appointments.filter((a) => !isUpcoming(a.date)).sort(byDateDesc);

  return (
    <div className="pa-page">
      <Navbar />

      <main className="pa-content">
        {/* Page heading — same style as "Find a Doctor" bar */}
        <div className="pa-page-nav">
          <span className="pa-page-icon">🗓</span>
          <h1 className="pa-heading">My Appointments</h1>
        </div>

        {loading ? (
          <div className="pa-state-center">
            <div className="pa-spinner" />
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="pa-state-center pa-state--error">
            <p>⚠️ {error}</p>
            <button className="pa-btn-reschedule" onClick={loadAppointments}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <Section
              title="Upcoming Appointments"
              appointments={upcoming}
              onCancel={handleCancel}
            />
            <Section
              title="Past Appointments"
              appointments={past}
              onCancel={handleCancel}
            />
          </>
        )}
      </main>
    </div>
  );
}
