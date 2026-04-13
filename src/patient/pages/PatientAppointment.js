import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/PatientAppointment.css";
import defaultDoctorImg from "../images/user.png";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

// strictly AFTER today — today's appointments go to Past
const isUpcoming = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d > TODAY;
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// upcoming → nearest first (ascending)
const byDateAsc  = (a, b) => new Date(a.date) - new Date(b.date);
// past     → most recent first (descending)
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
function AppointmentCard({ appt, onCancel, isNext }) {
  const upcoming = isUpcoming(appt.date);
  const badge = getBadge(appt.status);

  return (
    <div className={`pa-doc-card${isNext ? " pa-doc-card--next" : ""}`}>
      {isNext && <span className="pa-next-badge">📌 Next Appointment</span>}

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

        {/* {upcoming && (
          <div className="pa-doc-actions">
            <button
              className="pa-btn-reschedule"
              onClick={() => alert(`Reschedule: ${appt.id}`)}
            >
              📆 Reschedule
            </button>
            <button
              className="pa-btn-cancel"
              onClick={() => onCancel(appt.id)}            >
              ✖ Cancel
            </button>
          </div>
        )} */}

        {upcoming && appt.status !== "cancelled" && appt.status !== "completed" && (
          <div className="pa-doc-actions">
            <button
              className="pa-btn-reschedule"
              onClick={() => alert(`Reschedule: ${appt.id}`)}
            >
              📆 Reschedule
            </button>
            {/* <button
              className="pa-btn-cancel"
              onClick={() => onCancel(appt.id)}
            >
              ✖ Cancel
            </button> */}
            <button
  className="pa-btn-cancel"
  onClick={() => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (confirmCancel) {
      onCancel(appt.id);
    }
  }}
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
function Section({ title, appointments, onCancel, highlightFirst }) {
  return (
    <section className="pa-section">
      <h2 className="pa-section-title">{title}</h2>
      {appointments.length === 0 ? (
        <p className="pa-empty">No appointments found.</p>
      ) : (
        <div className="pa-grid">
          {appointments.map((appt, idx) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onCancel={onCancel}
              isNext={highlightFirst && idx === 0}
            />
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

  
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

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

      const mapped = data
        .filter((item) => {
          if (!item.patient) return false;

          if (typeof item.patient === "object") {
            return item.patient._id === userId;
          }

          return item.patient === userId;
        })
        .map((item) => ({
          id: item._id,
          doctorName:
            item.doctor?.fullName || item.doctorName || "Unknown Doctor",
          specialization:
            item.doctor?.specialization || item.specialization,
          date: item.date,
          time: item.time || "—",
          status: item.status || "Pending",
        }));

      setAppointments(mapped);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/appointment/${appointmentId}/cancel`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to cancel appointment");
    }

    // ✅ Update UI instantly (without reload)
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === appointmentId
          ? { ...appt, status: "cancelled" }
          : appt
      )
    );

    alert("Appointment cancelled successfully");

  } catch (error) {
    alert(error.message);
  }
};

const upcoming = appointments
  .filter((a) => {
    const upcomingDate = isUpcoming(a.date);

    // ❌ Cancelled should NOT be in upcoming
    if (a.status === "cancelled") return false;

    // ✅ Rejected stays in upcoming UNTIL date passes
    if (a.status === "rejected") return upcomingDate;

    // ✅ Normal upcoming logic
    return upcomingDate;
  })
  .sort(byDateAsc);

const past = appointments
  .filter((a) => {
    const upcomingDate = isUpcoming(a.date);

    // ✅ Cancelled ALWAYS goes to past immediately
    if (a.status === "cancelled") return true;

    // ✅ Rejected goes to past AFTER date passes
    if (a.status === "rejected") return !upcomingDate;

    // ✅ Normal past logic
    return !upcomingDate;
  })
  .sort(byDateDesc);

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
              onCancel={handleCancelAppointment}   
              highlightFirst
            />
            <Section
              title="Past Appointments"
              appointments={past}
              onCancel={handleCancelAppointment}   // ✅ correct
            />
          </>
        )}
      </main>
    </div>
  );
}
