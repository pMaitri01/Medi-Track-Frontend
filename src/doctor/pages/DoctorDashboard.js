import React, { useState, useEffect } from "react";
import DoctorNavbar from "../components/DoctorNavbar";
import DoctorHeader from "../components/DoctorHeader";
import DoctorFooter from "../components/DoctorFooter";
import Calendar from "../components/Calendar";
import GenderChart from "../components/GenderChart";

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

  // Layout Constants
  const sidebarWidth = open ? "250px" : "100px";

  useEffect(() => {
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
  }, []);

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
        <DoctorHeader open={open} />

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

                      <div style={avatarStyle}></div>

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
                <div style={{ ...avatarStyle, width: "70px", height: "70px", margin: "0 auto 10px" }}></div>
                <h5 style={{ margin: "5px 0" }}>Loading...</h5>
                <div style={infoGridStyle}>
                  <div><small>Weight</small><p>--</p></div>
                  <div><small>ID</small><p>--</p></div>
                  <div><small>DOB</small><p>--</p></div>
                  <div><small>Sex</small><p>--</p></div>
                </div>
              </div>
            </div>

          </div>

          {/* --- BOTTOM ROW: REVIEW & REQUESTS --- */}
          <div style={gridStyle(3)}>
            <div style={cardStyle}>
              <h4 style={titleStyle}>Patients Review</h4>
              <div style={placeholderBox}>Review List</div>
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
      
      <FaCheck
        onClick={() => updateStatus(req._id, "approved")}
        style={{
          color: "#22c55e",
          cursor: "pointer",
          fontSize: "26px",
          marginTop: "10px"
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
const avatarStyle = { width: "35px", height: "35px", borderRadius: "50%", background: "#F1F5F9" };
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
