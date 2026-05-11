import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/RescheduleAppointment.css';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
          toast.error("Failed to load doctors");
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
          toast.error("Failed to load time slots");

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
      toast.error("Please select doctor, date and time");
    if (
    selectedDoctorData &&
    !selectedDoctorData.serviceType.includes(appointmentType)
  ) {
    const msg = "Selected doctor does not support this appointment type";
setError(msg);
toast.error(msg);
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
toast.success("Appointment rescheduled successfully");
      setTimeout(() => {
        navigate("/PatientAppointment");
      }, 2000);

    } catch (err) {
      setError(err.message);
        toast.error(err.message || "Reschedule failed");

    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (isBooked) {
    return (
      <div className="RescheduleApp-booking-success">
        <div className="RescheduleApp-icon-check">✅</div>
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

  // return (
  //   <div className="RescheduleApp-appointment-card">
  //     <div className="RescheduleApp-appointment-header">
  //       <h2>Reschedule Appointment</h2>
  //       <button className="RescheduleApp-close-modal" onClick={onClose}>&times;</button>
  //     </div>

  //     <div className="RescheduleApp-appointment-grid">

  //       {/* LEFT */}
  //       <div className="RescheduleApp-calendar-container">
  //         <label className="RescheduleApp-label-text">Doctor</label>

  //         {/* ✅ DOCTOR NAME ONLY */}
  //         <div className="RescheduleApp-doctor-display">
  //           {appointment?.doctorName} ({appointment?.specialization})
  //         </div>

  //         <label className="RescheduleApp-label-date">Select Date</label>
  //         <Calendar
  //           onChange={handleDateChange}
  //           value={selectedDate}
  //           minDate={new Date()}
  //           view="month"
  //           prev2Label={null}
  //           next2Label={null}
  //         />
  //       </div>

  //       {/* RIGHT */}
  //       <div className="RescheduleApp-slots-container">

  //         <label className="RescheduleApp-label-text">Appointment Type</label>
  //         <select
  //           className="RescheduleApp-appointment-type-select"
  //           value={appointmentType || ""}
  //           onChange={(e) => setAppointmentType(e.target.value)}
  //         >
  //           {selectedDoctorData?.serviceType?.includes("physical") && (
  //             <option value="physical">Physical (Clinic Visit)</option>
  //           )}
  //           {selectedDoctorData?.serviceType?.includes("videocall") && (
  //             <option value="videocall">Video Consultation</option>
  //           )}
  //         </select>

  //         <p className="RescheduleApp-appointment-type-helper">
  //           {appointmentType === "physical"
  //             ? "📍 Visit doctor at clinic"
  //             : "🎥 Video Consultation"}
  //         </p>

  //         <label className="RescheduleApp-label-text">Select Time Slot</label>

  //         {selectedDate ? (
  //           !isWorkingDay ? (
  //             <div className="RescheduleApp-no-slots">🚫 Doctor not available</div>
  //           ) : allSlots.length > 0 && availableSlots.length === 0 ? (
  //             <div className="RescheduleApp-no-slots">❌ No slots available</div>
  //           ) : (
  //             <div className="RescheduleApp-slots-grid">
  //               {allSlots.map((time) => {
  //                 const isBooked = bookedSlots.includes(time);
  //                 const isPast = isPastSlot(time);
  //                 const isSelected = selectedTime === time;

  //                 return (
  //                   <button
  //                     key={time}
  //                     disabled={isBooked || isPast}
  //                     className={`slot-pill 
  //                       ${isSelected ? "selected" : ""} 
  //                       ${isBooked ? "booked" : ""}
  //                       ${isPast ? "past" : ""}`}
  //                     onClick={() => !isBooked && !isPast && toggleTimeSlot(time)}
  //                   >
  //                     {time}
  //                   </button>
  //                 );
  //               })}
  //             </div>
  //           )
  //         ) : (
  //           <div className="RescheduleApp-placeholder-text">Select a date first</div>
  //         )}

  //         {error && <p className="RescheduleApp-booking-error">❌ {error}</p>}

  //         <div className="RescheduleApp-button-group">
  //           <button
  //             className="RescheduleApp-booking-submit-btn"
  //             disabled={!selectedDate || !selectedTime || loading}
  //             onClick={handleReschedule}
  //           >
  //             {loading ? "Updating..." : "Confirm Reschedule"}
  //           </button>

  //           <button className="RescheduleApp-cancel-btn" onClick={onClose}>
  //             Cancel
  //           </button>
  //         </div>

  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="RescheduleApp-rs-overlay">
      <div className="RescheduleApp-rs-modal">
        {/* HEADER */}
        <div className="RescheduleApp-rs-header">
          <h2>Reschedule Your Visit</h2>
          <button className="RescheduleApp-rs-close" onClick={onClose}>&times;</button>
        </div>

        <div className="RescheduleApp-rs-body">
          {/* LEFT SIDE: Doctor & Calendar */}
          <div className="RescheduleApp-rs-left">
            <div className="RescheduleApp-rs-section">
              <label>1. Doctor</label>
              <div className="RescheduleApp-doctor-display">
                {appointment?.doctorName} ({appointment?.specialization})
              </div>
            </div>

            <div className="RescheduleApp-rs-section">
              <label>2. Select Date</label>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                minDate={new Date()}
                view="month"
                prev2Label={null}
                next2Label={null}
              />
            </div>
          </div>

          {/* RIGHT SIDE: Type, Slots & Actions */}
          <div className="RescheduleApp-rs-right">
            <div className="RescheduleApp-rs-section">
              <label>3. Appointment Type</label>
              <select
                className="RescheduleApp-type-select"
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
            </div>

            <div className="RescheduleApp-rs-section">
              <label>4. Select Time Slot</label>
              {selectedDate ? (
                !isWorkingDay ? (
                  <p className="RescheduleApp-rs-hint">🚫 Doctor not available</p>
                ) : (
                  <div className="RescheduleApp-rs-slots">
                    {allSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      const isPast = isPastSlot(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          disabled={isBooked || isPast}
                          className={`RescheduleApp-rs-slot ${isSelected ? "RescheduleApp-active" : ""} ${isBooked ? "booked" : ""} ${isPast ? "past" : ""}`}
                          onClick={() => !isBooked && !isPast && toggleTimeSlot(time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                <p className="RescheduleApp-rs-hint">Please select a date first</p>
              )}
            </div>

            {error && <p className="RescheduleApp-error-msg">❌ {error}</p>}

            {/* ACTION BUTTONS (Inside Right Column to match Book Appointment UI) */}
            <div className="RescheduleApp-rs-footer">
              <button
                className="RescheduleApp-rs-confirm"
                disabled={!selectedDate || !selectedTime || loading}
                onClick={handleReschedule}
              >
                {loading ? "Updating..." : "Reschedule Appointment"}
              </button>
              <button className="RescheduleApp-rs-cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;