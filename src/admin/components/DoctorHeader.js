//   import React, { useState } from "react";
// import { FaBell, FaChevronDown } from "react-icons/fa";
// import userImg from "../images/user.png";

// export default function DoctorHeader({ isCollapsed }) {
//   const [open, setOpen] = useState(false);
  
//   // Dynamic margin calculation
//   const currentMargin = isCollapsed ? "80px" : "100px";

//   const styles = {
//     header: {
//       marginLeft: currentMargin, // 🔥 Dynamic Margin
//       height: "70px",
//       background: "#ffffff",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: "0 30px",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//       transition: "margin-left 0.3s ease", // Smooth shift
//     },
//     left: { display: "flex", alignItems: "center", gap: "20px" },
//     right: { display: "flex", alignItems: "center", gap: "20px" },
//     profile: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", position: "relative" },
//     img: { borderRadius: "50%", width: "50px", height: "32px" },
//     dropdown: {
//       position: "absolute",
//       top: "50px",
//       right: 0,
//       background: "#ffffff",
//       border: "1px solid #e5e7eb",
//       borderRadius: "8px",
//       boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//       width: "150px",
//       zIndex: 100
//     },
//     item: { padding: "10px 15px", cursor: "pointer", fontSize: "14px" }
//   };

//   return (
//     <div style={styles.header}>
//       <div style={styles.left}>
//         <span style={{ fontWeight: "500" }}>
//           Hi, Maitri 👋 Welcome to Medi-Track
//         </span>
//       </div>

//       <div style={styles.right}>
//         <FaBell style={{ cursor: "pointer", width: "30px", height: "25px" }} />
//         <div style={styles.profile} onClick={() => setOpen(!open)}>
//           <img src={userImg} alt="profile" style={styles.img} />
//           <FaChevronDown size={12} />
//           {open && (
//             <div style={styles.dropdown}>
//               <div style={styles.item}>👤 Profile</div>
//               <div style={styles.item}>🚪 Logout</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { FaBell, FaChevronDown } from "react-icons/fa";
import userImg from "../images/user.png";

export default function DoctorHeader({ open }) {
  const [showProfile, setShowProfile] = useState(false);
  const sidebarWidth = open ? "0px" : "0px";

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

  return (
    <div style={styles.header}>
      <span style={{ fontWeight: "500" }}>Hi, Maitri 👋 Welcome to Medi-Track</span>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <FaBell style={{ cursor: "pointer", color: "#64748b" }} />
        <div style={styles.profile} onClick={() => setShowProfile(!showProfile)}>
          <img src={userImg} alt="profile" style={styles.img} />
          <FaChevronDown size={12} />
          {showProfile && (
            <div style={styles.dropdown}>
              <div style={{ padding: "10px", fontSize: "14px" }}>👤 Profile</div>
              <div style={{ padding: "10px", fontSize: "14px", borderTop: "1px solid #eee" }}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}