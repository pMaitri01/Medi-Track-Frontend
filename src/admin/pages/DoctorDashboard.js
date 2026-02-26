import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";
import DoctorFooter from "../components/DoctorFooter";
import React from 'react'

export default function DoctorDashboard() {
  return (
    <div>
        <DoctorNavbar />
        <DoctorHeader/>
        <DoctorFooter/>
    </div>
  )
}
