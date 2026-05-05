import React, { useState, useEffect } from "react";
import { FaBell, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt } from "react-icons/fa";
import userImg from "../images/user.png";
import { useNavigate } from "react-router-dom";
import { useDoctor } from "../../context/DoctorContext";
import socket from "../../socket";

export default function DoctorHeader({ open }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();
  const { doctor } = useDoctor();

  const goToProfile = () => {
    navigate("/UpdateDoctorProfile"); // your route
    setShowProfile(false); // close dropdown
  };

  const styles = {
    header: {
      height: "70px",
      background: "#ffffff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "0.3s",
      position: "relative",
       
    },
    actionArea: { display: "flex", alignItems: "center", gap: "20px" },
    bellContainer: { position: "relative", cursor: "pointer" },
    profile: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", position: "relative" },
    img: { borderRadius: "50%", width: "35px", height: "35px", objectFit: "cover" },
    
    // Dropdown Card Styles
    dropdown: {
      position: "absolute", top: "55px", right: 0, background: "#fff",
      border: "1px solid #e5e7eb", borderRadius: "12px", width: "200px", 
      zIndex: 100, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", overflow: "hidden"
    },
    
    // Notification Card Specific Styles
    notificationCard: {
      position: "absolute", top: "55px", right: "0px", background: "#fff",
      border: "1px solid #e5e7eb", borderRadius: "12px", width: "300px", 
      zIndex: 100, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
    },
    cardHeader: { padding: "12px 15px", fontWeight: "bold", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" },
    notifyItem: { padding: "12px 15px", fontSize: "13px", borderBottom: "1px solid #f3f4f6", cursor: "pointer", color: "#4b5563" },
    seeMore: { padding: "10px", textAlign: "center", fontSize: "13px", color: "#0AA5A5", fontWeight: "600", cursor: "pointer", display: "block", textDecoration: "none" }
  };

useEffect(() => {
  if (doctor?._id) {
    socket.emit("join", doctor._id);
    console.log("Doctor joined:", doctor._id);
  }
}, [doctor]);

useEffect(() => {
  socket.on("newNotification", (data) => {
    console.log("🔔 Doctor Notification:", data);
    setNotifications((prev) => [data, ...prev]);
  });

  return () => socket.off("newNotification");
}, []);

useEffect(() => {
  const fetchNotifications = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/notification/getnotifications`,
      { credentials: "include" }
    );

    const data = await res.json();
    setNotifications(data);
  };

  fetchNotifications();
}, []);
const handleLogout = async () => {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/Doctor/logout`, {
      method: "POST",
      credentials: "include"
    });

    localStorage.removeItem("doctor");
    window.location.href = "/";

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={styles.header}>
<span style={{ fontWeight: "500", color: "#374151" }}>
  
  Hi. 👋 {doctor?.fullName ? `Dr. ${doctor.fullName}` : "Dr."}
. Welcome to Medi-Track
</span>      
      <div style={styles.actionArea}>
        
        {/* --- NOTIFICATION SECTION --- */}
        <div style={styles.bellContainer}>
          <FaBell 
            size={20} 
            style={{ color: showNotifications ? "#0AA5A5" : "#64748b" }} 
            onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false); // Close profile if notification opens
            }}
          />
          {/* Red dot badge (optional) */}
         {unreadCount > 0 && (
  <span
    style={{
      position: "absolute",
      top: "-5px",
      right: "-5px",
      background: "red",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "12px",
    }}
  >
    {unreadCount}
  </span>
)}
          {showNotifications && (
            <div style={styles.notificationCard}>
              <div style={styles.cardHeader}>Notifications</div>
              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
               {notifications.length === 0 ? (
  <p style={{ padding: "15px", textAlign: "center", color: "gray" }}>
    🔕 No notifications
  </p>
) : (
  notifications.slice(0, 6).map((n) => (
    <div
      key={n._id}
      style={{
        ...styles.notifyItem,
        background: n.isRead ? "#fff" : "#eef6ff",
        fontWeight: n.isRead ? "normal" : "bold",
      }}
      onClick={async () => {
        try {
          await fetch(
            `${process.env.REACT_APP_API_URL}/api/notification/${n._id}/read`,
            {
              method: "PUT",
              credentials: "include",
            }
          );

          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === n._id
                ? { ...notif, isRead: true }
                : notif
            )
          );

          navigate(n.link);
        } catch (err) {
          console.error(err);
        }
      }}
    >
      <strong>{n.title}</strong>
      <p style={{ margin: "5px 0" }}>{n.message}</p>
      <small style={{ color: "gray" }}>
        {new Date(n.createdAt).toLocaleString()}
      </small>
    </div>
  ))
)}
              </div>
              {/* <div 
                style={styles.seeMore} 
                onClick={() => { navigate("/Notifications"); setShowNotifications(false); }}
              >
                See all notifications
              </div> */}
            </div>
          )}
        </div>

        {/* --- PROFILE SECTION --- */}
        <div style={styles.profile} onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifications(false); // Close notifications if profile opens
        }}>
          <img src={userImg} alt="profile" style={styles.img} />
          {showProfile ? <FaChevronUp size={12} color="#64748b" /> : <FaChevronDown size={12} color="#64748b" />}

          {showProfile && (
            <div style={styles.dropdown}>
              <div style={{ padding: "12px 15px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} 
                className="hover-gray"
                onClick={goToProfile}
              >
                <FaUser size={13} /> Profile
              </div>
              <div
                style={{ padding: "12px 15px", fontSize: "14px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px", color: "#ef4444" }}
                onClick={handleLogout}
              >
                <FaSignOutAlt size={13} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}