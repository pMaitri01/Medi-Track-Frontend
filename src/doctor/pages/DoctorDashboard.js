import React, { useState, useEffect } from "react";
import DoctorNavbar from "../components/DoctorNavbar";
import DoctorHeader from "../components/DoctorHeader";
import DoctorFooter from "../components/DoctorFooter";
import Calendar from "../components/Calendar";
import GenderChart from "../components/GenderChart";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaHospitalUser, FaClock, FaCheckCircle, FaCheck, FaTimesCircle } from "react-icons/fa";

export default function DoctorDashboard() {
  const [open, setOpen] = useState(true);
  const [patientCount, setPatientCount] = useState(null); // null = loading
  const [todayPatients, setTodayPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [nextPatient, setNextPatient] = useState(null);
  const [nextLoading, setNextLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const getInitials = (name) => {
    if (!name) return "NA";

    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  };// to get initial
  const [reviewData, setReviewData] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingCount: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, // ✅ ADD THIS
    latestReviews: [],
  });
  const reviews = reviewData.latestReviews;
  const navigate = useNavigate();
  // Layout Constants
  const sidebarWidth = open ? "250px" : "100px";

  useEffect(() => {

     // GET doctor name from localStorage
  const storedDoctor = JSON.parse(localStorage.getItem("doctor") || "{}");

  if (storedDoctor?.fullName) {
    setDoctorName(storedDoctor.fullName);
  }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        setPatientCount(data.totalPatients || 0);
        setTodayPatients(data.todayPatients || 0);
        setCompleted(data.totalCompleted || 0);

      } catch (error) {
        console.log("Dashboard Error:", error);
        setPatientCount(0);
        setTodayPatients(0);
        setCompleted(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    fetchTodayAppointments();
    fetchAppointmentRequests();
    fetchReviews();
    fetchNextPatient();
  }, []);
  const fetchReviews = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/review/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      setReviewData(data);

    } catch (err) {
      console.log(err);
    }
  };
  const fetchTodayAppointments = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/today`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      setTodayAppointments(data);

    } catch (error) {
      console.log("Today Appointment Error:", error);
      setTodayAppointments([]);
    }
  };

  // check if appointment time is over
  const isTimeOver = (time) => {
    const now = new Date();

    let [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const appointmentTime = new Date();
    appointmentTime.setHours(hours, minutes, 0, 0);

    return appointmentTime < now;
  };

  // complete appointment
  const completeAppointment = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/complete/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      // REFETCH DATA INSTEAD OF FILTERING
      fetchTodayAppointments();
    }
    catch (error) {
      console.log("Complete Error:", error);
    }
  };

  // fetch next patient on dashboard
  const fetchNextPatient = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/next`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setNextPatient(data);
      } else {
        setNextPatient(null);
      }

    } catch (error) {
      console.log("Next Patient Error:", error);
      setNextPatient(null);
    } finally {
      setNextLoading(false);
    }
  };

  // fetch appointmment in doctor dashboard
  const fetchAppointmentRequests = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      setAppointmentRequests(data);

    } catch (error) {
      console.log("Request Error:", error);
      setAppointmentRequests([]);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      // refresh both sections
      fetchAppointmentRequests();
      fetchTodayAppointments();

    } catch (error) {
      console.log("Status Update Error:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FD" }}>
      <DoctorNavbar open={open} setOpen={setOpen} />

      <div style={{
        marginLeft: sidebarWidth,
        width: `calc(100% - ${sidebarWidth})`,
        height: "100vh",    // Match screen height
        display: "flex",
        flexDirection: "column",
        transition: "0.3s ease",
        overflowY: "auto",  // 🔥 THIS ENABLES THE SCROLL
        overflowX: "hidden"
      }}>
        <DoctorHeader open={open} doctorName={doctorName} />

        <main style={{ padding: "30px", flex: 1, paddingBottom: "100px" }}>

          {/* --- TOP ROW: STAT CARDS --- */}
          <div style={gridStyle(3)}>
            {[
              { label: "Total Patient", icon: <FaUserFriends />, value: loading ? "—" : patientCount },
              { label: "Today Patient", icon: <FaHospitalUser />, value: loading ? "—" : todayPatients },
              { label: "Total Completed Appointments", icon: <FaClock />, value: loading ? "—" : completed }
            ].map((card, i) => (
              <div key={i} style={{ ...cardStyle, flexDirection: "row", alignItems: "center" }}>
                <div style={iconCircleStyle}>{card.icon}</div>
                <div>
                  <p style={labelStyle}>{card.label}</p>
                  <h3 style={valueStyle}>
                    {card.value === null ? "—" : card.value}
                  </h3>
                  {/* <p style={subLabelStyle}>
                    {card.value === null ? "Loading..." : "Live Data"}
                  </p> */}
                </div>
              </div>
            ))}
          </div>

          {/* --- MIDDLE ROW: SUMMARY & LISTS --- */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr", gap: "25px", marginBottom: "25px" }}>

            {/* Chart Area */}
            <div style={cardStyle}>
              <h4 style={titleStyle}>Patients Gender</h4>

              <div style={{ marginTop: "15px" }}>
                <GenderChart />
              </div>
            </div>

            {/* List Area */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <h4 style={titleStyle}>Today Appointment</h4>
                <span style={{ color: "#0AA5A5", fontSize: "12px", cursor: "pointer" }}>See All</span>
              </div>
              <div style={listContainer}>
                {/* {[1, 2, 3, 4].map((item) => (
                  <div key={item} style={listItemStyle}>
                    <div style={avatarStyle}></div>
                    <div style={{ flex: 1, fontSize: "14px" }}>Patient Name</div>
                    <div style={badgeStyle}>00:00</div>
                  </div>
                ))} */}
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appt) => (
                    <div key={appt._id} style={listItemStyle}>

                      <div style={avatarStyle}>
                        {getInitials(appt.patientName)}
                      </div>

                      <div style={{ flex: 1, fontSize: "14px" }}>
                        {appt.patientName}
                      </div>

                      <div style={badgeStyle}>
                        {appt.time}
                      </div>

                      {/* ✅ COMPLETE BUTTON */}
                      {/* <FaCheckCircle
        style={{
          color: "green",
          cursor: "pointer",
          fontSize: "18px",
          marginLeft: "10px"
        }}
      /> */}

                      <FaCheckCircle
                        onClick={() => {
                          if (isTimeOver(appt.time)) {
                            completeAppointment(appt._id);
                          }
                        }}
                        onMouseEnter={() => setHoveredId(appt._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          color:
                            isTimeOver(appt.time) && hoveredId === appt._id
                              ? "#22c55e" // ✅ GREEN on hover
                              : "#cbd5e1", // default grey
                          cursor: isTimeOver(appt.time) ? "pointer" : "not-allowed",
                          fontSize: "18px",
                          marginLeft: "8px",
                          opacity: isTimeOver(appt.time) ? 1 : 0.5,
                          transition: "0.2s ease", // ✅ smooth effect
                        }}
                        title={
                          isTimeOver(appt.time)
                            ? "Click to complete"
                            : "Can complete after time is over"
                        }
                      />

                    </div>
                  ))

                ) : (
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                    No appointments today
                  </p>
                )}
              </div>
            </div>

            {/* Focus Area */}
            <div style={cardStyle}>
              <h4 style={titleStyle}>Next Patient Details</h4>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <div
                  style={{
                    ...avatarStyle,
                    width: "70px",
                    height: "70px",
                    fontSize: "22px",
                    margin: "0 auto 10px",
                  }}
                >{getInitials(nextPatient?.name)}</div>

                <h5 style={{ margin: "5px 0" }}>
                  {nextLoading
                    ? "Loading..."
                    : nextPatient
                      ? nextPatient.name
                      : "No Patient"}
                </h5>

                <div style={infoGridStyle}>
                  <div>
                    <small>Age</small>
                    <p>{nextPatient?.age || "--"}</p>
                  </div>

                  <div>
                    <small>BloodGroup</small>
                    <p>{nextPatient?.bloodGroup || "--"}</p>
                  </div>

                  <div>
                    <small>DOB</small>
                    <p>
                      {nextPatient?.dob
                        ? new Date(nextPatient.dob).toLocaleDateString("en-IN")
                        : "--"}
                    </p>
                  </div>

                  <div>
                    <small>Gender</small>
                    <p>{nextPatient?.gender || "--"}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- BOTTOM ROW: REVIEW & REQUESTS --- */}
          <div style={gridStyle(3)}>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={titleStyle}>Patient Reviews</h4>
              </div>

              {/* TOP RATING SECTION */}
              <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>

                {/* LEFT BOX */}
                <div style={ratingBox}>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>Overall Rating</p>
                  <h2 style={{ margin: "5px 0" }}>
                    {reviewData.avgRating || 0}
                  </h2>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={
                          i < Math.floor(reviewData.avgRating)
                            ? "#facc15"   // filled ⭐
                            : "#e2e8f0"   // empty ☆
                        }
                      />
                    ))}
                  </div>

                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    ({reviewData.totalReviews || 0} reviews)
                  </p>
                </div>

                {/* RIGHT BARS */}
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} style={barRow}>
                      <span style={{ width: "20px", fontSize: "12px" }}>{star}★</span>

                      <div style={barBg}>
                        <div
                          style={{
                            ...barFill,
                            width: reviewData.totalReviews
                              ? `${(reviewData.ratingCount[star] / reviewData.totalReviews) * 100}%`
                              : "0%"
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVIEW LIST */}
              <div style={{ marginTop: "20px" }}>
                {reviewData.latestReviews && reviewData.latestReviews.length > 0 ? (
                  reviewData.latestReviews.map((r) => (
                    <div key={r._id} style={reviewItem}>
                      <div style={avatarStyle}>
                        {getInitials(
                          r.patient
                            ? `${r.patient.firstName} ${r.patient.lastName}`
                            : ""
                        )}
                      </div>

                      <div>
                        <div style={{ fontWeight: "500", fontSize: "14px" }}>
                          {r.patient
                            ? `${r.patient.firstName} ${r.patient.lastName}`
                            : "Patient"}            <span style={{ marginLeft: "8px", fontSize: "11px", color: "#94a3b8" }}>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div style={{ color: "#facc15", fontSize: "12px" }}>
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < r.rating ? "#facc15" : "#e2e8f0"} />
                          ))}
                        </div>

                        <p style={reviewText}>{r.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                    No reviews yet
                  </p>
                )}
              </div>

              <div className="review-header" onClick={() => navigate("/doctor/reviews")} style={{ marginLeft: "200px" }}>
                {/* <button className="view-more-btn"> </button>   */}
                View More →
              </div>
            </div>
            <div style={cardStyle}>
              <h4 style={titleStyle}>Appointment Request</h4>
              <div style={{ ...listContainer, marginTop: "10px", flex: 1 }}>
                {appointmentRequests.length > 0 ? (
                  appointmentRequests.map((req) => (
                    <div
                      key={req._id}
                      style={{
                        padding: "10px",
                        borderRadius: "10px",
                        background: "#F8F9FD",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px"
                      }}
                    >
                      {/* 🔹 TOP ROW: NAME + ICONS */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: "500" }}>
                          {req.patientName}
                        </div>

                        {/* ✅ ICONS BESIDE NAME */}
                        <div style={{ display: "flex", gap: "12px" }}>

                          <FaCheckCircle
                            onClick={() => updateStatus(req._id, "approved")}
                            style={{
                              color: "#22c55e",
                              cursor: "pointer",
                              fontSize: "29px",
                            }}
                            title="Accept"
                          />

                          <FaTimesCircle
                            onClick={() => updateStatus(req._id, "rejected")}
                            style={{
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "30px"
                            }}
                            title="Reject"
                          />
                        </div>
                      </div>

                      {/* 🔹 DATE + TIME BELOW */}
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {new Date(req.date).toLocaleDateString()} • {req.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                    No pending requests
                  </p>
                )}
              </div>
            </div>
            <div style={cardStyle}>
              <h4 style={titleStyle}>Calendar</h4>
              <div style={placeholderBox}>

                <Calendar />
              </div>
            </div>
          </div>

        </main>

        <DoctorFooter open={open} />
      </div>
    </div>
  );
}

