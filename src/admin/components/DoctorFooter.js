// import React from "react";

// export default function DoctorFooter({ isCollapsed }) {
//   // Dynamic values
//   const sidebarWidth = isCollapsed ? "80px" : "100px";

//   const styles = {
//     footer: {
//       marginLeft: sidebarWidth, // 🔥 Dynamic Margin
//       background: "#ffffff",
//       padding: "15px 30px",
//       borderTop: "1px solid #e5e7eb",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       position: "fixed",
//       bottom: 0,
//       width: `calc(100% - ${sidebarWidth})`, // 🔥 Dynamic Width
//       transition: "all 0.3s ease", // Smooth transition
//     },
//     center: {
//       color: "#64748b",
//       fontSize: "14px",
//       textAlign: "center"
//     }
//   };

//   return (
//     <div style={styles.footer}>
//       <div style={styles.center}>
//         © {new Date().getFullYear()} MediTrack. All rights reserved.
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function DoctorFooter({ open }) {
  const sidebarWidth = open ? "0px" : "0px";

  const styles = {
    footer: {
      marginLeft: sidebarWidth,
      background: "#ffffff",
      padding: "15px 30px",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "center",
      position: "fixed",
      bottom: 0,
      width: `calc(100% - ${sidebarWidth})`,
      transition: "0.3s",
      zIndex: 999
    }
  };

  return (
    <div style={styles.footer}>
      <div style={{ color: "#64748b", fontSize: "14px" }}>
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </div>
    </div>
  );
}