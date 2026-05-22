import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/PatientAppointment.css";
import RescheduleAppointment from "./RescheduleAppointment";
import defaultDoctorImg from "../images/user.png";
import { toast } from "react-toastify";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const isUpcoming = (dateStr, timeStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  if (isNaN(date)) return false;

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
  return date > now;
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

const byDateAsc = (a, b) => getDateTime(a.date, a.time) - getDateTime(b.date, b.time);
const byDateDesc = (a, b) => getDateTime(b.date, b.time) - getDateTime(a.date, a.time);

const STATUS_META = {
  approved: { label: "approved", cls: "PatApp-pa-badge--approved" },
  completed: { label: "Completed", cls: "PatApp-pa-badge--completed" },
  cancelled: { label: "Cancelled", cls: "PatApp-pa-badge--cancelled" },
  rejected: { label: "Rejected", cls: "PatApp-pa-badge--rejected" },
  pending: { label: "Pending", cls: "PatApp-pa-badge--pending" },
};

const getBadge = (status = "") => {
  const key = status.toLowerCase();
  return STATUS_META[key] || { label: status, cls: "" };
};

function AppointmentCard({ appt, onCancel, onStartConsultation, isNext, onViewDetails, onReschedule }) {
  const upcoming = isUpcoming(appt.date, appt.time);
  const badge = getBadge(appt.status);
  const canJoinVideoCall = (() => {
    if (appt.type?.toLowerCase() !== "videocall") return false;
    const validStatus = ["approved", "accepted", "confirmed"].includes(appt.status?.toLowerCase());
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
    const diff = (appointmentTime - now) / (1000 * 60);
    return diff <= 10 && diff >= -30;
  })();

  return (
    <div className={`PatApp-pa-doc-card${isNext ? " PatApp-pa-doc-card--next" : ""}`} onClick={() => onViewDetails(appt)}
      style={{ cursor: "pointer" }}>
      {isNext && <span className="PatApp-pa-next-badge">📌 Next Appointment</span>}
      <span className={`PatApp-pa-badge PatApp-pa-badge--top ${badge.cls}`}>
        {badge.label}
      </span>
      <div className="PatApp-pa-doc-info">
        <img src={defaultDoctorImg} alt="doctor" className="PatApp-pa-doc-img" />
        <div className="PatApp-pa-doc-text">
          <h3>{appt.doctorName}</h3>
          <span className="PatApp-pa-spec-tag">{appt.specialization}</span>
          <p>📅 {formatDate(appt.date)}</p>
          <p>🕐 {appt.time}</p>
          <p>
            {appt.type?.toLowerCase() === "videocall" ? "🎥 Video Consultation" : "🏥 In-Clinic Visit"}
          </p>
        </div>
      </div>

      <div className="PatApp-pa-card-footer">
        {upcoming && appt.status !== "cancelled" && appt.status !== "completed" && appt.status !== "rejected" &&(
          <div className="PatApp-pa-doc-actions">
            <button
              className="PatApp-pa-btn-reschedule"
              onClick={(e) => {
                e.stopPropagation();
                onReschedule(appt);
              }}
            >
              📆 Reschedule
            </button>

            <button
              className="PatApp-pa-btn-cancel"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to cancel this appointment?")) {
                  onCancel(appt.id);
                }
              }}
            >
              ✖ Cancel
            </button>

            {appt.type?.toLowerCase() === "videocall" && (
              canJoinVideoCall ? (
                <button
                  className="PatApp-pa-btn-consult"
                  onClick={(e) => {
                    e.stopPropagation();
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

function Section({ title, appointments, onCancel, onStartConsultation, nextAppointmentId, onViewDetails, onReschedule }) {
  return (
    <section className="PatApp-pa-section">
      <h2 className="PatApp-pa-section-title">{title}</h2>
      {appointments.length === 0 ? (
        <p className="PatApp-pa-empty">No appointments found.</p>
      ) : (
        <div className="PatApp-pa-grid">
          {appointments.map((appt) => (
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

export default function PatientAppointment() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showReschedule, setShowReschedule] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewPopup, setReviewPopup] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    loadAppointments();
  }, []);
  useEffect(() => {
    if (appointments.length === 0) return;

    const pending = appointments.find(
      (a) => a.status === "completed" && !a.reviewHandled
    );

    if (pending) {
      setReviewPopup(pending);
    }
  }, [appointments]);

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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/all`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch appointments.");
      const data = await res.json();
      const mapped = data
        .filter((item) => {
          if (!item.patient) return false;
          return (typeof item.patient === "object") ? item.patient._id === userId : item.patient === userId;
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
          reviewHandled: item.reviewHandled || false

        }));
      setAppointments(mapped);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitReview = async () => {
  if (!reviewPopup) return;

  // ✅ VALIDATION (ADD THIS PART)
  if (rating === 0) {
    toast.error("Please select a rating");
    return;
  }

  if (!reviewText.trim()) {
    toast.error("Please write your review");
    return;
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/review/submit-review`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: reviewPopup.id,
        rating: rating,
        comment: reviewText,
      }),
    });

    if (!res.ok) throw new Error("Failed to submit review");

    toast.success("Review submitted successfully ✅");

    setReviewPopup(null);
    setReviewText("");
    setRating(0);

    loadAppointments(); // refresh
  } catch (err) {
    toast.error(err.message);
  }
};
  const handleSkipReview = async () => {
    if (!reviewPopup) return;
    await fetch(`${process.env.REACT_APP_API_URL}/api/review/skip-review`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: reviewPopup.id,
      }),
    });

    setReviewPopup(null);
    loadAppointments(); // refresh
  };
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/${appointmentId}/cancel`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel appointment");
      setAppointments((prev) => prev.map((appt) => appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt));
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Failed to cancel appointment");
    }
  };

  const upcoming = appointments
    .filter((a) => {
      const upcomingDate = isUpcoming(a.date, a.time);
      if (a.status === "cancelled") return false;
      if (a.status === "rejected") return upcomingDate;
      return upcomingDate;
    })
    .sort(byDateAsc);

  const nextAppointmentId = upcoming.find((a) => isFutureAppointment(a.date, a.time))?.id;

  const past = appointments
    .filter((a) => {
      const upcomingDate = isUpcoming(a.date, a.time);
      if (a.status === "cancelled") return true;
      if (a.status === "rejected") return !upcomingDate;
      return !upcomingDate;
    })
    .sort(byDateDesc);

  const handleStartConsultation = (appointment) => {
    navigate(`/video-call/${appointment.id}`);
  };

  return (
    <div className="PatApp-pa-page">
      <Navbar />
      <main className="PatApp-pa-content">
        <div className="PatApp-pa-page-nav">
          <span className="PatApp-pa-page-icon">🗓</span>
          <h1 className="PatApp-pa-heading">My Appointments</h1>
        </div>

        {loading ? (
          <div className="PatApp-pa-state-center">
            <div className="PatApp-pa-spinner" />
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="PatApp-pa-state-center PatApp-pa-state--error">
            <p>⚠️ {error}</p>
            <button className="PatApp-pa-btn-reschedule" onClick={loadAppointments}>Retry</button>
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
              onCancel={handleCancelAppointment}
              onStartConsultation={handleStartConsultation}
              onViewDetails={handleViewDetails}
            />
          </>
        )}
      </main>

      {showModal && selectedAppointment && (
        <div className="PatApp-pa-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="PatApp-pa-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Appointment Details</h2>
            <p><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
            <p><strong>Specialization:</strong> {selectedAppointment.specialization}</p>
            <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
            <p><strong>Time:</strong> {selectedAppointment.time}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Type:</strong> {selectedAppointment.type === "videocall" ? "Video Consultation" : "In-Clinic"}</p>
            <button className="PatApp-pa-btn-cancel" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showReschedule && selectedAppointment && (
        <div className="PatApp-pa-modal-overlay" onClick={() => setShowReschedule(false)}>
          <div className="PatApp-pa-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "900px", width: "95%" }}>
            <RescheduleAppointment appointment={selectedAppointment} onClose={() => setShowReschedule(false)} />
          </div>
        </div>
      )}
      {reviewPopup && (
        <div className="PatApp-pa-modal-overlay">
          <div className="PatApp-pa-modal review-modal">

            <h5 className="review-title">
              ⭐ Rate Your Doctor For Recent Appointment
            </h5>

            {/* Doctor Name */}
            <div className="review-field">
              <label>Doctor</label>
              <input
                type="text"
                value={reviewPopup.doctorName}
                readOnly
              />
            </div>

            {/* Star Rating */}
            <div className="review-field">
              <label>Rating</label>
              <div className="star-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? "star active" : "star"}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="review-field">
              <label>Write your experience</label>
              <textarea
                placeholder="Share your experience with the doctor..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="review-actions">
              <button
                className="review-submit"
                onClick={handleSubmitReview}
              >
                Submit Review
              </button>

              <button
                className="review-close"
                onClick={handleSkipReview}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}