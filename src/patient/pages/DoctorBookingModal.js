import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/RescheduleAppointment.css";
import { toast } from "react-toastify";

const DoctorBookingModal = ({ doctor, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isWorkingDay, setIsWorkingDay] = useState(true);

  // ✅ CHECK PAST SLOT
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

  // ✅ FETCH SLOTS (same as reschedule)
  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctor?._id || !selectedDate) return;

      try {
        const formattedDate = selectedDate.toLocaleDateString("en-CA");

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/slots?doctorId=${doctor._id}&date=${formattedDate}`
        );

        const data = await res.json();

        setAllSlots(data.allSlots || []);
        setBookedSlots(data.bookedSlots || []);
        setAvailableSlots(data.availableSlots || []);
        setIsWorkingDay(data.isWorkingDay !== false);
      } catch (err) {
        console.error("Slot fetch error", err);
      }
    };

    fetchSlots();
  }, [doctor, selectedDate]);

  // ✅ BOOK HANDLER (simple)
const handleBook = async () => {
  if (!selectedDate || !selectedTime || !appointmentType) {
    toast.warning("Please select date, time and appointment type");
    return;
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");

console.log("👤 USER FROM STORAGE:", user);
console.log("👤 USER ID:", user?._id);
  try {
    setLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/appointment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },credentials: "include",
        body: JSON.stringify({
          doctor: doctor._id,
          patient: user?._id || user?.id,   // ✅ ALWAYS VALID
          date: selectedDate.toLocaleDateString("en-CA"),
          time: selectedTime,
          type: appointmentType,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    toast.success("Appointment booked successfully!");
    onClose();

  } catch (err) {
    console.error(err);
    toast.error(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="RescheduleApp-rs-overlay">
      <div className="RescheduleApp-rs-modal">

        {/* HEADER */}
        <div className="RescheduleApp-rs-header">
          <h2>Book Appointment</h2>
          <button className="RescheduleApp-rs-close" onClick={onClose}>×</button>
        </div>

        <div className="RescheduleApp-rs-body">

          {/* LEFT */}
          <div className="RescheduleApp-rs-left">
            <div className="RescheduleApp-rs-section">
              <label>1. Doctor</label>
              <div className="RescheduleApp-doctor-display">
                Dr. {doctor?.fullName} ({doctor?.specialization})
              </div>
            </div>

            <div className="RescheduleApp-rs-section">
              <label>2. Select Date</label>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date()}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="RescheduleApp-rs-right">

            {/* TYPE */}
            <div className="RescheduleApp-rs-section">
              <label>3. Appointment Type</label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
              >
                <option value="">Select Type</option>

                {doctor?.serviceType?.includes("physical") && (
                  <option value="physical">Physical Visit</option>
                )}

                {doctor?.serviceType?.includes("videocall") && (
                  <option value="videocall">Video Consultation</option>
                )}
              </select>
            </div>

            {/* SLOTS */}
            <div className="RescheduleApp-rs-section">
              <label>4. Select Time Slot</label>

              {selectedDate ? (
                !isWorkingDay ? (
                  <p>🚫 Doctor not available</p>
                ) : allSlots.length > 0 && availableSlots.length === 0 ? (
                  <p>❌ No slots available</p>
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
                          className={`RescheduleApp-rs-slot ${
                            isSelected ? "RescheduleApp-active" : ""
                          } ${isBooked ? "booked" : ""} ${
                            isPast ? "past" : ""
                          }`}
                          onClick={() =>
                            !isBooked && !isPast && setSelectedTime(time)
                          }
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )
              ) : (
                <p>Please select a date first</p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="RescheduleApp-rs-footer">
             <button
  className="RescheduleApp-rs-confirm"
  onClick={handleBook}
  disabled={loading}
>
  {loading ? "Booking..." : "Book Appointment"}
</button>

              <button
                className="RescheduleApp-rs-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorBookingModal;