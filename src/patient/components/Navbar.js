import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import Img from "../images/LogoP.png";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("USER FROM LOCALSTORAGE:", user);
  console.log("LOCAL USER:", user);
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
        setShowNotificationDropdown(false);
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

  console.log("FRONTEND USER ID:", user._id);
  console.log("DETECTED ROLE:", role);

  socket.emit("join", user._id);
  socket.emit("joinRole", role);
  socket.emit("joinAll");
  
  console.log("JOIN EVENT SENT");

  socket.on("connect", () => {
    console.log("✅ SOCKET CONNECTED:", socket.id);
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
            onClick={() =>
              setShowNotificationDropdown(!showNotificationDropdown)
            }
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

          {/* 📦 DROPDOWN */}
          {showNotificationDropdown && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "0",
                width: "300px",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {notifications.length === 0 ? (
                <p style={{ padding: "15px", textAlign: "center", color: "gray" }}>
                  🔕 No new notifications
                </p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      background: n.isRead ? "#fff" : "#eef6ff",
                      fontWeight: n.isRead ? "normal" : "bold", cursor: "pointer",
                    }}
                    // onClick={async () => {
                    //   await fetch(
                    //     `${process.env.REACT_APP_API_URL}/api/notification/${n._id}/read`,
                    //     {
                    //       method: "PUT",
                    //       credentials: "include",
                    //     }
                    //   );

                    //   window.location.href = n.link;
                    // }}
                    onClick={async () => {
                      try {
                        await fetch(
                          `${process.env.REACT_APP_API_URL}/api/notification/${n._id}/read`,
                          {
                            method: "PUT",
                            credentials: "include",
                          }
                        );

                        // ✅ Update UI instantly
                        setNotifications((prev) =>
                          prev.map((notif) =>
                            notif._id === n._id ? { ...notif, isRead: true } : notif
                          )
                        );

                        navigate(n.link);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    <div>
                      <strong>{n.title}</strong>
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        {n.message}
                      </p>
                      <small style={{ color: "gray" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
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