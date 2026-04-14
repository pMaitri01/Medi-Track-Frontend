import React from "react";
import { Navigate } from "react-router-dom";

const DoctorStatusRoute = ({ children, allowedStatus }) => {
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  if (!doctor) {
    return <Navigate to="/DoctorLogin" />;
  }

  const status = (doctor.status || "").toLowerCase();

  if (!allowedStatus.includes(status)) {
    // redirect based on status
    if (status === "approved") {
      return <Navigate to="/DoctorDashboard" />;
    }
    if (status === "pending") {
      return <Navigate to="/DoctorWaiting" />;
    }
    if (status === "rejected") {
      return <Navigate to="/DoctorRejected" />;
    }
  }

  return children;
};

export default DoctorStatusRoute;