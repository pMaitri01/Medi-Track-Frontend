import React, { useState, useRef, useEffect } from "react";
import { Link} from "react-router-dom";
// import { FaBell } from "react-icons/fa";
import { FaBell, FaUserCircle,FaChevronDown } from "react-icons/fa";
import "./Navbar.css";
import Img from "../images/LogoP.png"

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");

  const handleLogout = async () => {
    try{
      await fetch(`${process.env.REACT_APP_API_URL}/api/Patient/logout`, {
        method: "POST",
        credentials: "include",
      })
       
      localStorage.removeItem("user");
      alert("logged out");

      window.location.href = "/";
    }catch(error){
      console.log(error);
    }
  };
  // Close dropdown when clicking outside
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("USER:", user); // ✅ DEBUG

setUsername(
  user?.fullName || 
  user?.name || 
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || 
  "User"
);
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("token"); // if using auth
  //   navigate("/login");
  // };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src={Img} alt="" className="Logo" style={{width:"80px", marginLeft:"15px", height:"80px"}}/>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/PatientHome">Home</Link></li>
        <li><Link to="/DoctorList">Doctors</Link></li>
        <li><Link to="/PatientAppointment">Appointments</Link></li>
        <li><Link to="/records">Medical Records</Link></li>
        <li><Link to="/prescriptions">Prescriptions</Link></li>
      </ul>

      {/* Right Side */}
      <div className="nav-right">
        <FaBell className="icon" />
        <div className="profile-container" ref={dropdownRef}>
  {/* <div 
    className="profile-trigger"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    <FaUserCircle className="profile-icon" />
    <FaChevronDown className={`arrow-icon ${showDropdown ? "rotate" : ""}`} />
  </div> */}
{/* <div 
  className="profile-trigger"
  onClick={() => setShowDropdown(!showDropdown)}
>
  <FaUserCircle className="profile-icon" />
  
  <span className="username-text">{username}</span>

  <FaChevronDown className={`arrow-icon ${showDropdown ? "rotate" : ""}`} />
</div> */}

<div 
  className="profile-pill"
  onClick={() => setShowDropdown(!showDropdown)}
>
    <FaUserCircle className="profile-icon" />

  <span className="profile-name">{username}</span>
</div>
  {showDropdown && (
    <div className="profile-dropdown">
      <div className="dropdown-item">
        <span>👤</span> Profile
      </div>
      <div className="dropdown-item logout" onClick={handleLogout}>
        <span>🚪</span> Logout
      </div>
    </div>
  )}
</div>
      </div>
    </nav>
  );
}

export default Navbar;