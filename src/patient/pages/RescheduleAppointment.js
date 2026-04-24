// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../css/RescheduleAppointment.css";

// export default function RescheduleAppointment() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const appointment = state?.appointment;

//   const [open, setOpen] = useState(true);
//   const [doctor, setDoctor] = useState(appointment?.doctor?._id || "");
//   const [date, setDate] = useState(appointment?.date || "");
//   const [time, setTime] = useState(appointment?.time || "");
//   const [type, setType] = useState(appointment?.type || "");

//   const closeModal = () => {
//     setOpen(false);
//     navigate(-1);
//   };

//   const handleReschedule = async () => {
//     if (!appointment?._id) {
//       alert("Invalid appointment");
//       return;
//     }

//     if (!doctor || !date || !time || !type) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/appointment/reschedule/${appointment._id}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ doctor, date, time, type }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       alert("Appointment rescheduled successfully");
//       navigate("/patient/appointments");
//     } catch (err) {
//       console.error(err);
//       alert(err.message);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="ba-overlay">
//       <div className="ba-modal">

//         {/* HEADER */}
//         <div className="ba-header">
//           <h2>Reschedule Your Visit</h2>
//           <button className="ba-close" onClick={closeModal}>×</button>
//         </div>

//         <div className="ba-body">

//           {/* LEFT SIDE */}
//           <div className="ba-left">

//             {/* 1. Doctor */}
//             <div className="ba-section">
//               <h4>1. Select Doctor</h4>
//               <select
//                 value={doctor}
//                 onChange={(e) => setDoctor(e.target.value)}
//               >
//                 <option value="">-- Choose Doctor --</option>
//                 <option value={appointment?.doctor?._id}>
//                   {appointment?.doctor?.name}
//                 </option>
//               </select>
//             </div>

//             {/* 2. Date */}
//             <div className="ba-section">
//               <h4>2. Select Date</h4>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="ba-right">

//             {/* 3. Type */}
//             <div className="ba-section">
//               <h4>3. Appointment Type</h4>
//               <select value={type} onChange={(e) => setType(e.target.value)}>
//                 <option value="">-- Select Type --</option>
//                 <option value="clinic">Clinic Visit</option>
//                 <option value="video">Video Consultation</option>
//               </select>

//               <p className="ba-note">📍 Visit doctor at clinic/hospital</p>
//             </div>

//             {/* 4. Time */}
//             <div className="ba-section">
//               <h4>4. Select Time Slot</h4>

//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="ba-footer">
//           <button className="ba-cancel" onClick={closeModal}>
//             Cancel
//           </button>

//           <button className="ba-confirm" onClick={handleReschedule}>
//             Confirm Reschedule
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState,useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// import "../css/RescheduleAppointment.css";

// export default function RescheduleAppointment({ appointment, onClose }) {


//   const [doctor, setDoctor] = useState(appointment?.doctor?._id || "");
//   const [date, setDate] = useState("");
//   const [type, setType] = useState("");
//   const [time, setTime] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState("");
// const [availableSlots, setAvailableSlots] = useState([]);
//   const closeModal = () => onClose(); 
//   // if (!appointment) {
//   //   return (
//   //     <div className="rs-overlay">
//   //       <div className="rs-modal">
//   //         <p>❌ No appointment data found</p>
//   //         <button onClick={() => navigate("/PatientAppointment")}>
//   //           Go Back
//   //         </button>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   useEffect(() => {
//   if (!doctor || !date) return;

//   const fetchSlots = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/appointment/slots?doctorId=${doctor}&date=${date}`,
//         { credentials: "include" }
//       );

//       const data = await res.json();

//       console.log("Slots API:", data);

//       setAvailableSlots(data.slots || []);
//     } catch (err) {
//       console.error("Failed to fetch slots:", err);
//       setAvailableSlots([]);
//     }
//   };

//   fetchSlots();
// }, [doctor, date]);

