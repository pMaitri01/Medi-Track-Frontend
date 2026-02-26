import React from 'react'
import Navbar from '../components/Navbar'

export default function PatientHome() {
  return (
    <div>
      <Navbar/>
    </div>
  )
}


// import React, { useState } from "react";
// import "./PatientHome.css";
// import dentistImg from "../images/register.jpeg"; // use your own image

// function PatientHome() {
//   const [appointment, setAppointment] = useState(null);

//   const bookAppointment = () => {
//     const date = new Date();
//     const day = date.toLocaleDateString("en-US", { weekday: "long" });

//     setAppointment({
//       doctor: "Dr. John Smith",
//       date: date.toLocaleDateString(),
//       time: "10:30 AM",
//       day: day,
//     });
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="main-card">

//         {/* Navbar */}
//         <nav className="navbar">
//           <div className="logo">Denty</div>
//           <ul>
//             <li className="active">Home</li>
//             <li>About</li>
//             <li>Services</li>
//             <li>Doctors</li>
//             <li>Appointments</li>
//             <li>Contact</li>
//           </ul>
//         </nav>

//         {/* Content */}
//         <div className="content">

//           {/* LEFT SECTION */}
//           <div className="left-section">

//             <div className="rating">⭐ 5.0 (4824 Reviews)</div>

//             <h1>
//               Exceptional Dental Care,
//               <br />
//               Every Step Of The Way
//             </h1>

//             <p>
//               Your smile deserves the best. Experience advanced dental solutions
//               with a gentle touch, tailored for your comfort.
//             </p>

//             <div className="buttons">
//               <button className="primary-btn" onClick={bookAppointment}>
//                 Book Appointment
//               </button>
//               <button className="secondary-btn">
//                 Get Started Today
//               </button>
//             </div>

//             {/* Small Cards */}
//             <div className="mini-cards">
//               <div className="mini-card peach">
//                 <h4>24/7 Service Available</h4>
//               </div>

//               <div className="mini-card purple">
//                 <h4>Find The Best Doctors</h4>
//               </div>
//             </div>

//             {/* Next Appointment */}
//             {appointment && (
//               <div className="next-appointment">
//                 <h3>Next Appointment</h3>
//                 <p>
//                   {appointment.doctor} <br />
//                   {appointment.date} ({appointment.day}) <br />
//                   {appointment.time}
//                 </p>
//               </div>
//             )}

//           </div>

//           {/* RIGHT SECTION */}
//           <div className="right-section">
//             <img src={dentistImg} alt="Dentist" />

//             <div className="stats">
//               <div className="stat-card">
//                 <h3>200+</h3>
//                 <p>Expert Doctors</p>
//               </div>

//               <div className="stat-card">
//                 <h3>400+</h3>
//                 <p>Recover Patient</p>
//               </div>

//               <div className="stat-card">
//                 <h3>98%</h3>
//                 <p>Satisfied Rate</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default PatientHome;
