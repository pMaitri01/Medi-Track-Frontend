import React from "react";
import Navbar from "../components/Navbar";
import "../css/PatientHome.css";

export default function PatientHome() {
  return (
    <div className="patient-home">

      <Navbar />

      <div className="home-content">
        <h1>Welcome Patient 👋</h1>
        <p>Manage your appointments, prescriptions and health records easily.</p>

        <div className="cards">

          <div className="card">
            <h3>Book Appointment</h3>
            <p>Schedule appointment with doctors.</p>
          </div>

          <div className="card">
            <h3>My Appointments</h3>
            <p>View upcoming appointments.</p>
          </div>

          <div className="card">
            <h3>Medical Records</h3>
            <p>Access your health history.</p>
          </div>

          <div className="card">
            <h3>Prescriptions</h3>
            <p>Check doctor prescriptions.</p>
          </div>

        </div>
      </div>

    </div>
  );
}