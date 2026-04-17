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
      setDoctors(data);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setDoctors([]);
    }
  };

  fetchDoctors();
}, []);
  const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];

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
        <p>{selectedDate.toDateString()} at {selectedTime}</p>
      </div>
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
  onChange={(e) => setSelectedDoctor(e.target.value)}
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
            onChange={(e) => setAppointmentType(e.target.value)}
          >
            <option value="physical">Physical (In Person - Clinic / Hospital Visit)</option>
            <option value="video">Video Call</option>
          </select>
          <p className="appointment-type-helper">
            {appointmentType === "physical"
              ? "📍 Visit doctor at clinic/hospital"
              : "🎥 Consult doctor via video call"}
          </p>

          <label className="label-text">4. Select Time Slot</label>

          {selectedDate ? (
            <div className="slots-grid">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`slot-pill ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => toggleTimeSlot(time)}
                >
                  {time}
                </button>
              ))}
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
