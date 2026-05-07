import React, { useState, useEffect, useRef } from 'react';
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
import DoctorBookingModal from "./DoctorBookingModal";
import ReactMarkdown from 'react-markdown';

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
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingOpenSelected, setIsBookingOpenSelected] = useState(false);
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm Medi-Track AI Assistant. How can I help you today? Are you looking for health advice or assistance with the Medi-Track platform? 🏥🤖" }
  ]);
  const [filters, setFilters] = useState({
    specialization: "",
    serviceType: "",
    experience: "",
    availability: "",
    rating: ""
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    specializations: [],
    serviceTypes: [],
    availability: []
  });
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const chatBottomRef = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Function to handle sending messages
  /* const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: chatInput }];
    setMessages(newMessages);
    setChatInput("");

    // Simple Mock AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "I've noted your symptoms. Please remember I'm an AI, not a doctor. Based on what you said, you might want to consult a General Physician. Would you like to see available slots?"
      }]);
    }, 1000);
  }; */

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    // ✅ Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chatbot/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await res.json();

      // ✅ Add bot reply
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: data.reply }
      ]);

    } catch (error) {
      console.error(error);

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: "Something went wrong. Please try again." }
      ]);
    }
  };

  // ✅ Load chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/chatbot/history`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (data.messages && data.messages.length > 0) {
          setMessages(
            data.messages.map((msg) => ({
              role: msg.role,
              text: msg.text,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchChatHistory();
  }, []);

  const chatScrollRef = useRef(null);

  useEffect(() => {
  if (chatScrollRef.current) {
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }
}, [messages]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/doctor/filters`
        );

        const data = await res.json();

        if (!res.ok) throw new Error();

        setFilterOptions(data);

      } catch (err) {
        console.error("Error loading filters", err);
      }
    };

    fetchFilters();
  }, []);
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



  // ✅ Clear history
  // const handleClearHistory = async () => {
  //   try {
  //     await fetch(`${process.env.REACT_APP_API_URL}/api/chatbot/clear`, {
  //       method: "DELETE",
  //       credentials: "include",
  //     });
  //     setMessages([
  //       { role: "bot", text: "Hello! I'm your AI health assistant. Describe how you're feeling..." }
  //     ]);
  //   } catch (err) {
  //     console.error("Failed to clear history", err);
  //   }
  // };

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
  // const handleApplyFilters = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoadingDoctors(true);

  //      // ✅ Remove empty filters
  //   const cleanedFilters = Object.fromEntries(
  //     Object.entries(filters).filter(([_, value]) => value !== "")
  //   );

  //     const query = new URLSearchParams(cleanedFilters).toString();

  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}/api/doctor/filtered?${query}`
  //     );

  //     const data = await res.json();

  //     if (!res.ok) throw new Error("Failed to fetch doctors");

  //     setDoctors(data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoadingDoctors(false);
  //   }
  // };

  const handleApplyFilters = async (e) => {
    e.preventDefault();

    try {
      setLoadingDoctors(true);

      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      const query = new URLSearchParams(cleanedFilters).toString();

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/doctor/filtered?${query}`
      );

      const data = await res.json();

      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDoctors(false);
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
                            {upcomingAppointment.type === "videocall" ? "🎥 Video Call" : "🏥 Physical Visit"}
                          </span>
                        </div>
                      </div>

                      <div className="PatHome-action-buttons">

                        {/* ✅ START CALL BUTTON */}
                        {/* {upcomingAppointment?.type === "videocall" && (
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
                        {upcomingAppointment?.type === "videocall" && (
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
              <form className="PatHome-search-filters-grid" onSubmit={handleApplyFilters}>
                <div className="PatHome-filter-group">
                  <label>Specialization</label>
                  <select
                    name="specialization"
                    className="PatHome-filter-input"
                    onChange={handleFilterChange}
                  >
                    <option value="">All Specializations</option>

                    {filterOptions.specializations.map((spec, i) => (
                      <option key={i} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="PatHome-filter-group">
                  <label>Appointment Type</label>
                  <select name="serviceType" onChange={handleFilterChange} className="PatHome-filter-input">
                    <option value="">All Types</option>
                    <option value="videocall">Video Call</option>
                    <option value="physical">Physical Visit</option>
                  </select>
                </div>
                {/* <div className="PatHome-filter-group">
                  <label>Doctor Name</label>
                  <div className="PatHome-input-with-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="e.g. Dr. Sarah" className="PatHome-filter-input" />
                  </div>
                </div> */}
                <div className="PatHome-filter-group">
                  <label>Experience</label>
                  <select className="PatHome-filter-input"
                    name="experience"
                    onChange={handleFilterChange}>
                    {/* <option>Any</option> */}
                    <option value="">Any</option>
                    <option value="0-5">0-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div className="PatHome-filter-group">
                  <label>Availability</label>
                  <select name="availability" className="PatHome-filter-input" onChange={handleFilterChange}>
                    <option value="">Any Day</option>

                    {filterOptions.availability.map((day, i) => (
                      <option key={i} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="PatHome-filter-group">
                  <label>Rating</label>
                  <select
                    name="rating"
                    className="PatHome-filter-input"
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Rating</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div className="PatHome-filter-group PatHome-submit-group">
                  <button type="submit" className="PatHome-btn-search-apply">
                    <i className="fa-solid fa-sliders"></i> Apply Filters
                  </button>
                </div>
              </form>
              <div className="PatHome-filtered-results-container">
                <div className="PatHome-no-results-hint">
                  {loadingDoctors ? (
                    <p>Loading doctors...</p>
                  ) : doctors.length > 0 ? (
                    <div className="PatHome-table-wrapper">
                      <table className="PatHome-doctor-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {doctors.map((doc) => (
                            <tr key={doc._id}>
                              <td>Dr. {doc.fullName}</td>
                              <td>{doc.specialization}</td>
                              <td>{doc.experience} yrs</td>
                              <td>
                                <button
                                  className="PatHome-view-btn"
                                  onClick={() => {
                                    setSelectedDoctor(doc);
                                    setShowDoctorModal(true);
                                  }}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No doctors found</p>
                  )}
                </div>                </div>
            </section>

            {/* AI CHATBOT SECTION */}
            <section className="PatHome-card PatHome-card-white PatHome-ai-chatbot-container">
              <div className="PatHome-ai-text-center">
                <h2 className="PatHome-ai-title">
                  <i className="fa-solid fa-robot" style={{ marginRight: '10px', color: '#0AA5A5' }}></i>
                  Ask Medi-Track AI
                </h2>
                <p className="PatHome-ai-subtitle">Instant symptom analysis & suggestions</p>
                {/* ✅ Add this */}
                {/* <button
  onClick={handleClearHistory}
  style={{
    fontSize: "13px",
    color: "#888",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginTop: "4px"
  }}
>
  🗑️ Clear History
</button> */}
              </div>

              <div className="PatHome-chat-window">
                <div className="PatHome-chat-messages-scroll" ref={chatScrollRef}>
                  {messages.map((msg, index) => (
                    <div key={index} className={`PatHome-message-row ${msg.role === 'bot' ? 'PatHome-bot-row' : 'PatHome-user-row'}`}>
                      {msg.role === 'bot' && (
                        <div className="PatHome-bot-icon-bg"><i className="fa-solid fa-robot"></i></div>
                      )}
                      <div className={`PatHome-message-bubble ${msg.role === 'bot' ? 'PatHome-bot-bubble' : 'PatHome-user-bubble'}`}>
                        {msg.role === 'bot' ? (
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form className="PatHome-chat-input-container" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type your symptoms here..."
                    className="PatHome-chat-input-field"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="PatHome-chat-submit-btn">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
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
      {showDoctorModal && selectedDoctor && (
        <div
          className="PatHome-booking-modal-overlay"
          onClick={() => setShowDoctorModal(false)}
        >
          <div
            className="PatHome-booking-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px", width: "95%" }}
          >
            <div className="PatHome-doctor-modal">

              {/* HEADER */}
              <div className="PatHome-doctor-header">
                <img src={doctorProfile} alt="Doctor" />

                <div>
                  <h2>Dr. {selectedDoctor.fullName}</h2>
                  <p className="PatHome-specialization">{selectedDoctor.specialization}</p>
                  <p className="PatHome-qualification">{selectedDoctor.qualification}</p>
                </div>
              </div>

              {/* GRID INFO */}
              <div className="PatHome-doctor-grid">

                {/* LEFT */}
                <div className="PatHome-doctor-card-box">
                  <h4>Basic Info</h4>
                  <p><span>Gender:</span> {selectedDoctor.gender || "N/A"}</p>
                  <p><span>DOB:</span> {selectedDoctor.dob?.slice(0, 10)}</p>
                  <p><span>Experience:</span> {selectedDoctor.experience} years</p>
                </div>

                {/* RIGHT */}
                <div className="PatHome-doctor-card-box">
                  <h4>Contact</h4>
                  <p><span>Email:</span> {selectedDoctor.email}</p>
                  <p><span>Mobile:</span> {selectedDoctor.mobile}</p>
                  <p><span>Emergency:</span> {selectedDoctor.emergencyContact}</p>
                </div>

              </div>

              {/* CLINIC */}
              <div className="PatHome-doctor-card-box">
                <h4>Clinic Details</h4>
                <p><span>Clinic:</span> {selectedDoctor.clinicName}</p>
                <p><span>Address:</span> {selectedDoctor.clinicAddress}</p>
                <p><span>City:</span> {selectedDoctor.city}, {selectedDoctor.state}</p>

                <a href={selectedDoctor.mapLink} target="_blank" rel="noreferrer">
                  📍 View on Map
                </a>
              </div>

              {/* AVAILABILITY */}
              <div className="PatHome-doctor-card-box">
                <h4>Availability</h4>
                <p><span>Type:</span> {selectedDoctor.serviceType}</p>
                <p><span>Days:</span> {selectedDoctor.workingDays?.join(", ")}</p>
                <p>
                  <strong>Hours:</strong>{" "}
                  {Array.isArray(selectedDoctor.workingHours)
                    ? selectedDoctor.workingHours
                      .map(w => `${w.start} - ${w.end}`)
                      .join(", ")
                    : "Not available"}
                </p>
              </div>

              {/* ABOUT */}
              <div className="PatHome-doctor-card-box">
                <h4>About</h4>
                <p>{selectedDoctor.about}</p>
              </div>

              {/* BUTTON */}
              {/* <button
    className="PatHome-btn-bookapp"
    onClick={() => {
      setShowDoctorModal(false);
      setIsBookingOpen(true);
    }}
  >
    Book Appointment
  </button> */}
              <button
                className="PatHome-btn-primary"
                onClick={() => {
                  setSelectedDoctorForBooking(selectedDoctor); // ✅ set doctor
                  setIsBookingOpenSelected(true);           // ✅ open modal
                }}
              >
                Book Appointment
              </button>

            </div>
          </div>
        </div>
      )}
      {isBookingOpenSelected && selectedDoctorForBooking && (
        <DoctorBookingModal
          onClose={() => setIsBookingOpenSelected(false)}
          doctor={selectedDoctorForBooking}
        />
      )}
    </>
  );
};

export default PatientHome;