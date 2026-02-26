import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "./Navbar.css";
import Img from "../images/LogoP.png"

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem("token"); // if using auth
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src={Img} alt="" className="Logo" style={{width:"80px", marginLeft:"15px", height:"80px"}}/>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/doctors">Doctors</Link></li>
        <li><Link to="/history">Appointment History</Link></li>
        <li><Link to="/records">Medical Records</Link></li>
        <li><Link to="/prescriptions">Prescriptions</Link></li>
      </ul>

      {/* Right Side */}
      <div className="nav-right">
        <FaBell className="icon" />

        <div className="profile-section" ref={dropdownRef}>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="profile-img"
            // onClick={() => setShowDropdown(!showDropdown)}
          />

          {/* {showDropdown && (
            <div className="dropdown">
              <p onClick={() => navigate("/profile")}>My Profile</p>
              <p className="logout" onClick={handleLogout}>Logout</p>
            </div>
          )} */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;