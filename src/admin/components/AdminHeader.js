import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminHeader.css";
import { io } from "socket.io-client";
import socket from "../../socket";

const AdminHeader = ({ pageTitle, onHamburger }) => {
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
 const adminData = JSON.parse(localStorage.getItem("adminData"));

const adminId =
  adminData?.id ||
  adminData?._id ||
  adminData?.admin?._id;
  const unread = notifications.length;
//   useEffect(() => {
//   socket.connect();

//   socket.on("connect", () => {
//     console.log("✅ Socket Connected:", socket.id);
//   });

//   return () => {
//     socket.disconnect();
//   };
// }, []);

useEffect(() => {
   const adminData = JSON.parse(localStorage.getItem("adminData"));

  const adminId =
    adminData?.id ||
    adminData?._id ||
    adminData?.admin?._id;

  if (!adminId) {
    console.log("❌ Admin ID not found");
    return;
  }

  if (!socket.connected) {
    socket.connect();
  }

  const onConnect = () => {
    console.log("✅ Socket Connected:", socket.id);

    socket.emit("join", adminId);
    console.log("📦 Joined room:", adminId);
  };

  socket.on("connect", onConnect);

  return () => {
    socket.off("connect", onConnect);
  };
}, []);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notification/getnotifications`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("📩 ADMIN NOTIFICATIONS:", data);

      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  fetchNotifications();
}, []);

useEffect(() => {
  const handleNotification = (data) => {
    console.log("📩 NEW NOTIFICATION:", data);

    setNotifications((prev) => [data, ...prev]);
  };

  socket.on("newNotification", handleNotification);

  return () => {
    socket.off("newNotification", handleNotification);
  };
}, []);

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearAll = () => setNotifications([]);
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n._id !== id));

  const goTo = (path) => { setProfileOpen(false); navigate(path); };

  return (
    <header className="ah-header">

      {/* Left */}
      <div className="ah-left">
        <button className="ah-hamburger" onClick={onHamburger}>☰</button>
        <h1 className="ah-title">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="ah-right">

        {/* ── Bell ── */}
        <div className="ah-bell-wrap" ref={bellRef}>
          <button className="ah-icon-btn" onClick={() => { setBellOpen(o => !o); setProfileOpen(false); }}>
            🔔
            {unread > 0 && <span className="ah-badge">{unread}</span>}
          </button>

          {bellOpen && (
            <div className="ah-dropdown">
              <div className="ah-dropdown-header">
                <span className="ah-dropdown-title">Notifications</span>
                {notifications.length > 0 && (
                  <button className="ah-clear-btn" onClick={clearAll}>Clear all</button>
                )}
              </div>
              <ul className="ah-notif-list">
                {notifications.length === 0 ? (
                  <li className="ah-notif-empty"><span>🎉</span> All caught up!</li>
                ) : (
                  notifications.map(n => (
                    <li key={n._id} className="ah-notif-item">
                      <div className="ah-notif-dot" />
                      <div className="ah-notif-body">
                        <p className="ah-notif-msg">{n.message}</p>
                        <span className="ah-notif-time">{n.time}</span>
                      </div>
                      <button className="ah-notif-dismiss" onClick={() => dismiss(n._id)}>✕</button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="ah-profile-wrap" ref={profileRef}>
          <button className="ah-avatar" onClick={() => { setProfileOpen(o => !o); setBellOpen(false); }}>
            A
          </button>

          {profileOpen && (
            <div className="ah-dropdown ah-profile-dropdown">
              <div className="ah-profile-info">
                <div className="ah-profile-avatar-lg">A</div>
                <div>
                  <p className="ah-profile-name">Admin User</p>
                  <p className="ah-profile-email">admin04@gmail.com</p>
                </div>
              </div>
              <hr className="ah-profile-divider" />
              <ul className="ah-profile-menu">
                <li onClick={() => goTo("/admin/profile")}>
                  <span>👤</span> My Profile
                </li>
                <li
                  className="ah-profile-logout"
                  onClick={async () => {
                    try {
                      await fetch(`${process.env.REACT_APP_API_URL}/api/admin/logout`, {
                        method: "POST",
                        credentials: "include",
                      });

                      localStorage.removeItem("user"); navigate("/admin/login");
                    } catch (err) {
                      console.error("Logout failed", err);
                    }
                  }}
                >
                  <span>🚪</span> Logout
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
