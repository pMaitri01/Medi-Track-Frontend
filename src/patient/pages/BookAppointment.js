// import React, { useState } from 'react';
// import '../css/BookAppointment.css';

// const doctors = [
//   { id: 1, name: 'Dr. Sarah Williams', specialty: 'Neurologist', img: 'https://via.placeholder.com/40' },
//   { id: 2, name: 'Dr. John Smith', specialty: 'Cardiologist', img: 'https://via.placeholder.com/40' },
//   { id: 3, name: 'Dr. Emily Brown', specialty: 'Dermatologist', img: 'https://via.placeholder.com/40' },
//   { id: 4, name: 'Dr. Michael Lee', specialty: 'Orthopedic', img: 'https://via.placeholder.com/40' },
//   { id: 5, name: 'Dr. Sophia Davis', specialty: 'Pediatrician', img: 'https://via.placeholder.com/40' },
// ];

// const timeSlots = ['9:00 AM', '10:30 AM', '2:00 PM'];

// const BookAppointment = () => {
//   const [selectedDoc, setSelectedDoc] = useState(1);
//   const [selectedTime, setSelectedTime] = useState('10:30 AM');
//   const [selectedDate, setSelectedDate] = useState(24);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Book an Appointment</h2>
//           <button className="close-btn">&times;</button>
//         </div>

//         <div className="modal-body">
//           {/* Left Column */}
//           <div className="column left-col">
//             <label className="section-label">Choose Doctor:</label>
//             <div className="doctor-list">
//               {doctors.map((doc) => (
//                 <div 
//                   key={doc.id} 
//                   className={`doctor-card ${selectedDoc === doc.id ? 'active' : ''}`}
//                   onClick={() => setSelectedDoc(doc.id)}
//                 >
//                   <img src={doc.img} alt={doc.name} className="doc-avatar" />
//                   <div className="doc-info">
//                     <span className="doc-name">{doc.name}</span>
//                     <span className="doc-specialty">{doc.specialty}</span>
//                   </div>
//                   {doc.id === 1 && <span className="dropdown-arrow">▼</span>}
//                 </div>
//               ))}
//             </div>

//             <div className="calendar-container">
//               <div className="calendar-header">
//                 <span>&lt;</span>
//                 <strong>April 2024</strong>
//                 <span>&gt;</span>
//               </div>
//               <div className="calendar-grid">
//                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="day-name">{d}</div>)}
//                 {[26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 14, 15, 16].map((date, i) => (
//                   <div 
//                     key={i} 
//                     className={`date-cell ${date === 24 ? 'selected' : ''} ${i < 5 ? 'prev-month' : ''}`}
//                   >
//                     {date}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="column right-col">
//             <label className="section-label">Select Time:</label>
//             <p className="available-text">Available Time for <strong>Apr 24, 2024</strong></p>
            
//             <div className="time-grid">
//               {timeSlots.map(time => (
//                 <button 
//                   key={time} 
//                   className={`time-slot ${selectedTime === time ? 'active' : ''}`}
//                   onClick={() => setSelectedTime(time)}
//                 >
//                   {time}
//                 </button>
//               ))}
//             </div>

//             <div className="secondary-time-box">
//                <div className="box-header">
//                  <span className="calendar-icon">📅</span>
//                  <span>Available Time for Apr 24, 2024</span>
//                </div>
//                <div className="inner-time-grid">
//                   {timeSlots.map(time => <div key={time} className="time-pill">{time}</div>)}
//                   <div className="time-pill">2:00 PM</div>
//                </div>
//             </div>
//           </div>
//         </div>

//         <div className="modal-footer">
//           <button className="confirm-btn">Confirm Appointment</button>
//           <button className="cancel-btn">Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;


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