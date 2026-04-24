import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/PatientAppointment.css";
import RescheduleAppointment from "./RescheduleAppointment";
import defaultDoctorImg from "../images/user.png";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

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

  const bufferTime = new Date(date.getTime() + 30 * 60000);

  return bufferTime > now;

};


const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const isFutureAppointment = (dateStr, timeStr) => {
  const now = new Date();
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

  return date > now; // ❗ NO BUFFER
};
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
  approved: { label: "approved", cls: "pa-badge--approved" },
  completed: { label: "Completed", cls: "pa-badge--completed" },
  cancelled: { label: "Cancelled", cls: "pa-badge--cancelled" },
  rejected: { label: "Rejected", cls: "pa-badge--rejected" },
  pending: { label: "Pending", cls: "pa-badge--pending" },
};

const getBadge = (status = "") => {
  const key = status.toLowerCase();
  return STATUS_META[key] || { label: status, cls: "" };
};

// ── Appointment Card ────────────────────────────────────────────────────────
function AppointmentCard({ appt, onCancel, onStartConsultation, isNext, onViewDetails, onReschedule }) {
  const upcoming = isUpcoming(appt.date, appt.time);
  const badge = getBadge(appt.status);
  // const canJoinVideoCall =
  //   appt.type?.toLowerCase() === "video" &&
  //   ["approved", "accepted", "confirmed"].includes(appt.status?.toLowerCase()) &&
  //   upcoming;
  const canJoinVideoCall = (() => {
    if (appt.type?.toLowerCase() !== "videocall") return false;

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

    // ✅ Show from 10 min before to 30 min after
    return diff <= 10 && diff >= -30;
  })();
  return (
    <div className={`pa-doc-card${isNext ? " pa-doc-card--next" : ""}`} onClick={() => onViewDetails(appt)}
      style={{ cursor: "pointer" }}>
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
            {appt.type?.toLowerCase() === "videocall" ? "🎥 Video Consultation" : "🏥 In-Clinic Visit"}
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

            {/* ✅ RESCHEDULE */}
            <button
              className="pa-btn-reschedule"
              onClick={(e) => {
                e.stopPropagation();
                onReschedule(appt);
              }}
            >
              📆 Reschedule
            </button>

            {/* ✅ CANCEL */}
            <button
              className="pa-btn-cancel"
              onClick={(e) => {
                e.stopPropagation();   // 🔥 IMPORTANT
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

            {/* ✅ VIDEO CALL */}
            {appt.type?.toLowerCase() === "videocall" && (
              canJoinVideoCall ? (
                <button
                  className="pa-btn-consult"
                  onClick={(e) => {
                    e.stopPropagation();   // 🔥 IMPORTANT
                    onStartConsultation(appt);
                  }}
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
  nextAppointmentId,
  onViewDetails,
  onReschedule
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
              isNext={appt.id === nextAppointmentId}
              onViewDetails={onViewDetails}
              onReschedule={onReschedule}
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
  const [showReschedule, setShowReschedule] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    loadAppointments();
  }, []);


  // const user = JSON.parse(localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const handleViewDetails = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  const handleReschedule = (appt) => {
    setSelectedAppointment({
      id: appt.id,
      doctorId: appt.doctorId,
      doctorName: appt.doctorName,
      specialization: appt.specialization,
      date: appt.date,
      time: appt.time,
      type: (appt.type || "").toLowerCase(),
    });

    setShowReschedule(true);
  };

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
          doctorName: `Dr. ${item.doctor?.fullName || item.doctorName || "Unknown Doctor"}`,
          specialization: item.doctor?.specialization || item.specialization,
          doctorId: item.doctor?._id || item.doctor,
          date: item.date,
          time: item.time || "—",
          status: item.status || "Pending",
          type: (item.type || item.appointmentType || "").toLowerCase(),
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
  const nextAppointmentId = upcoming.find((a) =>
    isFutureAppointment(a.date, a.time)
  )?.id;

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
    navigate(`/video-call/${appointment.id}`);
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
              nextAppointmentId={nextAppointmentId}
              onViewDetails={handleViewDetails}
              onReschedule={handleReschedule}
            />
            <Section
              title="Past Appointments"
              appointments={past}
              onCancel={handleCancelAppointment}   // ✅ correct
              onStartConsultation={handleStartConsultation}
              onViewDetails={handleViewDetails}
            />
          </>
        )}
      </main>
      {showModal && selectedAppointment && (
        <div className="pa-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="pa-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Appointment Details</h2>

            <p><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
            <p><strong>Specialization:</strong> {selectedAppointment.specialization}</p>
            <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
            <p><strong>Time:</strong> {selectedAppointment.time}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p>
              <strong>Type:</strong>{" "}
              {selectedAppointment.type === "videocall"
                ? "Video Consultation"
                : "In-Clinic"}
            </p>

            <button
              className="pa-btn-cancel"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showReschedule && selectedAppointment && (
        <div
          className="pa-modal-overlay"
          onClick={() => setShowReschedule(false)}
        >
          <div
            className="pa-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px", width: "95%" }} // optional for bigger UI
          >
            <RescheduleAppointment
              appointment={selectedAppointment}
              onClose={() => setShowReschedule(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
