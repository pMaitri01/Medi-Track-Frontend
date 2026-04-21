import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/PatientAppointment.css";
import defaultDoctorImg from "../images/user.png";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

// strictly AFTER today — today's appointments go to Past
// const isUpcoming = (dateStr) => {
//   const d = new Date(dateStr);
//   d.setHours(0, 0, 0, 0);
//   return d > TODAY;
// };

// code of date when appointment is book date is store as same
const isUpcoming = (dateStr, timeStr) => {
  const now = new Date();

  const date = new Date(dateStr); // works for "22 Apr 2026"

  if (isNaN(date)) return false; // safety

  let hours = 0;
  let minutes = 0;

  if (timeStr) {
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      const [time, modifier] = timeStr.split(" ");
      let [h, m] = time.split(":");

      hours = parseInt(h, 10);
      minutes = parseInt(m, 10);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
    } else {
      const [h, m] = timeStr.split(":");
      hours = parseInt(h, 10);
      minutes = parseInt(m, 10);
    }
  }

  date.setHours(hours, minutes, 0, 0);

  return date > now;
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getDateTime = (dateStr, timeStr) => {
  const date = new Date(dateStr);

  if (timeStr) {
    let [time, modifier] = timeStr.split(" ");
    let [h, m] = time.split(":");

    let hours = parseInt(h, 10);
    let minutes = parseInt(m, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
  }

  return date;
};

// upcoming → nearest first (ascending)
const byDateAsc = (a, b) => {
  return getDateTime(a.date, a.time) - getDateTime(b.date, b.time);
};
// past → most recent first (descending)
const byDateDesc = (a, b) => {
return getDateTime(b.date, b.time) - getDateTime(a.date, a.time);
};

const STATUS_META = {
  approved:  { label: "approved",  cls: "pa-badge--approved"  },
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
function AppointmentCard({ appt, onCancel, onStartConsultation, isNext }) {
  const upcoming = isUpcoming(appt.date, appt.time);
  const badge = getBadge(appt.status);
  // const canJoinVideoCall =
  //   appt.type?.toLowerCase() === "video" &&
  //   ["approved", "accepted", "confirmed"].includes(appt.status?.toLowerCase()) &&
  //   upcoming;
const canJoinVideoCall = (() => {
  if (appt.type?.toLowerCase() !== "video") return false;

  const validStatus = ["approved", "accepted", "confirmed"].includes(
    appt.status?.toLowerCase()
  );

  if (!validStatus) return false;

  const now = new Date();
  const appointmentTime = new Date(appt.date);

  if (appt.time) {
    let [time, modifier] = appt.time.split(" ");
    let [h, m] = time.split(":");

    let hours = parseInt(h, 10);
    let minutes = parseInt(m, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    appointmentTime.setHours(hours, minutes, 0, 0);
  }

  // allow join 15 mins before
  const diff = (appointmentTime - now) / (1000 * 60);

  return diff <= 15 && diff >= -60; 
  // allow till 1 hour after start also
})();
  return (
    <div className={`pa-doc-card${isNext ? " pa-doc-card--next" : ""}`}>
      {isNext && <span className="pa-next-badge">📌 Next Appointment</span>}
      <span className={`pa-badge pa-badge--top ${badge.cls}`}>
  {badge.label}
</span>
      {/* Top info row — mirrors doc-card layout */}
      <div className="pa-doc-info">
        <img src={defaultDoctorImg} alt="doctor" className="pa-doc-img" />
        <div className="pa-doc-text">
          <h3>{appt.doctorName}</h3>
          <span className="pa-spec-tag">{appt.specialization}</span>
          <p>📅 {formatDate(appt.date)}</p>
<p>🕐 {appt.time}</p>
<p>
  {appt.type?.toLowerCase() === "video" ? "🎥 Video Consultation" : "🏥 In-Clinic Visit"}
</p>
        </div>
      </div>

      {/* Status + footer */}
      <div className="pa-card-footer">

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
           {appt.type?.toLowerCase() === "video" && (
  canJoinVideoCall ? (
    <button
      className="pa-btn-consult"
      onClick={() => onStartConsultation(appt)}
    >
      🎥 Join Call
    </button>
  ) : (
    <p style={{ fontSize: "12px", color: "#888" }}>
      Call will be available near appointment time
    </p>
  )
)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section block ───────────────────────────────────────────────────────────
function Section({
  title,
  appointments,
  onCancel,
  onStartConsultation,
  highlightFirst,
}) {
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
              onStartConsultation={onStartConsultation}
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
  const navigate = useNavigate();
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
          doctorId: item.doctor?._id || item.doctor,
          date: item.date,
          time: item.time || "—",
          status: item.status || "Pending",
          type: item.type || item.appointmentType || "offline",
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
    const upcomingDate = isUpcoming(a.date, a.time);

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
    const upcomingDate = isUpcoming(a.date, a.time);

    // ✅ Cancelled ALWAYS goes to past immediately
    if (a.status === "cancelled") return true;

    // ✅ Rejected goes to past AFTER date passes
    if (a.status === "rejected") return !upcomingDate;

    // ✅ Normal past logic
    return !upcomingDate;
  })
  .sort(byDateDesc);

  const handleStartConsultation = (appointment) => {
    navigate(`/video-call/${appointment.id}?role=patient`, {
      state: {
        role: "patient",
        doctorId: appointment.doctorId,
      },
    });
  };

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
              onStartConsultation={handleStartConsultation}
              highlightFirst
            />
            <Section
              title="Past Appointments"
              appointments={past}
              onCancel={handleCancelAppointment}   // ✅ correct
              onStartConsultation={handleStartConsultation}
            />
          </>
        )}
      </main>
    </div>
  );
}