//   const handleReschedule = async () => {
//     if (!appointment?.id) return alert("Invalid appointment");

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/appointment/${appointment.id}/reschedule`,       
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },  credentials: "include", 
//         body: JSON.stringify({ doctor, date, time, type }),
//       }
//       );

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed");

//       alert("Appointment Rescheduled Successfully");
//       // navigate("/PatientAppointment");
//       onClose();
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="rs-overlay">
//       <div className="rs-modal">

//         {/* HEADER */}
//         <div className="rs-header">
//           <h2>Reschedule Your Visit</h2>
//           <button className="rs-close" onClick={closeModal}>×</button>
//         </div>

//         <div className="rs-body">

//           {/* LEFT SIDE */}
//           <div className="rs-left">

//             {/* 1 DOCTOR */}
//             <div className="rs-section">
//               <div className="doctor-info">
//                 {appointment?.doctorName} ({appointment?.specialization})
//               </div>
//             </div>

//             {/* 2 DATE */}
//             <div className="rs-section">
//               <label>2. Select Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>

//           </div>

//           {/* RIGHT SIDE */}
//           <div className="rs-right">

//             {/* 3 TYPE */}
//             <div className="rs-section">
//               <label>3. Appointment Type</label>
//               <select value={type} onChange={(e) => setType(e.target.value)}>
//                 <option value="">Select Type</option>
//                 <option value="clinic">Visit doctor at clinic/hospital</option>
//                 <option value="online">Online Consultation</option>
//               </select>
//             </div>

//             {/* 4 TIME */}
//            <div className="rs-section">
//   <label>4. Select Time Slot</label>

//   {date ? (
//     availableSlots.length > 0 ? (
//       <div className="rs-slots">
//         {availableSlots.map((slot, index) => (
//           <button
//             key={index}
//             className={`rs-slot ${
//               selectedSlot === slot ? "active" : ""
//             }`}
//             onClick={() => {
//               setSelectedSlot(slot);
//               setTime(slot);
//             }}
//           >
//             {slot}
//           </button>
//         ))}
//       </div>
//     ) : (
//       <p className="rs-hint">No slots available</p>
//     )
//   ) : (
//     <p className="rs-hint">Please select a date first</p>
//   )}
// </div>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="rs-footer">
//           <button className="rs-confirm" onClick={handleReschedule} disabled={loading}>
//             {loading ? "Rescheduling..." : "Reschedule Appointment"}
//           </button>

//           <button className="rs-cancel" onClick={closeModal}>
//             Cancel
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/RescheduleAppointment.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";

const RescheduleAppointment = ({ onClose, appointment }) => {
  const { state } = useLocation(); // 👈 appointment data
  // const { id } = useParams();      // 👈 appointment id
  const navigate = useNavigate();
  const id = appointment?.id || appointment?._id;

  // ✅ PRE-FILLED DATA
  const [selectedDoctor, setSelectedDoctor] = useState(appointment?.doctorId || "");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
const [appointmentType, setAppointmentType] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isWorkingDay, setIsWorkingDay] = useState(true);

  const selectedDoctorData = doctors.find(
    (doc) => doc._id === selectedDoctor
  );

  // 🔥 SAME FUNCTION
  const isPastSlot = (slotTime) => {
    if (!selectedDate) return false;

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (!isToday) return false;

    const [time, modifier] = slotTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(hours, minutes, 0, 0);

    return slotDateTime < now;
  };

  // ── FETCH DOCTORS ──
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/doctor/names`
        );
        const data = await res.json();

        const filteredDoctors = data.filter(doc =>
          doc.fullName && doc.specialization
        );

        setDoctors(filteredDoctors);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

 useEffect(() => {
  if (appointment?.type) {
    setAppointmentType(appointment.type);
  }
}, [appointment]);

useEffect(() => {
  if (selectedDoctorData?.serviceType?.length > 0 && appointmentType) {
    if (!selectedDoctorData.serviceType.includes(appointmentType)) {
      setAppointmentType(selectedDoctorData.serviceType[0]);
    }
  }
}, [selectedDoctorData]);

  // ── FETCH SLOTS (UNCHANGED) ──
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !selectedDate) return;

      try {
        const formattedDate = selectedDate.toLocaleDateString("en-CA");

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/slots?doctorId=${selectedDoctor}&date=${formattedDate}`
        );

        const data = await res.json();

        setAllSlots(data.allSlots || []);
        setBookedSlots(data.bookedSlots || []);
        setAvailableSlots(data.availableSlots || []);
        setIsWorkingDay(data.isWorkingDay !== false);

      } catch (err) {
        console.error("Failed to fetch slots:", err);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const toggleTimeSlot = (time) => {
    setSelectedTime(prev => prev === time ? null : time);
  };

  // 🔥 RESCHEDULE API
  const handleReschedule = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    if (
    selectedDoctorData &&
    !selectedDoctorData.serviceType.includes(appointmentType)
  ) {
    setError("Selected doctor does not support this appointment type");
    return;
  }

    setLoading(true);
    setError("");

    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${id}/reschedule`,
        {
          method: "PUT", // 👈 IMPORTANT
          headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({
            date: formattedDate,
            time: selectedTime,
            type: appointmentType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reschedule failed");
      }

      setIsBooked(true);

      setTimeout(() => {
        navigate("/PatientAppointment");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (isBooked) {
    return (
      <div className="booking-success">
        <div className="icon-check">✅</div>
        <h3>Appointment Rescheduled!</h3>
        <p>
          {selectedDate?.toDateString()} at {selectedTime} <br />
          <strong>
            {appointmentType === "physical"
              ? "📍 Physical Visit"
              : "🎥 Video Consultation"}
          </strong>
        </p>
      </div>
    );
  }

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <h2>Reschedule Appointment</h2>
        <button className="close-modal" onClick={onClose}>&times;</button>
      </div>

      <div className="appointment-grid">

        {/* LEFT */}
        <div className="calendar-container">
          <label className="label-text">Doctor</label>

          {/* ✅ DOCTOR NAME ONLY */}
          <div className="doctor-display">
            {appointment?.doctorName} ({appointment?.specialization})
          </div>

          <label className="label-date">Select Date</label>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            view="month"
            prev2Label={null}
            next2Label={null}
          />
        </div>

        {/* RIGHT */}
        <div className="slots-container">

          <label className="label-text">Appointment Type</label>
          <select
            className="appointment-type-select"
            value={appointmentType || ""}
            onChange={(e) => setAppointmentType(e.target.value)}
          >
            {selectedDoctorData?.serviceType?.includes("physical") && (
              <option value="physical">Physical (Clinic Visit)</option>
            )}
            {selectedDoctorData?.serviceType?.includes("videocall") && (
              <option value="videocall">Video Consultation</option>
            )}
          </select>

          <p className="appointment-type-helper">
            {appointmentType === "physical"
              ? "📍 Visit doctor at clinic"
              : "🎥 Video Consultation"}
          </p>

          <label className="label-text">Select Time Slot</label>

          {selectedDate ? (
            !isWorkingDay ? (
              <div className="no-slots">🚫 Doctor not available</div>
            ) : allSlots.length > 0 && availableSlots.length === 0 ? (
              <div className="no-slots">❌ No slots available</div>
            ) : (
              <div className="slots-grid">
                {allSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  const isPast = isPastSlot(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      disabled={isBooked || isPast}
                      className={`slot-pill 
                        ${isSelected ? "selected" : ""} 
                        ${isBooked ? "booked" : ""}
                        ${isPast ? "past" : ""}`}
                      onClick={() => !isBooked && !isPast && toggleTimeSlot(time)}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="placeholder-text">Select a date first</div>
          )}

          {error && <p className="booking-error">❌ {error}</p>}

          <div className="button-group">
            <button
              className="booking-submit-btn"
              disabled={!selectedDate || !selectedTime || loading}
              onClick={handleReschedule}
            >
              {loading ? "Updating..." : "Confirm Reschedule"}
            </button>

            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;