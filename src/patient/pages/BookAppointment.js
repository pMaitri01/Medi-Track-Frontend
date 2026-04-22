import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/BookAppointment.css';

const BookAppointment = ({ onClose }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate]     = useState(null);
  const [selectedTime, setSelectedTime]     = useState(null);
  const [appointmentType, setAppointmentType] = useState("physical");
  const [isBooked, setIsBooked]             = useState(false);
  const [doctors, setDoctors]               = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [allSlots, setAllSlots] = useState([]);
const [bookedSlots, setBookedSlots] = useState([]);
const [availableSlots, setAvailableSlots] = useState([]);
const [isWorkingDay, setIsWorkingDay] = useState(true);

// const [isWorkingDay, setIsWorkingDay] = useState(true);
const selectedDoctorData = doctors.find(
  (doc) => doc._id === selectedDoctor
);

// 🔥 ADD THIS FUNCTION HERE (IMPORTANT)
const isPastSlot = (slotTime) => {
  if (!selectedDate) return false;

  const now = new Date();

  const isToday =
    selectedDate.toDateString() === now.toDateString();

  if (!isToday) return false;

  const [time, modifier] = slotTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const slotDateTime = new Date(selectedDate);
  slotDateTime.setHours(hours, minutes, 0, 0);

  return slotDateTime < now;
};

  // ── Fetch available doctors on mount ──
//   useEffect(() => {
//   fetch(`${process.env.REACT_APP_API_URL}/api/doctor/names`)
//     .then(res => res.json())
//     .then(data => {
//       console.log("Raw Doctor Data:", data);

//       // ✅ SAFER FILTER
//      const approvedDoctors = data.filter(doc => {
//   const status = (doc.status || doc.approvalStatus || "").toLowerCase().trim();

//   return (
//     status === "approved" ||
//     doc.isApproved === true
//   );
// });

//       console.log("Approved Doctors:", approvedDoctors);

//       setDoctors(approvedDoctors);
//     })
//     .catch(err => console.error("Failed to load doctors:", err));
// }, []);
useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/doctor/names`
      );

      const data = await res.json();

      console.log("Approved Doctors:", data);

      // ✅ no need for filtering anymore (backend already filters)
      const filteredDoctors = data.filter(doc =>
  doc.fullName &&
  doc.specialization
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
  const fetchSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/slots?doctorId=${selectedDoctor}&date=${formattedDate}`
      );

      const data = await res.json();

      console.log("Slots API:", data);

     
      setAllSlots(data.allSlots || []);
setBookedSlots(data.bookedSlots || []);
setAvailableSlots(data.availableSlots || []);
setIsWorkingDay(data.isWorkingDay !== false); // default true

    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  };

  fetchSlots();
}, [selectedDoctor, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // reset time when date changes
  };

  const toggleTimeSlot = (time) => {
    setSelectedTime(prev => prev === time ? null : time);
  };

  // ── Send appointment to backend API ──
  // POST /api/appointments → { doctor, patientId, patientName, date, time }
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError("");

    try {
      // Get logged-in patient from localStorage
      const user        = JSON.parse(localStorage.getItem("user") || "{}");
      const patientId   = user._id  || user.id       || null;

      // ✅ Fix timezone bug: toISOString() shifts to UTC and can roll back one day
      // toLocaleDateString("en-CA") returns YYYY-MM-DD in the user's local timezone
      const formattedDate = selectedDate.toLocaleDateString("en-CA");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor:      selectedDoctor,  // doctor _id
          patient:   patientId,       // ✅ patient _id for DB reference
          date:        formattedDate,   // ✅ correct local date YYYY-MM-DD
          time:        selectedTime,
          type:        appointmentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      setIsBooked(true);
      setTimeout(() => onClose(), 2500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (isBooked) {
    return (
      <div className="booking-success">
        <div className="icon-check">✅</div>
        <h3>Booking Successful!</h3>
<p>
  {selectedDate.toDateString()} at {selectedTime} <br />
  <strong>
    {appointmentType === "physical"
      ? "📍 Physical Visit"
      : "🎥 Video Consultation"}
  </strong>
</p>      </div>
    );
  }

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <h2>Book Your Visit</h2>
        <button className="close-modal" onClick={onClose}>&times;</button>
      </div>

      <div className="appointment-grid">

        {/* Left: Doctor + Calendar */}
        <div className="calendar-container">
          <label className="label-text">1. Select Doctor</label>
          <select
  className="doctor-dropdown"
  value={selectedDoctor}
  onChange={(e) => {
  setSelectedDoctor(e.target.value);
  setAppointmentType(""); // reset when doctor changes
}}
>
  <option value="">-- Choose Doctor --</option>

  {doctors.map((doc) => (
    // <option key={doc._id} value={doc._id}>
    //   {doc.fullName} ({doc.specialization})
    // </option>
    <option key={doc._id} value={doc._id}>
  Dr. {doc.fullName} ({doc.specialization})
</option>
  ))}
</select>

          <label className="label-date">2. Select Date</label>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            view="month"
            prev2Label={null}
            next2Label={null}
          />
        </div>

        {/* Right: Time Slots */}
        <div className="slots-container">
          <label className="label-text">3. Appointment Type</label>
          <select
  className="appointment-type-select"
  value={appointmentType}
  disabled={!selectedDoctor}
  onChange={(e) => setAppointmentType(e.target.value)}
>
  {selectedDoctorData?.serviceType?.includes("physical") && (
    <option value="physical">Physical (Clinic Visit)</option>
  )}

  {selectedDoctorData?.serviceType?.includes("videocall") && (
    <option value="video">Video Consultation</option>
  )}
</select>
          <p className="appointment-type-helper">
            {appointmentType === "physical"
              ? "📍 Visit doctor at clinic/hospital"
              : "🎥 Consult doctor via video call"}
          </p>

          <label className="label-text">4. Select Time Slot</label>

          {selectedDate ? (
            <div className="slots-grid">
              {/* {allSlots.map((time) => {
  const isBooked = bookedSlots.includes(time);
  const isSelected = selectedTime === time;

  return (
    <button
      key={time}
      disabled={isBooked}
      className={`slot-pill 
        ${isSelected ? "selected" : ""} 
        ${isBooked ? "booked" : ""}`}
      onClick={() => !isBooked && toggleTimeSlot(time)}
    >
      {time}
    </button>
  );
})} */}
{!isWorkingDay ? (
  <div className="no-slots">
    🚫 Doctor not available
  </div>
) : allSlots.length > 0 && availableSlots.length === 0 ? (
  <div className="no-slots">
    ❌ No slots available, try another day
  </div>
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
)}
            </div>
          ) : (
            <div className="placeholder-text">Please select a date first</div>
          )}

          {/* Error message */}
          {error && (
            <p className="booking-error">❌ {error}</p>
          )}

          <div className="button-group">
            <button
              className="booking-submit-btn"
              disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
              onClick={handleBooking}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
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

export default BookAppointment;
