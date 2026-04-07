import React from "react";
import { FaTachometerAlt, FaUserMd, FaCalendarCheck, FaHistory, FaFileMedical } from "react-icons/fa";
import userImg from "../images/Logo-1.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SidebarCollapseIcon = ({ size = 24, color = "#6b7280", arrowColor = "#374151", open, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "0.3s"
      }}
      {...props}
    >
      <rect x="4" y="4" width="40" height="40" rx="6" ry="6" stroke={color} strokeWidth="2"/>
      <line x1="16" y1="8" x2="16" y2="40" stroke={color} strokeWidth="2"/>
      <polyline points="24,18 30,24 24,30" fill="none" stroke={arrowColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function DoctorNavbar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const styles = {
    sidebar: {
      width: open ? "250px" : "100px",
      height: "100vh",
      background: "#0AA5A5",
      color: "#fff",
      padding: "10px",
      position: "fixed",
      left: 0,
      top: 0,
      transition: "0.3s",
      display: "flex",
      flexDirection: "column",
      zIndex: 1000
    },
    menuContainer: { flexGrow: 1 },
    menuItem: {
      padding: open ? "12px 15px" : "12px 0",
      margin: "10px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: open ? "flex-start" : "center",
      gap: open ? "10px" : "0",
      borderRadius: "8px",
      cursor: "pointer"
    },
    active: { background: "#F4F0E4", color: "#0AA5A5" },
    img: {
      width: open ? "120px" : "60px",
      height: open ? "130px" : "70px",
      borderRadius: "10%",
      display: "block",
      margin: "0 auto 20px",
      transition: "0.3s"
    },
    icon: { fontSize: open ? "18px" : "25px", minWidth: "30px" },
    footer: { marginTop: "auto", width: "100%" },
    separator: { borderTop: "1px solid rgba(255,255,255,0.3)", width: "100%" },
    toggleBtn: {
      cursor: "pointer",
      display: "flex",
      justifyContent: open ? "flex-end" : "center",
      alignItems: "center",
      width: "100%",
      marginTop: "5px"
    },
  };

  return (
    <div style={styles.sidebar}>
      {/* <img src={userImg} alt="logo" style={styles.img}/> */}
      <img
        src={userImg}
        alt="logo"
        style={styles.img}
        onClick={() => navigate("/DoctorDashboard")}
        />
      <div style={styles.menuContainer}>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === "/DoctorDashboard" && styles.active)
          }}
          onClick={() => navigate("/DoctorDashboard")}
        >
          <FaTachometerAlt style={styles.icon}/>
          {open && "Dashboard"}
        </div>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === "/PatientList" && styles.active)
          }}
          onClick={() => navigate("/PatientList")}
        >
          <FaUserMd style={styles.icon}/>
          {open && "Patient List"}
        </div>
        <div
          style={{
            ...styles.menuItem,
            ...(location.pathname === "/AppointmentView" && styles.active)
          }}
          onClick={() => navigate("/AppointmentView")}
        >
          <FaCalendarCheck style={styles.icon}/>
          {open && "Appointments"}
        </div>
        <div style={{
          ...styles.menuItem,
          ...(location.pathname === "/AppointmentHistory" && styles.active)}
        }
            onClick={() => navigate("/AppointmentHistory")}
        >
          <FaHistory style={styles.icon}/>
          {open && "History"}
        </div>
        <div style={{
          ...styles.menuItem,
          ...(location.pathname === "/DoctorPrescription" && styles.active)
        }}
          onClick={() => navigate("/DoctorPrescription")}
        >
          <FaFileMedical style={styles.icon}/>
          {open && "Prescriptions"}
        </div>
      </div>
      <div style={styles.footer}>
        <div style={styles.separator}></div>
        <div style={styles.toggleBtn} onClick={() => setOpen(!open)}>
          <SidebarCollapseIcon size={34} color="#E5E7EB" arrowColor="#ffffff" open={open} />
        </div>
      </div>
    </div>
  );
}