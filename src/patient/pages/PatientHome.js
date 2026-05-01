import React, { useState, useEffect } from 'react';
import '../css/PatientHome.css';
import doctorProfile from '../images/profile.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '../components/Navbar';
import BookAppointment from './BookAppointment';
import { useNavigate } from "react-router-dom";
import UploadMedicalRecord from './UploadMedicalRecord';
import PrescriptionModal from './PrescriptionModal';
import Review from "./Review";
import RescheduleAppointment from './RescheduleAppointment';

const PatientHome = () => {
  const [reviews, setReviews] = useState([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loadingAppt, setLoadingAppt] = useState(true);
  const [newReviewText, setNewReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [showReview, setShowReview] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/all`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch appointments");

        const user = JSON.parse(localStorage.getItem("user") || "{}");

        // ✅ Filter logged-in patient's upcoming appointments
        const now = new Date();

        const upcoming = data
          .filter((appt) => {
            const patientId =
              typeof appt.patient === "object"
                ? appt.patient._id
                : appt.patient;

            const endTime = getAppointmentEndTime(appt.date, appt.time);

            return (
              patientId === user._id &&
              appt.status !== "cancelled" &&
              endTime > now
            );
          })
          .sort(
            (a, b) =>
              parseDateTime(a.date, a.time) - parseDateTime(b.date, b.time)
          )[0];

        setUpcomingAppointment(upcoming);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAppt(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleReschedule = () => {
    if (!upcomingAppointment) return;

    setSelectedAppointment({
      id: upcomingAppointment._id,
      doctorId: upcomingAppointment.doctor?._id,
      doctorName: `Dr. ${upcomingAppointment.doctor?.fullName}`,
      specialization: upcomingAppointment.doctor?.specialization,
      date: upcomingAppointment.date,
      time: upcomingAppointment.time,
      type: (upcomingAppointment.type || "").toLowerCase(),
    });

    setShowReschedule(true);
  };

  const parseDateTime = (date, time) => {
    const d = new Date(date);

    if (!time) return d;

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    d.setHours(hours);
    d.setMinutes(minutes);
    d.setSeconds(0);

    return d;
  };
  const getAppointmentEndTime = (date, time) => {
    const start = parseDateTime(date, time);

    // appointment duration = 30 min
    const end = new Date(start.getTime() + 30 * 60000);

    return end;
  };
  // ✅ Check if today
  const isToday = (date) => {
    const today = new Date();
    const appDate = new Date(date);

    return (
      today.getFullYear() === appDate.getFullYear() &&
      today.getMonth() === appDate.getMonth() &&
      today.getDate() === appDate.getDate()
    );
  };

  // ✅ Check call time window
  const isCallTime = (date, time) => {
    if (!isToday(date)) return false;

    const now = new Date();
    const appointmentTime = parseDateTime(date, time);

    // Allow: 10 min before → 30 min after
    const startWindow = new Date(appointmentTime.getTime() - 10 * 60000);
    const endWindow = new Date(appointmentTime.getTime() + 30 * 60000);

    return now >= startWindow && now <= endWindow;
  };

  const joinVideoCall = (appointment) => {
    navigate(`/video-call/${appointment._id}`, {
      state: {
        role: "patient",
      },
    });
  };

  const handleCancelAppointment = async () => {
    if (!upcomingAppointment) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${upcomingAppointment._id}/cancel/`,
        {
          method: "PUT",
          credentials: "include"
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Cancel failed");

      // ✅ Remove appointment from UI
      setUpcomingAppointment(null);

      alert("Appointment cancelled successfully");

    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    }
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/review/publicreview`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Backend error:", data);
          setReviews([]);
          return;
        }

        const latestTwo = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
          .map((rev) => ({
            doctorName: rev.doctor?.fullName,
            specialization: rev.doctor?.specialization,
            name: `${rev.patient?.firstName || ""} ${rev.patient?.lastName || ""}`.trim(),
            date: new Date(rev.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }),
            text: rev.comment,
            stars: rev.rating,
          }));

        setReviews(latestTwo);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newEntry = {
      name: "John (You)",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '02' }),
      text: newReviewText,
      stars: rating
    };
    setReviews([newEntry, ...reviews]);
    setNewReviewText("");
  };
  const canStartCall =
    upcomingAppointment &&
    upcomingAppointment?.type === "video" &&
    isCallTime(upcomingAppointment.date, upcomingAppointment.time);
  return (
    <>
      <Navbar />


      {/* MODAL OVERLAY - This is what opens when you click Book Appointment */}
      {isBookingOpen && (
        <div className="PatHome-booking-modal-overlay">
          <div className="PatHome-booking-modal-content">
            <BookAppointment onClose={() => setIsBookingOpen(false)} />
          </div>
        </div>
      )}
      {isUploadOpen && (
        <div className="PatHome-booking-modal-overlay">
          <div className="PatHome-booking-modal-content">
            <UploadMedicalRecord onClose={() => setIsUploadOpen(false)} />
          </div>
        </div>
      )}
      <div className={`PatHome-patient-home-wrapper ${isBookingOpen ? 'PatHome-prevent-scroll' : ''}`}>
        <div className="PatHome-dashboard-grid">

          {/* LEFT COLUMN */}
          <div className="PatHome-left-column">
            {/* <section className="PatHome-card PatHome-card-white">
              <h2 className="PatHome-card-heading">Upcoming Appointment</h2>
              <div className="PatHome-appointment-body">
                <div className="PatHome-profile-image-wrapper">
                  <img src={doctorProfile} className="PatHome-profile-image" alt="Profile" />
                </div>
                <div className="PatHome-appointment-details">
                  <div className="PatHome-dr-header-row">
                    <div>
                      {loadingAppt ? (
                        <p>Loading appointment...</p>
                      ) : upcomingAppointment ? (
                        <>
                          <h3 className="PatHome-dr-name">
                            {upcomingAppointment.doctor?.fullName || "Doctor"}
                          </h3>

                          <p className="PatHome-appt-time">
                            {new Date(upcomingAppointment.date).toDateString()} at{" "}
                            {upcomingAppointment.time}
                          </p>

                          <p className="PatHome-dr-specialty">
                            {upcomingAppointment.doctor?.specialization}
                          </p>

                          <p className={`PatHome-status PatHome-${upcomingAppointment.status.toLowerCase()}`}>
                            {upcomingAppointment.status}
                          </p>
                        </>
                      ) : (
                        <p>No upcoming appointments</p>
                      )}
                    </div>
                  </div>
                  {upcomingAppointment && (
                    <div className="PatHome-action-buttons">
                      <button className="PatHome-reviewbtn">Reschedule</button>
                      <button className="PatHome-reviewbtn">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </section> */}
            <section className="PatHome-card PatHome-card-white PatHome-upcoming-appt-section">
              <div className="PatHome-card-header-flex">
                <h2 className="PatHome-card-heading">Upcoming Appointment</h2>
                {upcomingAppointment && (
                  <span className={`PatHome-status-pill PatHome-${upcomingAppointment.status.toLowerCase()}`}>
                    {upcomingAppointment.status}
                  </span>
                )}
              </div>

              <div className="PatHome-appointment-body">
                <div className="PatHome-dr-profile-aside">
                  <img src={doctorProfile} className="PatHome-dr-image" alt="Doctor" />
                </div>

                <div className="PatHome-appointment-main-info">
                  {loadingAppt ? (
                    <div className="PatHome-loading-state">Loading appointment...</div>
                  ) : upcomingAppointment ? (
                    <>
                      <div className="PatHome-info-group">
                        <h3 className="PatHome-dr-name">
                          {`Dr. ${upcomingAppointment.doctor?.fullName || ""}`}
                        </h3>
                        <p className="PatHome-dr-specialty">
                          {upcomingAppointment.doctor?.specialization}
                        </p>
                      </div>

                      <div className="PatHome-datetime-row">
                        <div className="PatHome-info-item">
                          <i className="fa-regular fa-calendar"></i>
                          <span>{new Date(upcomingAppointment.date).toDateString()}</span>
                        </div>
                        <div className="PatHome-info-item">
                          <i className="fa-regular fa-clock"></i>
                          <span>{upcomingAppointment.time}</span>
                        </div>
                        <div className="PatHome-type-badge-container">
                          <span className={`PatHome-type-badge PatHome-${upcomingAppointment.type}`}>
                            {upcomingAppointment.type === "video" ? "🎥 Video" : "🏥 In-Person"}
                          </span>
                        </div>
                      </div>

                      <div className="PatHome-action-buttons">

                        {/* ✅ START CALL BUTTON */}
                        {/* {upcomingAppointment?.type === "video" && (
    canStartCall ? (
      <button
        className="PatHome-btn-primary"
        onClick={() =>
  navigate(`/video-call/${upcomingAppointment._id}`, {
    state: { isDoctor: false } // patient side
  })
}
      >
        Start Call
      </button>
    ) : (
      <button className="PatHome-btn-disabled" disabled>
        Call not available
      </button>
    )
  )} */}
                        {upcomingAppointment?.type === "video" && (
                          canStartCall ? (
                            // <button
                            //   className="PatHome-btn-primary"
                            //   onClick={() => {
                            //     navigate(`/video-call/${upcomingAppointment._id}?role=patient`);
                            //   }}
                            // >
                            //   Join Call
                            // </button>
                            <button className="PatHome-btn-primary"
                              onClick={() => navigate(`/video-call/${upcomingAppointment._id}`)}
                            >
                              Join Call
                            </button>
                          ) : (
                            <p style={{ color: "#888", fontSize: "14px" }}>
                              You can join 10 minutes before appointment time
                            </p>
                          )
                        )}
                        <button className="PatHome-btn-outline" onClick={handleReschedule}>Reschedule</button>

                        <button
                          className="PatHome-btn-danger-outline"
                          onClick={() => {
                            const confirmCancel = window.confirm(
                              "Are you sure you want to cancel this appointment?"
                            );
                            if (confirmCancel) {
                              handleCancelAppointment();
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="PatHome-no-appt-state">
                      <p>You have no upcoming appointments.</p>
                      <button className="PatHome-book-now-link" onClick={() => setIsBookingOpen(true)}>
                        Book one now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="PatHome-quick-actions-grid">
              <div className="PatHome-action-card" onClick={() => setIsBookingOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="PatHome-icon-circle PatHome-icon-cyan">📅</div>
                <span>Book Appointment</span>
              </div>
              <div
                className="PatHome-action-card"
                onClick={() => setIsUploadOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                <div className="PatHome-icon-circle PatHome-icon-orange">📄</div>
                <span>Upload Records</span>
              </div>              <div className="PatHome-action-card" onClick={() => setShowPrescription(true)}><div className="PatHome-icon-circle PatHome-icon-red">💊</div><span>Prescriptions</span></div>

              <PrescriptionModal
                isOpen={showPrescription}
                onClose={() => setShowPrescription(false)}
              />
              <div className="PatHome-action-card"><div className="PatHome-icon-circle PatHome-icon-blue">📋</div><span>Lab Results</span></div>
            </div>

            <section className="PatHome-card PatHome-card-white PatHome-review-timeline-card">
              <div className="PatHome-review-header">
                <h2 className="PatHome-card-heading">What Patients Say</h2>
                <button className="PatHome-write-review-btn" onClick={() => setShowReview(true)}>
                  <i className="fa-solid fa-pen"></i> Write a Review
                </button>
              </div>

              <div className="PatHome-timeline">
                {reviews.length > 0 ? (
                  reviews.map((rev, i) => (
                    <div className="PatHome-timeline-item" key={i}>
                      <div className="PatHome-timeline-dot"></div>

                      <div className="PatHome-timeline-content">
                        <div className="PatHome-review-top">
                          <div>
                            <h4 className="PatHome-review-name">
                              Dr. {rev.doctorName}
                            </h4>

                            <span className="PatHome-review-specialty">
                              {rev.specialization}
                            </span>
                            <p>-{rev.name}</p>
                            <span className="PatHome-review-date">{rev.date}</span>
                          </div>

                          <div className="PatHome-review-stars">
                            {"⭐".repeat(rev.stars)}
                          </div>
                        </div>

                        <p className="PatHome-review-text">"{rev.text}"</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: "10px", color: "#777" }}>
                    No reviews yet
                  </p>
                )}
              </div>

              <div className="PatHome-view-all" onClick={() => navigate("/patient/reviews")}>
                <span>View all reviews →</span>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Fully Restored */}
          <div className="PatHome-right-column">
            {/* FIND DOCTOR SECTION */}
            <section className="PatHome-card PatHome-card-white">
              <div className="PatHome-search-header-flex">
                <h2 className="PatHome-card-heading">Find a Doctor</h2>
              </div>
              <form className="PatHome-search-filters-grid">
                <div className="PatHome-filter-group">
                  <label>Doctor Name</label>
                  <div className="PatHome-input-with-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="e.g. Dr. Sarah" className="PatHome-filter-input" />
                  </div>
                </div>
                <div className="PatHome-filter-group">
                  <label>Location</label>
                  <div className="PatHome-input-with-icon">
                    <i className="fa-solid fa-location-dot"></i>
                    <input type="text" placeholder="City or Zip" className="PatHome-filter-input" />
                  </div>
                </div>
                <div className="PatHome-filter-group">
                  <label>Specialization</label>
                  <select className="PatHome-filter-input">
                    <option>All Specializations</option>
                    <option>General Practice</option>
                    <option>Cardiology</option>
                  </select>
                </div>
                <div className="PatHome-filter-group">
                  <label>Availability</label>
                  <select className="PatHome-filter-input">
                    <option>Any Day</option>
                    <option>Weekdays</option>
                  </select>
                </div>
                <div className="PatHome-filter-group PatHome-submit-group">
                  <button type="submit" className="PatHome-btn-search-apply">
                    <i className="fa-solid fa-sliders"></i> Apply Filters
                  </button>
                </div>
              </form>
              <div className="PatHome-filtered-results-container">
                <div className="PatHome-no-results-hint">Adjust filters to see available doctors</div>
              </div>
            </section>

            {/* AI CHATBOT SECTION */}
            <section className="PatHome-card PatHome-card-white PatHome-ai-chatbot-container">
              <div className="PatHome-ai-text-center">
                <h2 className="PatHome-ai-title">
                  <i className="fa-solid fa-robot" style={{ marginRight: '10px', color: '#2563eb' }}></i>
                  Ask Medi-Track AI
                </h2>
                <p className="PatHome-ai-subtitle">Instant symptom analysis & suggestions</p>
              </div>
              <div className="PatHome-chat-window">
                <div className="PatHome-chat-messages-scroll">
                  <div className="PatHome-message-row PatHome-bot-row">
                    <div className="PatHome-bot-icon-bg"><i className="fa-solid fa-robot"></i></div>
                    <div className="PatHome-message-bubble PatHome-bot-bubble">
                      Hello John! I'm your AI health assistant. Describe how you're feeling...
                    </div>
                  </div>
                </div>
                <div className="PatHome-chat-input-container">
                  <input type="text" placeholder="Type your symptoms here..." className="PatHome-chat-input-field" />
                  <button className="PatHome-chat-submit-btn"><i className="fa-solid fa-paper-plane"></i></button>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
      {showReview && (
        <div className="PatHome-booking-modal-overlay">
          <div className="PatHome-booking-modal-content">
            <Review onClose={() => setShowReview(false)} />
          </div>
        </div>
      )}

      {showReschedule && selectedAppointment && (
        <div
          className="PatHome-booking-modal-overlay"
          onClick={() => setShowReschedule(false)}
        >
          <div
            className="PatHome-booking-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px", width: "95%" }}
          >
            <RescheduleAppointment
              appointment={selectedAppointment}
              onClose={() => setShowReschedule(false)}
            />
          </div>
        </div>
      )}

    </>
  );
};

export default PatientHome;