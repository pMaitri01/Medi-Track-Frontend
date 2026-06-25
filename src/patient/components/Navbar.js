import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import Img from "../images/LogoP.png";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const goToProfile = () => {
    navigate("/UpdatePatientProfile");
  };

  const handleLogout = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: "10px" }}>
            Are you sure you want to logout?
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={async () => {
                try {
                  await fetch(`${process.env.REACT_APP_API_URL}/api/Patient/logout`, {
                    method: "POST",
                    credentials: "include",
                  });
                  localStorage.removeItem("user");
                  toast.success("Logged out successfully");
                  closeToast();
                  setTimeout(() => {
                    window.location.href = "/";
                  }, 1200);
                } catch (error) {
                  console.log(error);
                  toast.error("Logout failed");
                }
              }}
              style={{
                padding: "5px 10px",
                background: "red",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px"
              }}
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              style={{
                padding: "5px 10px",
                background: "gray",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px"
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
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
        setShowNotificationSidebar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    socket.on("connect", () => {});
    return () => {
      socket.off("connect");
    };
  }, [user]);

  useEffect(() => {
    socket.on("newNotification", (data) => {
      console.log("🔥 REALTIME RECEIVED:", data);
      setNotifications((prev) => [data, ...prev]);
    });
    return () => {
      socket.off("newNotification");
    };
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

  const markAsRead = async (id) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/notification/${id}/read`,
        { method: "PUT", credentials: "include" }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOne = async (e, id) => {
    e.stopPropagation();
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
      {/* Hamburger Button (mobile only) */}
      <button
        className="nav-hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile overlay */}
      <div
        className={`nav-mobile-overlay ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Logo */}
      <div className="logo">
        <img
          src={Img}
          alt=""
          className="Logo"
          style={{ width: "80px", marginLeft: "15px", height: "80px" }}
        />
      </div>

      {/* Links — NavLink gives .active class automatically */}
      <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
        <li>
          <NavLink to="/PatientHome" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/DoctorList" onClick={() => setMobileMenuOpen(false)}>
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink to="/PatientAppointment" onClick={() => setMobileMenuOpen(false)}>
            Appointments
          </NavLink>
        </li>
        <li>
          <NavLink to="/records" onClick={() => setMobileMenuOpen(false)}>
            Medical Records
          </NavLink>
        </li>
        <li>
          <NavLink to="/prescriptions" onClick={() => setMobileMenuOpen(false)}>
            Prescriptions
          </NavLink>
        </li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-right" ref={dropdownRef}>

        {/* 🔔 NOTIFICATION BELL */}
        <div style={{ position: "relative", marginRight: "20px" }}>
          <FaBell
            className="icon"
            onClick={() => setShowNotificationSidebar(true)}
          />
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

          {showNotificationSidebar && (
            <>
              <div
                onClick={() => setShowNotificationSidebar(false)}
                style={{
                  position: "fixed",
                  top: 0, left: 0,
                  width: "100%", height: "100%",
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 999,
                }}
              />
              <div
                className={`notification-sidebar ${showNotificationSidebar ? "open" : ""}`}
                style={{
                  position: "fixed",
                  top: 0, right: 0,
                  height: "100%",
                  background: "#fff",
                  zIndex: 1000,
                  boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
                  padding: "15px",
                  overflowY: "auto",
                  transition: "0.3s",
                }}
              >
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
                    <button
                      className="pheader-close-btn"
                      onClick={() => setShowNotificationSidebar(false)}
                      style={{ fontSize: "30px", border: "none", background: "none", cursor: "pointer" }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <p style={{ textAlign: "center", color: "gray" }}>🔕 No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      onClick={() => markAsRead(n._id)}
                      key={n._id}
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
                      <span
                        onClick={(e) => deleteOne(e, n._id)}
                        style={{
                          position: "absolute",
                          top: "10px", right: "12px",
                          cursor: "pointer",
                          fontSize: "14px", color: "#666"
                        }}
                      >
                        ✕
                      </span>
                      <p style={{ margin: 0, fontSize: "14px", paddingRight: "20px" }}>
                        {n.message}
                      </p>
                      <small style={{ color: "gray", fontSize: "12px", display: "block", marginTop: "6px" }}>
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
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
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