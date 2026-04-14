// import React, { useState } from "react";
// import { FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import userImg from "../images/user.png";
// import { useNavigate } from "react-router-dom";

// export default function DoctorHeader({ open }) {
//   const [showProfile, setShowProfile] = useState(false);
//   const sidebarWidth = open ? "0px" : "0px";
//   const navigate = useNavigate();
//   const styles = {
//     header: {
//       marginLeft: sidebarWidth,
//       height: "70px",
//       background: "#ffffff",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "15px 30px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//       transition: "0.3s"
//     },
//     profile: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", position: "relative" },
//     img: { borderRadius: "50%", width: "40px", height: "30px" },
//     dropdown: {
//       position: "absolute", top: "50px", right: 0, background: "#fff",
//       border: "1px solid #e5e7eb", borderRadius: "8px", width: "150px", zIndex: 100
//     }
//   };

//   const handleLogout = async () => {
//   try {
//     await fetch(`${process.env.REACT_APP_API_URL}/api/Doctor/logout`, {
//       method: "POST",
//       credentials: "include",
//     });

//     localStorage.removeItem("doc"); // optional
//     alert("Logged out");

//     window.location.href = "/DoctorLogin";
//   } catch (error) {
//     console.error(error);
//   }
// };

//   return (
//     <div style={styles.header}>
//       <span style={{ fontWeight: "500" }}>Hi, Maitri 👋 Welcome to Medi-Track</span>
//       <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//         <FaBell style={{ cursor: "pointer", color: "#64748b" }} />
  
//         <div style={styles.profile} onClick={() => setShowProfile(!showProfile)}>
//           <img src={userImg} alt="profile" style={styles.img} />

//           {/* 🔥 Toggle arrow */}
//           {showProfile ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}

//           {showProfile && (
//             <div style={styles.dropdown}>
//               <div style={{ padding: "10px", fontSize: "14px" }}>👤 Profile</div>
//               <div
//                 style={{ padding: "10px", fontSize: "14px", borderTop: "1px solid #eee" }}
//                 onClick={handleLogout}
//               >
//                 🚪 Logout
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { FaBell, FaChevronDown, FaChevronUp, FaUser, FaSignOutAlt } from "react-icons/fa";
import userImg from "../images/user.png";
import { useNavigate } from "react-router-dom";
import { useDoctor } from "../../context/DoctorContext";

export default function DoctorHeader({ open }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state
  const navigate = useNavigate();
  const { doctor } = useDoctor();
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


const handleLogout = async () => {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/Doctor/logout`, {
      method: "POST",
      credentials: "include"
    });

    localStorage.removeItem("doc");
    window.location.href = "/";

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={styles.header}>
<span style={{ fontWeight: "500", color: "#374151" }}>
  Hi, Dr. {doctor?.fullName} 👋 Welcome to Medi-Track
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
          <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#ef4444", borderRadius: "50%", width: "8px", height: "8px", border: "2px solid white" }}></span>

          {showNotifications && (
            <div style={styles.notificationCard}>
              <div style={styles.cardHeader}>Notifications</div>
              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                <div style={styles.notifyItem} className="hover-gray">📅 New appointment from John Doe at 10:00 AM</div>
                <div style={styles.notifyItem} className="hover-gray">📝 Lab report uploaded for Patient P004</div>
                <div style={styles.notifyItem} className="hover-gray">⚠️ Surgery rescheduled for tomorrow</div>
              </div>
              <div 
                style={styles.seeMore} 
                onClick={() => { navigate("/Notifications"); setShowNotifications(false); }}
              >
                See all notifications
              </div>
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
              <div style={{ padding: "12px 15px", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} className="hover-gray">
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