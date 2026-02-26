import React from "react";

export default function DoctorFooter() {
  const styles = {
    footer: {
      marginLeft: "250px",
      background: "#ffffff",
      padding: "15px 30px",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "center", // ✅ CENTER horizontally
      alignItems: "center",
      position: "fixed",
      bottom: 0,
      width: "calc(100% - 250px)"
    },
    center: {
      color: "#64748b",
      fontSize: "14px",
      textAlign: "center" // optional but safer
    }
  };

  return (
    <div style={styles.footer}>
      <div style={styles.center}>
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </div>
    </div>
  );
}