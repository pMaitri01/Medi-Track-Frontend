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