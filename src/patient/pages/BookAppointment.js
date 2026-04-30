import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/BookAppointment.css';

const BookAppointment = ({ onClose }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate]     = useState(null);
  const [selectedTime, setSelectedTime]     = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [isBooked, setIsBooked]             = useState(false);
  const [doctors, setDoctors]               = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isWorkingDay, setIsWorkingDay] = useState(true);

  const selectedDoctorData = doctors.find(
    (doc) => doc._id === selectedDoctor
  );

  useEffect(() => {
    if (selectedDoctorData?.serviceType?.length > 0) {
      const firstService = selectedDoctorData.serviceType[0];

      setAppointmentType(
        firstService === "videocall" ? "videocall" : "physical"
      );
    }
  }, [selectedDoctorData]);

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

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const patientId = user._id || user.id || null;

      const formattedDate = selectedDate.toLocaleDateString("en-CA");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: selectedDoctor,
          patient: patientId,
          date: formattedDate,
          time: selectedTime,
          type: appointmentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setIsBooked(true);
      setTimeout(() => onClose(), 2500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isBooked) {
    return (
      <div className="BookApp-booking-success">
        <div className="BookApp-icon-check">✅</div>
        <h3>Booking Successful!</h3>
        <p>
          {selectedDate.toDateString()} at {selectedTime}
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
    <div className="BookApp-appointment-card">

      <div className="BookApp-appointment-header">
        <h2>Book Your Visit</h2>
        <button className="BookApp-close-modal" onClick={onClose}>&times;</button>
      </div>

      <div className="BookApp-appointment-grid">

        <div className="BookApp-calendar-container">
          <label className="BookApp-label-text">1. Select Doctor</label>

          <select
            className="BookApp-doctor-dropdown"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.fullName} ({doc.specialization})
              </option>
            ))}
          </select>

          <label className="BookApp-label-date">2. Select Date</label>

          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
              view="month"
            prev2Label={null}
            next2Label={null}
          />
        </div>

        <div className="BookApp-slots-container">

          <label className="BookApp-label-text">3. Appointment Type</label>

          <select
            className="BookApp-appointment-type-select"
            value={appointmentType}
              disabled={!selectedDoctor}
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
  {!selectedDoctor && "Please select doctor first"}

  {selectedDoctor && !appointmentType && "Please select appointment type"}

  {appointmentType === "physical" &&
    "📍 Visit doctor at clinic/hospital"}

  {appointmentType === "videocall" &&
    "🎥 Consult doctor via video call"}
</p>

          <label className="BookApp-label-text">4. Select Time Slot</label>

          {selectedDate ? (
            <div className="BookApp-slots-grid">
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
                    className={`BookApp-slot-pill 
                      ${isSelected ? "selected" : ""} 
                      ${isBooked ? "booked" : ""} 
                      ${isPast ? "past" : ""}`}
                    onClick={() => !isBooked && !isPast &&  toggleTimeSlot(time)}
                  >
                    {time}
                  </button>
                );
              })}
</div>
)}
            </div>
          ) : (
            <div className="BookApp-placeholder-text">
              Please select a date first
            </div>
          )}

          {error && <p className="BookApp-error">❌ {error}</p>}

          <div className="BookApp-button-group">

            <button
              className="BookApp-booking-submit-btn"
              disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
              onClick={handleBooking}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>

            <button className="BookApp-cancel-btn" onClick={onClose}>
              Cancel
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BookAppointment;