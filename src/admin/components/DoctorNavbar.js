import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUserMd,
  FaCalendarCheck,
  FaHistory
} from "react-icons/fa";

import userImg from "../images/Logo-1.png";

/* Toggle Icon */
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

      <polyline
        points="24,18 30,24 24,30"
        fill="none"
        stroke={arrowColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function DoctorNavbar() {

  const [open, setOpen] = useState(true);

  const styles = {
    sidebar: {
      width: open ? "250px" : "100px",
      height: "100vh",
      background: "#0AA5A5",
      color: "#fff",
      padding: "10px",
      position: "fixed",
      transition: "0.3s",
      display: "flex",
      flexDirection: "column"   // important
    },

    menuContainer: {
      flexGrow: 1
    },    
    menuItem: {
      padding: open ? "12px 15px" : "12px 0",
      margin: "10px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: open ? "flex-start" : "center", // center icons when closed
      gap: open ? "10px" : "0",
      borderRadius: "8px",
      cursor: "pointer"
    },

    active: {
      background: "#F4F0E4",
      color: "#0AA5A5"
    },

    img: {
      width: open ? "120px" : "70px",
      height: open ? "130px" : "85px",
      borderRadius: "10%",
      display: "block",
      margin: "0 auto 20px"
    },

    icon: {
      fontSize: open ? "18px" : "25px",
      minWidth: "30px"
    },
    footer: {
      marginTop: "auto",      // pushes footer to bottom
      width: "100%"
    },

separator: {
  borderTop: "1px solid rgba(255,255,255,0.3)",
  width: "100%",
  marginBottom: "0px"    // gap between line and toggle
},

toggleBtn: {
  cursor: "pointer",
  display: "flex",
  justifyContent: open ? "flex-end" : "center",  // keeps icon at right
  alignItems: "center",
  width: "100%",               // take full sidebar width
  marginTop: "5px"
},
  };

  return (
    <div style={styles.sidebar}>

      <img src={userImg} alt="profile" style={styles.img} />

      <div style={styles.menuContainer}>

        <div style={{ ...styles.menuItem, ...styles.active }}>
          <FaTachometerAlt style={styles.icon}/>
          {open && "Dashboard"}
        </div>

        <div style={styles.menuItem}>
          <FaUserMd style={styles.icon}/>
          {open && "Patient List"}
        </div>

        <div style={styles.menuItem}>
          <FaCalendarCheck style={styles.icon}/>
          {open && "Appointment Management"}
        </div>

        <div style={styles.menuItem}>
          <FaHistory style={styles.icon}/>
          {open && "Appointment History"}
        </div>

      </div>
      {/* Toggle Button Fixed Bottom */}
      {/* Footer Section */}
      <div style={styles.footer}>

        {/* Separator Line */}
        <div style={styles.separator}></div>

        {/* Toggle Button */}
        <div
          style={styles.toggleBtn}
          onClick={() => setOpen(!open)}
        >
          <SidebarCollapseIcon
            size={34}
            color="#E5E7EB"
            arrowColor="#ffffff"
            open={open}
          />
        </div>

      </div>

    </div>
  );
}