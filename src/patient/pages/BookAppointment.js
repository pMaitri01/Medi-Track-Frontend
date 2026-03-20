import React, { useState } from 'react';
import '../css/BookAppointment.css';

const doctors = [
  { id: 1, name: 'Dr. Sarah Williams', specialty: 'Neurologist' },
  { id: 2, name: 'Dr. John Smith', specialty: 'Cardiologist' },
  { id: 3, name: 'Dr. Emily Brown', specialty: 'Dermatologist' },
  { id: 4, name: 'Dr. Michael Lee', specialty: 'Orthopedic' },
  { id: 5, name: 'Dr. Sophia Davis', specialty: 'Pediatrician' },
];

const BookAppointment = () => {
  const [selectedDoc, setSelectedDoc] = useState(1);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Simplified calendar data based on the image provided
  const dates = [
    { day: 26, current: false }, { day: 27, current: false }, { day: 28, current: false },
    { day: 29, current: false }, { day: 30, current: false }, { day: 1, current: true },
    { day: 2, current: true }, { day: 3, current: true }, { day: 4, current: true },
    { day: 5, current: true }, { day: 6, current: true }, { day: 7, current: true },
    { day: 8, current: true }, { day: 9, current: true }, { day: 10, current: true },
    { day: 11, current: true }, { day: 12, current: true }, { day: 24, current: true, selected: true },
    { day: 14, current: true }, { day: 15, current: true }, { day: 16, current: true }
  ];

  return (
    <div className="appointment-wrapper">
      <div className="appointment-card">
        <div className="header">
          <h2>Book an Appointment</h2>
          <span className="close-icon">×</span>
        </div>

        <div className="main-content">
          {/* Left Section */}
          <div className="content-left">
            <div className="form-group">
              <label>Choose Doctor:</label>
              <div className="select-wrapper">
                <select 
                  value={selectedDoc} 
                  onChange={(e) => setSelectedDoc(e.target.value)}
                  className="doctor-select"
                >
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="calendar-box">
              <div className="calendar-nav">
                <span className="nav-arrow">‹</span>
                <span className="month-year">April 2024 ▾</span>
                <span className="nav-arrow">›</span>
              </div>
              <div className="calendar-grid">
                {days.map(d => <div key={d} className="weekday">{d}</div>)}
                {dates.map((d, i) => (
                  <div 
                    key={i} 
                    className={`date-cell ${!d.current ? 'prev-month' : ''} ${d.selected ? 'active-date' : ''}`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="content-right">
            <label>Select Time:</label>
            <p className="availability-label">Available Time for <strong>Apr 24, 2024</strong></p>
            
            <div className="time-options">
              {['9:00 AM', '10:30 AM', '2:00 PM'].map(time => (
                <button 
                  key={time} 
                  className={`time-btn ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="dashed-info-box">
              <div className="info-header">
                <span className="icon">📅</span>
                <span>Available Time for Apr 24, 2024</span>
              </div>
              <div className="pill-grid">
                <span className="pill">9:00 AM</span>
                <span className="pill">10:30 AM</span>
                <span className="pill">2:00 PM</span>
                <span className="pill">2:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-actions">
          <button className="btn-confirm">Confirm Appointment</button>
          <button className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;