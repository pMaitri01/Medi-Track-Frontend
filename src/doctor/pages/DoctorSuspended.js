import { useLocation, useNavigate } from "react-router-dom";
import "../css/DoctorSuspended.css";
import { useEffect, useState } from "react";
// import suspendedImg from "../images/suspended.png";

export default function DoctorSuspended() {
  const location = useLocation();
  const navigate = useNavigate();

  const reason =
    location.state?.reason || "Your account has been suspended by admin.";

  const doctor = location.state?.doctor;
     useEffect(() => {
    const logout = async () => {
      try {
        await fetch(
          `${process.env.REACT_APP_API_URL}/api/doctor/logout`,
          {
            method: "POST",
            credentials: "include", // important for cookies
          }
        );
      } catch (err) {
        console.log("Logout failed", err);
      }

      // 🧹 clear frontend data
      localStorage.removeItem("doctor");
      localStorage.removeItem("user");
    };

    logout();
  }, []);
  return (
    <div className="status-page-wrapper">
      <div className="status-card suspended-card">
        {/* <img
          src={suspendedImg}
          alt="Suspended"
          className="status-image"
        /> */}

        <h2 className="status-title suspended-title">
          Account Suspended
        </h2>

        <p className="status-message">
          We regret to inform you that your doctor account has been
          temporarily suspended.
        </p>

        <div className="status-reason-box">
          <h4>Reason:</h4>
          <p>{reason}</p>
        </div>

        {doctor && (
          <div className="status-info">
            <p><strong>Name:</strong> {doctor.fullName}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
          </div>
        )}

        <button
          className="status-btn suspended-btn"
          onClick={() => navigate("/DoctorLogin")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}