// --- STYLES OBJECTS ---

const gridStyle = (cols) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
  gap: "25px",
  marginBottom: "25px"
});

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column",
  height: "100%"
};

const iconCircleStyle = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  background: "#E6F4F4",
  color: "#0AA5A5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  marginRight: "15px"
};

const titleStyle = { margin: 0, fontSize: "16px", color: "#1e293b" };
const labelStyle = { margin: 0, color: "#64748b", fontSize: "13px" };
const valueStyle = { margin: "5px 0", fontSize: "24px" };
const subLabelStyle = { margin: 0, color: "#94a3b8", fontSize: "11px" };

const placeholderBox = {
  flex: 1,
  marginTop: "15px",
  // border: "2px dashed #F1F5F9",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#CBD5E1",
  minHeight: "150px"
};

const listContainer = { display: "flex", flexDirection: "column", gap: "12px" };
const listItemStyle = { display: "flex", alignItems: "center", gap: "10px" };
const avatarStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#0aa5a5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "500",
  fontSize: "14px",
  color: "#fff",
  textTransform: "uppercase",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};
const badgeStyle = { background: "#E6F4F4", color: "#0AA5A5", padding: "4px 8px", borderRadius: "5px", fontSize: "11px" };

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  background: "#F8F9FD",
  padding: "10px",
  borderRadius: "10px",
  marginTop: "15px",
  textAlign: "left"
};
const reviewBtn = {
  background: "#0AA5A5",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px"
};

const ratingBox = {
  background: "#F1F5F9",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
  width: "140px"
};

const barRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "6px"
};

const barBg = {
  background: "#E2E8F0",
  height: "6px",
  borderRadius: "5px",
  flex: 1
};

const barFill = {
  background: "#facc15",
  height: "6px",
  borderRadius: "5px"
};

const reviewItem = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px"
};

const reviewText = {
  fontSize: "13px",
  color: "#475569",
  marginTop: "2px"
};

const viewMore = {
  textAlign: "center",
  marginTop: "10px",
  color: "#0AA5A5",
  cursor: "pointer",
  fontSize: "13px"
};
