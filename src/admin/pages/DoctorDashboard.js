import React, { useState } from "react";
import DoctorNavbar from "../components/DoctorNavbar";
import DoctorHeader from "../components/DoctorHeader";
import DoctorFooter from "../components/DoctorFooter";
import { FaUserFriends, FaHospitalUser, FaClock } from "react-icons/fa";

export default function DoctorDashboard() {
  const [open, setOpen] = useState(true);

  // Layout Constants
  const sidebarWidth = open ? "250px" : "100px";

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FD" }}>
      <DoctorNavbar open={open} setOpen={setOpen} />

      <div style={{ 
        marginLeft: sidebarWidth, 
        transition: "0.3s ease", 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh" 
      }}>
        <DoctorHeader open={open} />

        <main style={{ padding: "30px", flex: 1, paddingBottom: "100px" }}>
          
          {/* --- TOP ROW: STAT CARDS --- */}
          <div style={gridStyle(3)}>
            {[
              { label: "Total Patient", icon: <FaUserFriends /> },
              { label: "Today Patient", icon: <FaHospitalUser /> },
              { label: "Today Appointments", icon: <FaClock /> }
            ].map((card, i) => (
              <div key={i} style={cardStyle}>
                <div style={iconCircleStyle}>{card.icon}</div>
                <div>
                  <p style={labelStyle}>{card.label}</p>
                  <h3 style={valueStyle}>--</h3> {/* Backend Data Point */}
                  <p style={subLabelStyle}>Loading...</p>
                </div>
              </div>
            ))}
          </div>

          {/* --- MIDDLE ROW: SUMMARY & LISTS --- */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr", gap: "25px", marginBottom: "25px" }}>
            
            {/* Chart Area */}
            <div style={cardStyle}>
              <h4 style={titleStyle}>Patients Summary</h4>
              <div style={placeholderBox}>Chart Visualization</div>
            </div>

            {/* List Area */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <h4 style={titleStyle}>Today Appointment</h4>
                <span style={{ color: "#0AA5A5", fontSize: "12px", cursor: "pointer" }}>See All</span>
              </div>
              <div style={listContainer}>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} style={listItemStyle}>
                    <div style={avatarStyle}></div>
                    <div style={{ flex: 1, fontSize: "14px" }}>Patient Name</div>
                    <div style={badgeStyle}>00:00</div>
                  </div>
                ))}
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
              <div style={placeholderBox}>Requests List</div>
            </div>
            <div style={cardStyle}>
              <h4 style={titleStyle}>Calendar</h4>
              <div style={placeholderBox}>Date Picker</div>
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
  flexDirection: "column"
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
  border: "2px dashed #F1F5F9",
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