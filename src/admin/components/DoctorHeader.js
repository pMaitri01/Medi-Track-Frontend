import React, { useState } from "react";
import { FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import userImg from "../images/user.png";
import { useNavigate } from "react-router-dom";

export default function DoctorHeader({ open }) {
  const [showProfile, setShowProfile] = useState(false);
  const sidebarWidth = open ? "0px" : "0px";
  const navigate = useNavigate();
  const styles = {
    header: {
      marginLeft: sidebarWidth,
      height: "70px",
      background: "#ffffff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "0.3s"
    },
    profile: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", position: "relative" },
    img: { borderRadius: "50%", width: "40px", height: "30px" },
    dropdown: {
      position: "absolute", top: "50px", right: 0, background: "#fff",
      border: "1px solid #e5e7eb", borderRadius: "8px", width: "150px", zIndex: 100
    }
  };

  const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/api/Doctor/logout", {
      method: "POST",
      credentials: "include",
    });

    // localStorage.removeItem("doc"); // optional
    alert("Logged out");

    window.location.href = "/DoctorLogin";
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={styles.header}>
      <span style={{ fontWeight: "500" }}>Hi, Maitri 👋 Welcome to Medi-Track</span>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <FaBell style={{ cursor: "pointer", color: "#64748b" }} />
  
        <div style={styles.profile} onClick={() => setShowProfile(!showProfile)}>
          <img src={userImg} alt="profile" style={styles.img} />

          {/* 🔥 Toggle arrow */}
          {showProfile ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}

          {showProfile && (
            <div style={styles.dropdown}>
              <div style={{ padding: "10px", fontSize: "14px" }}>👤 Profile</div>
              <div
                style={{ padding: "10px", fontSize: "14px", borderTop: "1px solid #eee" }}
                onClick={handleLogout}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}