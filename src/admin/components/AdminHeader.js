import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminHeader.css";
import { io } from "socket.io-client";
import socket from "../../socket";

const AdminHeader = ({ pageTitle, onHamburger }) => {
  const [showNotificationSidebar, setShowNotificationSidebar] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileRef = useRef(null);
  const navigate = useNavigate();
 const adminData = JSON.parse(localStorage.getItem("adminData"));

const adminId =
  adminData?.id ||
  adminData?._id ||
  adminData?.admin?._id;
  const unread = notifications.filter((n) => !n.isRead).length;
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
      // if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const goTo = (path) => { setProfileOpen(false); navigate(path); };

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
const dismiss = async (id) => {
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
    <header className="ah-header">

      {/* Left */}
      <div className="ah-left">
        <button className="ah-hamburger" onClick={onHamburger}>☰</button>
        <h1 className="ah-title">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="ah-right">

        {/* ── Bell ── */}
        <div className="ah-bell-wrap">
          <button className="ah-icon-btn" onClick={() => {
  setShowNotificationSidebar(true);
  setProfileOpen(false);
}}>
            🔔
            {unread > 0 && <span className="ah-badge">{unread}</span>}
          </button>

        {showNotificationSidebar && (
  <>
    {/* Overlay */}
    <div
      className="notif-overlay"
      onClick={() => setShowNotificationSidebar(false)}
    />

    {/* Sidebar */}
    <div className="notif-sidebar">
      
      {/* Header */}
      <div className="notif-header">
        <h3>Notifications</h3>
        <button onClick={() => setShowNotificationSidebar(false)}>✕</button>
      </div>

      {/* Clear All */}
      {notifications.length > 0 && (
        <div className="notif-clear">
          <button onClick={clearAll}>Clear All</button>
        </div>
      )}

      {/* List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <p className="notif-empty">🎉 All caught up!</p>
        ) : (
          notifications.map((n) => (
            <div
  key={n._id}
  className="notif-item"
  onClick={() => {
    markAsRead(n._id);
    if (n.link) navigate(n.link);
  }}
  style={{ cursor: "pointer" }}
>
              
              <div className="notif-content">
                <p>{n.message}</p>
                <span>{n.time}</span>
              </div>

              <button
                className="notif-delete"
                onClick={(e) => {
  e.stopPropagation();
  dismiss(n._id);
}}
              >
                ✕
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  </>
)}
        </div>

        {/* ── Profile ── */}
        <div className="ah-profile-wrap" ref={profileRef}>
          <button
  className="ah-avatar"
  onClick={() => setProfileOpen(o => !o)}
>
            A
          </button>

          {profileOpen && (
            <div className="ah-dropdown ah-profile-dropdown">
              <div className="ah-profile-info">
                <div className="ah-profile-avatar-lg">A</div>
                <div>
                  <p className="ah-profile-name">Admin</p>
                  <p className="ah-profile-email">admin04@gmail.com</p>
                </div>
              </div>
              <hr className="ah-profile-divider" />
              <ul className="ah-profile-menu">
                {/* <li onClick={() => goTo("/admin/profile")}>
                  <span>👤</span> My Profile
                </li> */}
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
