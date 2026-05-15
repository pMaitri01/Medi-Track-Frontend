import React, { useState, useEffect } from "react";
import { FaBell, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt } from "react-icons/fa";
import userImg from "../images/user.png";
import { useNavigate } from "react-router-dom";
import { useDoctor } from "../../context/DoctorContext";
import socket from "../../socket";
import { toast } from "react-toastify";

export default function DoctorHeader({ open }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
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

  // useEffect(() => {

  //   console.log("DOCTOR CONTEXT:", doctor);

  //   if (!doctor?.id) return;

  //   if (!socket.connected) {
  //     socket.connect();
  //   }

  //   console.log("DOCTOR ID:", doctor.id);

  //   socket.emit("join", doctor.id);

  //   console.log("✅ DOCTOR JOIN SENT");

  //   socket.on("connect", () => {
  //     console.log("✅ DOCTOR SOCKET CONNECTED:", socket.id);
  //   });

  //   return () => {
  //     socket.off("connect");
  //   };

  // }, [doctor?.id]);

  useEffect(() => {
    if (!doctor?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    console.log("DOCTOR ID:", doctor.id);

    // Join personal room
    socket.emit("join", doctor.id);

    //  Join role room (IMPORTANT)
    socket.emit("joinRole", "Doctor");

    // Join global room for all users
    socket.emit("joinAll");

    console.log("✅ DOCTOR JOIN + ROLE JOIN SENT");

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, [doctor?.id]);

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
  // const handleLogout = async () => {
  //   try {
  //     await fetch(`${process.env.REACT_APP_API_URL}/api/Doctor/logout`, {
  //       method: "POST",
  //       credentials: "include"
  //     });

  //     localStorage.removeItem("doctor");
  //     window.location.href = "/";

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

const handleLogout = () => {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ marginBottom: "10px" }}>
          Are you sure you want to logout?
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* YES */}
          <button
            onClick={async () => {
              try {
                await fetch(`${process.env.REACT_APP_API_URL}/api/Doctor/logout`, {
                  method: "POST",
                  credentials: "include"
                });

                localStorage.removeItem("doctor");

                toast.success("Logged out successfully");
                closeToast();

                setTimeout(() => {
                  window.location.href = "/";
                }, 1500);

              } catch (error) {
                console.error(error);
                toast.error("Logout failed");
              }
            }}
            style={{
              padding: "5px 10px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Yes
          </button>

          {/* NO */}
          <button
            onClick={() => {
              toast.info("Logout cancelled");
              closeToast();
            }}
            style={{
              padding: "5px 10px",
              background: "#e5e7eb",
              color: "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false, // IMPORTANT (so user can click)
      closeOnClick: false,
      draggable: false,
    }
  );
};
  const markAsRead = async (id) => {
  try {
    await fetch(
      `${process.env.REACT_APP_API_URL}/api/notification/${id}/read`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  } catch (err) {
    console.error(err);
  }
};
const deleteOne = async (e, id) => {
  e.stopPropagation();

  try {
    await fetch(
      `${process.env.REACT_APP_API_URL}/api/notification/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    setNotifications((prev) =>
      prev.filter((n) => n._id !== id)
    );
  } catch (err) {
    console.error(err);
  }
};
const clearAll = async () => {
  try {
    await fetch(
      `${process.env.REACT_APP_API_URL}/api/notification/clear-all`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    setNotifications([]);
  } catch (err) {
    console.error(err);
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
            style={{ color: showNotificationSidebar ? "#0AA5A5" : "#64748b" }}
            onClick={() => {
              setShowNotificationSidebar(true);
              setShowProfile(false);
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
          )}{showNotificationSidebar && (
            <>
              {/* BACKDROP */}
              <div
                onClick={() => setShowNotificationSidebar(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 999,
                }}
              />

              {/* SIDEBAR */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  width: "350px",
                  height: "100%",
                  background: "#fff",
                  zIndex: 1000,
                  boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
                  padding: "15px",
                  overflowY: "auto",
                  transition: "0.3s",
                }}
              >
                {/* HEADER */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px"
                }}>
                  <h3>Notifications</h3>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        style={{
                          fontSize: "12px",
                          color: "red",
                          border: "none",
                          background: "none",
                          cursor: "pointer"
                        }}
                      >
                        Clear All
                      </button>
                    )}

                    {/* <button>
                      ❌
                    </button> */}
                    <button class="dheader-close-btn" onClick={() => setShowNotificationSidebar(false)}
                        style={{
                          fontSize: "30px",
                          color: "blacks",
                          border: "none",
                          background: "none",
                          cursor: "pointer"
                        }}>×</button>
                  </div>
                </div>

                {/* CONTENT */}
                {notifications.length === 0 ? (
                  <p style={{ textAlign: "center", color: "gray" }}>
                    🔕 No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                 onClick={() => {
  markAsRead(n._id);
  if (n.link) navigate(n.link);
}}
                      style={{
                        position: "relative",
                        padding: "14px",
                        borderBottom: "1px solid #eee",
                        background: n.isRead ? "#fff" : "#eef6ff",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      {/* DELETE */}
                      <span
  onClick={(e) => deleteOne(e, n._id)}
  style={{
    position: "absolute",
    top: "10px",
    right: "12px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666"
  }}
>
  ✕
</span>

                      <p style={{ margin: 0, paddingRight: "20px" }}>
                        {n.message}
                      </p>

                      <small style={{ color: "gray" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* --- PROFILE SECTION --- */}
        <div style={styles.profile} onClick={() => {
          setShowProfile(!showProfile);
          setShowNotificationSidebar(false); // Close notifications if profile opens
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