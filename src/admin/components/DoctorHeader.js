import React, { useState } from "react";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import userImg from "../images/user.png"; // ✅ correct import


export default function DoctorHeader() {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const styles = {
    header: {
      marginLeft: "250px",
      height: "70px",
      background: "#ffffff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    },

    left: {
      display: "flex",
      alignItems: "center",
      gap: "20px"
    },

    // 🔥 Wrapper for input + icon
    searchWrapper: {
      position: "relative",
      width: "350px",
      marginLeft:"280px"
    },

    input: {
      width: "100%",
      height: "40px",
      padding: "0 12px 0 38px", // space for icon
      borderRadius: "8px",
      border: focused ? "2px solid #3b82f6" : "2px solid #e5e7eb",
      outline: "none",
      background: "#f1f5f9",
      fontSize: "14px",
      transition: "0.2s"
    },

    icon: {
      position: "absolute",
      top: "50%",
      left: "12px",
      transform: "translateY(-50%)",
      color: "#6b7280"
    },

    right: {
      display: "flex",
      alignItems: "center",
      gap: "20px"
    },

    profile: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      position: "relative"
    },

    img: {
      borderRadius: "50%",
      width:"50px",
      height:"32px"
    },

    dropdown: {
      position: "absolute",
      top: "50px",
      right: 0,
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      width: "150px",
      zIndex: 100
    },

    item: {
      padding: "10px 15px",
      cursor: "pointer",
      fontSize: "14px"
    }
  };

  return (
    <div style={styles.header}>
      
      {/* LEFT */}
      <div style={styles.left}>
        <span style={{ fontWeight: "500", width:"270px" }}>
          Hi, Maitri 👋 Welcome to Medi-Track
        </span>

        {/* <div style={styles.searchWrapper}>
          <FaSearch style={styles.icon} />
          <input
            type="text"
            placeholder="Search doctor..."
            style={styles.input}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div> */}
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <FaBell style={{ cursor: "pointer", width:"30px", height:"25px",marginLeft:"30px"}} />

        <div
          style={styles.profile}
          onClick={() => setOpen(!open)}
        >
          {/* <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            style={styles.img}
          /> */}
          <img src={userImg} alt="profile" style={styles.img} />
          
          <FaChevronDown size={12} />

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.item}>👤 Profile</div>
              <div style={styles.item}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}