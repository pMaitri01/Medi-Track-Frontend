import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import Img from "../images/LogoP.png";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // console.log("USER FROM LOCALSTORAGE:", user);
  // console.log("LOCAL USER:", user);
  const goToProfile = () => {
    navigate("/UpdatePatientProfile");
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/Patient/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      alert("logged out");

      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    setUsername(
      user?.fullName ||
      user?.name ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      "User"
    );
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
        // setShowNotificationDropdown(false);
        setShowNotificationSidebar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔥 SOCKET JOIN
  //   useEffect(() => {
  //   if (user?._id) {

  //     // connect socket manually
  //     socket.connect();

  //     console.log("FRONTEND USER ID:", user._id);

  //     socket.emit("join", user._id);
  //     const role =
  //   user.role ||
  //   user.userRole ||
  //   user.userType ||
  //   user.accountType;

  // console.log("DETECTED ROLE:", role);
  //     socket.emit("joinRole", user.role);

  //     console.log("JOIN EVENT SENT");

  //     socket.on("connect", () => {
  //       console.log("✅ SOCKET CONNECTED:", socket.id);
  //     });
  //   }

  //   return () => {
  //     socket.off("connect");
  //   };

  // }, [user]);

  useEffect(() => {
    if (!user || !user._id) return;

    const role = user.role;

    if (!role) {
      console.warn("⛔ Skipping socket join: role missing");
      return;
    }

    socket.connect();

    socket.emit("join", user._id);
    socket.emit("joinRole", role);
    socket.emit("joinAll");

    socket.on("connect", () => {
      // console.log("✅ SOCKET CONNECTED:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, [user]);

  // 🔔 REAL-TIME LISTENER
  // useEffect(() => {
  //   socket.on("newNotification", (data) => {
  //     console.log("🔔 New Notification:", data);
  //     setNotifications((prev) => [data, ...prev]);
  //   });

  //   return () => socket.off("newNotification");
  // }, []);
  useEffect(() => {
    socket.on("newNotification", (data) => {
      console.log("🔥 REALTIME RECEIVED:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // 📥 FETCH OLD NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notification/getnotifications`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);
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
  // 🗑️ Delete single notification
  const deleteOne = async (e, id) => {
    e.stopPropagation(); // Prevents navigating to the link when clicking the X
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notification/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🧹 Clear all notifications
  const clearAll = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/notification/clear-all`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img
          src={Img}
          alt=""
          className="Logo"
          style={{ width: "80px", marginLeft: "15px", height: "80px" }}
        />
      </div>

      {/* Links */}
      <ul className="nav-links">
        <li><Link to="/PatientHome">Home</Link></li>
        <li><Link to="/DoctorList">Doctors</Link></li>
        <li><Link to="/PatientAppointment">Appointments</Link></li>
        <li><Link to="/records">Medical Records</Link></li>
        <li><Link to="/prescriptions">Prescriptions</Link></li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-right" ref={dropdownRef}>

        {/* 🔔 NOTIFICATION BELL */}
        <div style={{ position: "relative", marginRight: "20px" }}>
          <FaBell
            className="icon"
            onClick={() => setShowNotificationSidebar(true)}
          />

          {/* 🔴 COUNT */}
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

          {/* 📦 SIDEBAR*/}
          {showNotificationSidebar && (
            <>
              {/* 🔥 BACKDROP */}
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

              {/* 📦 SIDEBAR */}
              <div className={`notification-sidebar ${showNotificationSidebar ? "open" : ""}`}
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
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        style={{ fontSize: "12px", color: "red", cursor: "pointer", border: "none", background: "none" }}
                      >
                        Clear All
                      </button>
                    )}
                    <button class="pheader-close-btn" onClick={() => setShowNotificationSidebar(false)}
                        style={{
                          fontSize: "30px",
                          color: "blacks",
                          border: "none",
                          background: "none",
                          cursor: "pointer"
                        }}>×</button>
                    {/* <button onClick={() => setShowNotificationSidebar(false)}>❌</button> */}
                  </div>
                </div>
                {/* CONTENT */}
                {notifications.length === 0 ? (
                  <p style={{ textAlign: "center", color: "gray" }}>
                    🔕 No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                   <div onClick={() => markAsRead(n._id)}
  key={n._id}
  style={{
    position: "relative",   // ✅ IMPORTANT
    padding: "14px",
    borderBottom: "1px solid #eee",
    background: n.isRead ? "#fff" : "#eef6ff",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  {/* ❌ ABSOLUTE POSITION */}
  <span
    onClick={(e) => deleteOne(e, n._id)}
    style={{
      position: "absolute",
      top: "10px",        // ✅ aligns perfectly
      right: "12px",
      cursor: "pointer",
      fontSize: "14px",
      color: "#666"
    }}
  >
    ✕
  </span>

  {/* MESSAGE */}
  <p style={{
    margin: 0,
    fontSize: "14px",
    paddingRight: "20px"  // ✅ avoid overlap with ❌
  }}>
    {n.message}
  </p>

  {/* TIME */}
  <small style={{
    color: "gray",
    fontSize: "12px",
    display: "block",
    marginTop: "6px"
  }}>
    {new Date(n.createdAt).toLocaleString()}
  </small>
</div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* 👤 PROFILE */}
        <div className="profile-container">
          <div
            className="profile-pill"
            onClick={() =>
              setShowProfileDropdown(!showProfileDropdown)
            }
          >
            <FaUserCircle className="profile-icon" />
            <span className="profile-name">{username}</span>
          </div>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={goToProfile}>
                👤 Profile
              </div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;