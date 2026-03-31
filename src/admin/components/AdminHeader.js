import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminHeader.css";

const dummyNotifications = [
  { id: 1, message: "Dr. Rahul Mehta submitted a new registration.",  time: "2 min ago"  },
  { id: 2, message: "Patient Ravi Shah booked an appointment.",        time: "15 min ago" },
  { id: 3, message: "System maintenance scheduled for 30 Mar 2026.",   time: "1 hr ago"   },
  { id: 4, message: "Dr. Priya Patel updated her profile.",            time: "3 hr ago"   },
  { id: 5, message: "New patient registration: Kavita Mishra.",        time: "Yesterday"  },
];

const AdminHeader = ({ pageTitle, onHamburger }) => {
  const [bellOpen, setBellOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const bellRef    = useRef(null);
  const profileRef = useRef(null);
  const navigate   = useNavigate();

  const unread = notifications.length;

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current    && !bellRef.current.contains(e.target))    setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearAll = () => setNotifications([]);
  const dismiss  = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

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
                    <li key={n.id} className="ah-notif-item">
                      <div className="ah-notif-dot" />
                      <div className="ah-notif-body">
                        <p className="ah-notif-msg">{n.message}</p>
                        <span className="ah-notif-time">{n.time}</span>
                      </div>
                      <button className="ah-notif-dismiss" onClick={() => dismiss(n.id)}>✕</button>
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
                  <p className="ah-profile-email">admin@meditrack.com</p>
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

      localStorage.removeItem("adminData");
      navigate("/");
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
