import React, { useState, useEffect } from 'react';
import '../css/PatientHome.css';
import doctorProfile from '../images/profile.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '../components/Navbar';
import BookAppointment from './BookAppointment';
import { useNavigate } from "react-router-dom";
import UploadMedicalRecord from './UploadMedicalRecord';
import Review from "./Review";

const PatientHome = () => {
  const [reviews, setReviews] = useState([
    { name: "Amy T", date: "May 01", text: "Sarah Williams was very patient and thorough during visit my visit.", stars: 4 },
    { name: "Robert L", date: "April 26", text: "Dr. Choi was great! Explained everything clearly.", stars: 4 }
  ]);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loadingAppt, setLoadingAppt] = useState(true);
  const [newReviewText, setNewReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [showReview, setShowReview] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
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
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <BookAppointment onClose={() => setIsBookingOpen(false)} />
          </div>
        </div>
      )}
      {isUploadOpen && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <UploadMedicalRecord onClose={() => setIsUploadOpen(false)} />
          </div>
        </div>
      )}
      <div className={`patient-home-wrapper ${isBookingOpen ? 'prevent-scroll' : ''}`}>
        <div className="dashboard-grid">

          {/* LEFT COLUMN */}
          <div className="left-column">
            {/* <section className="card card-white">
              <h2 className="card-heading">Upcoming Appointment</h2>
              <div className="appointment-body">
                <div className="profile-image-wrapper">
                  <img src={doctorProfile} className="profile-image" alt="Profile" />
                </div>
                <div className="appointment-details">
                  <div className="dr-header-row">
                    <div>
                      {loadingAppt ? (
                        <p>Loading appointment...</p>
                      ) : upcomingAppointment ? (
                        <>
                          <h3 className="dr-name">
                            {upcomingAppointment.doctor?.fullName || "Doctor"}
                          </h3>

                          <p className="appt-time">
                            {new Date(upcomingAppointment.date).toDateString()} at{" "}
                            {upcomingAppointment.time}
                          </p>

                          <p className="dr-specialty">
                            {upcomingAppointment.doctor?.specialization}
                          </p>

                          <p className={`status ${upcomingAppointment.status.toLowerCase()}`}>
                            {upcomingAppointment.status}
                          </p>
                        </>
                      ) : (
                        <p>No upcoming appointments</p>
                      )}
                    </div>
                  </div>
                  {upcomingAppointment && (
                    <div className="action-buttons">
                      <button className="reviewbtn">Reschedule</button>
                      <button className="reviewbtn">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </section> */}
            <section className="card card-white upcoming-appt-section">
              <div className="card-header-flex">
                <h2 className="card-heading">Upcoming Appointment</h2>
                {upcomingAppointment && (
                  <span className={`status-pill ${upcomingAppointment.status.toLowerCase()}`}>
                    {upcomingAppointment.status}
                  </span>
                )}
              </div>

              <div className="appointment-body">
                <div className="dr-profile-aside">
                  <img src={doctorProfile} className="dr-image" alt="Doctor" />
                </div>

                <div className="appointment-main-info">
                  {loadingAppt ? (
                    <div className="loading-state">Loading appointment...</div>
                  ) : upcomingAppointment ? (
                    <>
                      <div className="info-group">
                        <h3 className="dr-name">
                          {`Dr. ${upcomingAppointment.doctor?.fullName || ""}`}
                        </h3>
                        <p className="dr-specialty">
                          {upcomingAppointment.doctor?.specialization}
                        </p>
                      </div>

                      <div className="datetime-row">
                        <div className="info-item">
                          <i className="fa-regular fa-calendar"></i>
                          <span>{new Date(upcomingAppointment.date).toDateString()}</span>
                        </div>
                        <div className="info-item">
                          <i className="fa-regular fa-clock"></i>
                          <span>{upcomingAppointment.time}</span>
                        </div>
                        <div className="type-badge-container">
                          <span className={`type-badge ${upcomingAppointment.type}`}>
                            {upcomingAppointment.type === "video" ? "🎥 Video" : "🏥 In-Person"}
                          </span>
                        </div>
                      </div>

                      <div className="action-buttons">

                        {/* ✅ START CALL BUTTON */}
                        {/* {upcomingAppointment?.type === "video" && (
    canStartCall ? (
      <button
        className="btn-primary"
        onClick={() =>
  navigate(`/video-call/${upcomingAppointment._id}`, {
    state: { isDoctor: false } // patient side
  })
}
      >
        Start Call
      </button>
    ) : (
      <button className="btn-disabled" disabled>
        Call not available
      </button>
    )
  )} */}
                        {upcomingAppointment?.type === "video" && (
                          canStartCall ? (
                            // <button
                            //   className="btn-primary"
                            //   onClick={() => {
                            //     navigate(`/video-call/${upcomingAppointment._id}?role=patient`);
                            //   }}
                            // >
                            //   Join Call
                            // </button>
                            <button className="btn-primary"
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
                        <button className="btn-outline">Reschedule</button>

                        <button
                          className="btn-danger-outline"
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
                    <div className="no-appt-state">
                      <p>You have no upcoming appointments.</p>
                      <button className="book-now-link" onClick={() => setIsBookingOpen(true)}>
                        Book one now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="quick-actions-grid">
              <div className="action-card" onClick={() => setIsBookingOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="icon-circle icon-cyan">📅</div>
                <span>Book Appointment</span>
              </div>
              <div
                className="action-card"
                onClick={() => setIsUploadOpen(true)}
                style={{ cursor: 'pointer' }}
              >
                <div className="icon-circle icon-orange">📄</div>
                <span>Upload Records</span>
              </div>              <div className="action-card"><div className="icon-circle icon-red">💊</div><span>Prescriptions</span></div>
              <div className="action-card"><div className="icon-circle icon-blue">📋</div><span>Lab Results</span></div>
            </div>

            {/* <section className="card card-blue-solid">
              <h2 className="card-heading white-text">Patient Reviews</h2>
              <form className="review-form" onSubmit={handlePostReview}>
                <textarea
                  className="review-input"
                  placeholder="Share your experience..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
                <div className="review-form-footer">
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rating-picker">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                  <button type="submit" className="reviewbtn1">Post Review</button>
                </div>
              </form>
              <div className="reviews-list">
                {reviews.map((rev, i) => (
                  <div className="review-item" key={i}>
                    <p>"{rev.text}"</p>
                    <div className="review-meta">
                      <span>{rev.date}. {rev.name}</span>
                      <span className="stars">{"⭐".repeat(rev.stars)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section> */}
            <section className="card card-white review-timeline-card">
  <div className="review-header">
    <h2 className="card-heading">What Patients Say</h2>
    <button className="write-review-btn" onClick={() => setShowReview(true)}>
      <i className="fa-solid fa-pen"></i> Write a Review
    </button>
  </div>

  <div className="timeline">
    {reviews.map((rev, i) => (
      <div className="timeline-item" key={i}>
        <div className="timeline-dot"></div>

        <div className="timeline-content">
          <div className="review-top">
            <div>
              <h4 className="review-name">{rev.name}</h4>
              <span className="review-date">{rev.date}</span>
            </div>

            <div className="review-stars">
              {"⭐".repeat(rev.stars)}
            </div>
          </div>

          <p className="review-text">"{rev.text}"</p>
        </div>
          {showReview && (
            <Review onClose={() => setShowReview(false)} />
          )}
      </div>
    ))}
  </div>

  <div className="view-all">
    <span>View all reviews →</span>
  </div>
</section>
          </div>

          {/* RIGHT COLUMN - Fully Restored */}
          <div className="right-column">
            {/* FIND DOCTOR SECTION */}
            <section className="card card-white">
              <div className="search-header-flex">
                <h2 className="card-heading">Find a Doctor</h2>
              </div>
              <form className="search-filters-grid">
                <div className="filter-group">
                  <label>Doctor Name</label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="e.g. Dr. Sarah" className="filter-input" />
                  </div>
                </div>
                <div className="filter-group">
                  <label>Location</label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-location-dot"></i>
                    <input type="text" placeholder="City or Zip" className="filter-input" />
                  </div>
                </div>
                <div className="filter-group">
                  <label>Specialization</label>
                  <select className="filter-input">
                    <option>All Specializations</option>
                    <option>General Practice</option>
                    <option>Cardiology</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Availability</label>
                  <select className="filter-input">
                    <option>Any Day</option>
                    <option>Weekdays</option>
                  </select>
                </div>
                <div className="filter-group submit-group">
                  <button type="submit" className="btn-search-apply">
                    <i className="fa-solid fa-sliders"></i> Apply Filters
                  </button>
                </div>
              </form>
              <div className="filtered-results-container">
                <div className="no-results-hint">Adjust filters to see available doctors</div>
              </div>
            </section>

            {/* AI CHATBOT SECTION */}
            <section className="card card-white ai-chatbot-container">
              <div className="ai-text-center">
                <h2 className="ai-title">
                  <i className="fa-solid fa-robot" style={{ marginRight: '10px', color: '#2563eb' }}></i>
                  Ask Medi-Track AI
                </h2>
                <p className="ai-subtitle">Instant symptom analysis & suggestions</p>
              </div>
              <div className="chat-window">
                <div className="chat-messages-scroll">
                  <div className="message-row bot-row">
                    <div className="bot-icon-bg"><i className="fa-solid fa-robot"></i></div>
                    <div className="message-bubble bot-bubble">
                      Hello John! I'm your AI health assistant. Describe how you're feeling...
                    </div>
                  </div>
                </div>
                <div className="chat-input-container">
                  <input type="text" placeholder="Type your symptoms here..." className="chat-input-field" />
                  <button className="chat-submit-btn"><i className="fa-solid fa-paper-plane"></i></button>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </>
  );
};

export default PatientHome;