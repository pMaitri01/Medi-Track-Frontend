// import React, { useState } from 'react';
// import '../css/PatientHome.css';
// import doctorProfile from '../images/profile.png';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Navbar from '../components/Navbar';
// import BookAppointment from './BookAppointment';

// const PatientHome = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
  
//   // State for reviews list
//   const [reviews, setReviews] = useState([
//     { name: "Amy T", date: "May 01", text: "Sarah Williams was very patient and thorough during visit my visit.", stars: 4 },
//     { name: "Robert L", date: "April 26", text: "Dr. Choi was great! Explained everything clearly.", stars: 4 }
//   ]);

//   // State for new review input
//   const [newReviewText, setNewReviewText] = useState("");
//   const [rating, setRating] = useState(5);
//   // Sate For Appointment Booking 
//   const [isBookingOpen, setIsBookingOpen] = useState(false);

//   const handlePostReview = (e) => {
//     e.preventDefault();
//     if (!newReviewText.trim()) return;

//     const newEntry = {
//       name: "John (You)",
//       date: new Date().toLocaleDateString('en-US', { month: 'short', day: '02' }),
//       text: newReviewText,
//       stars: rating
//     };

//     setReviews([newEntry, ...reviews]);
//     setNewReviewText("");
//   };

//   return (
//     <>
//     <Navbar/>
//     <div className="patient-home-wrapper">
//       <div className="dashboard-grid">
//         <div className="left-column">
//           <section className="card card-white">
//             <h2 className="card-heading">Upcoming Appointment</h2>
//             <div className="appointment-body">
//               {/* <div className="dr-avatar-large">
//                 <img 
//                 src="{doctorProfile}" 
//                 className="dr-avatar-img"
//                 />
//               </div>                */}

//               <div className="profile-image-wrapper">
//                 <img 
//                   src={doctorProfile} 
//                   className="profile-image"
//                   alt="Profile"
//                 />
//               </div>
//               <div className="appointment-details">
//                 <div className="dr-header-row">
//                   <div>
//                     <h3 className="dr-name">Dr. Sarah Williams</h3>
//                     <p className="appt-time">May 10, 2024 at 10:00 AM</p>
//                     <p className="dr-specialty">Dr. General Practice</p>
//                   </div>
//                   <span className="medical-data-tag">MedicalData</span>
//                 </div>
//                 <div className="action-buttons">
//                   <button className="reviewbtn">Orphastics</button>
//                   <button className="reviewbtn">Reschedule</button>
//                   <button className="reviewbtn">Cancel</button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <div className="quick-actions-grid">
//               {/* 2. Trigger Logic - MUST MATCH THE STATE SETTER ABOVE */}
//               <div className="action-card" onClick={() => setIsBookingOpen(true)} style={{ cursor: 'pointer' }}>
//                 <div className="icon-circle icon-cyan">📅</div>
//                 <span>Book Appointment</span>
//               </div>
//               <div className="action-card"><div className="icon-circle icon-orange">📄</div><span>Upload Records</span></div>
//               <div className="action-card"><div className="icon-circle icon-red">💊</div><span>Prescriptions</span></div>
//               <div className="action-card"><div className="icon-circle icon-blue">📋</div><span>Lab Results</span></div>
//             </div>

//           {/* INTERACTIVE REVIEW SECTION */}
//           <section className="card card-blue-solid">
//             <h2 className="card-heading white-text">Patient Reviews</h2>
            
//             <form className="review-form" onSubmit={handlePostReview}>
//               <textarea 
//                 className="review-input" 
//                 placeholder="Share your experience..."
//                 value={newReviewText}
//                 onChange={(e) => setNewReviewText(e.target.value)}
//               />
//               <div className="review-form-footer">
//                 <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rating-picker">
//                   <option value="5">5 Stars</option>
//                   <option value="4">4 Stars</option>
//                   <option value="3">3 Stars</option>
//                   <option value="3">2 Stars</option>
//                   <option value="3">1 Stars</option>
//                 </select>
//                 <button type="submit" className="reviewbtn1">Post Review</button>
//               </div>
//             </form>

//             <div className="reviews-list">
//               {reviews.map((rev, i) => (
//                 <div className="review-item" key={i}>
//                   <p>"{rev.text}"</p>
//                   <div className="review-meta">
//                     <span>{rev.date}. {rev.name}</span>
//                     <span className="stars">{"⭐".repeat(rev.stars)}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         <div className="right-column">
//           <section className="card card-white">
//               <div className="search-header-flex">
//                 <h2 className="card-heading">Find a Doctor</h2>
//               </div>

//                   <form className="search-filters-grid">
//                     {/* Row 1: Name & Location */}
//                     <div className="filter-group">
//                       <label>Doctor Name</label>
//                       <div className="input-with-icon">
//                         <i className="fa-solid fa-magnifying-glass"></i>
//                         <input type="text" placeholder="e.g. Dr. Sarah" className="filter-input" />
//                       </div>
//                     </div>

//                     <div className="filter-group">
//                       <label>Location</label>
//                       <div className="input-with-icon">
//                         <i className="fa-solid fa-location-dot"></i>
//                         <input type="text" placeholder="City or Zip" className="filter-input" />
//                       </div>
//                     </div>

//                     {/* Row 2: Specialization & Day Type */}
//                     <div className="filter-group">
//                       <label>Specialization</label>
//                       <select className="filter-input">
//                         <option>All Specializations</option>
//                         <option>General Practice</option>
//                         <option>Cardiology</option>
//                       </select>
//                     </div>

//                     <div className="filter-group">
//                       <label>Availability</label>
//                       <select className="filter-input">
//                         <option>Any Day</option>
//                         <option>Weekdays</option>
//                         <option>Weekends</option>
//                       </select>
//                     </div>

//                     {/* Row 3: Time Slot & Submit */}
//                     <div className="filter-group">
//                       <label>Time Slot</label>
//                       <select className="filter-input">
//                         <option>Any Time</option>
//                         <option>Morning (8AM - 12PM)</option>
//                         <option>Afternoon (12PM - 5PM)</option>
//                         <option>Evening (5PM - 9PM)</option>
//                       </select>
//                     </div>

//                     <div className="filter-group submit-group">
//                       <button type="submit" className="btn-search-apply">
//                         <i className="fa-solid fa-sliders"></i> Apply Filters
//                       </button>
//                     </div>
//                   </form>

//                   {/* Results Area - This container "extends" as doctors are found */}
//                   <div className="filtered-results-container">
//                     {/* Doctor Cards will go here */}
//                     <div className="no-results-hint">
//                         Adjust filters to see available doctors
//                     </div>
//                   </div>
//             </section>
//           <section className="card card-white ai-chatbot-container">
//   <div className="ai-text-center">
//     <h2 className="ai-title">
//       <i className="fa-solid fa-robot" style={{ marginRight: '10px', color: '#2563eb' }}></i>
//       Ask Medi-Track AI
//     </h2>
//     <p className="ai-subtitle">Instant symptom analysis & suggestions</p>
//   </div>

//   <div className="chat-window">
//     <div className="chat-messages-scroll">
//       {/* Bot Message */}
//       <div className="message-row bot-row">
//         <div className="bot-icon-bg">
//           <i className="fa-solid fa-robot"></i>
//         </div>
//         <div className="message-bubble bot-bubble">
//           Hello John! I'm your AI health assistant. Describe how you're feeling, and I'll suggest the right type of doctor for you.
//         </div>
//       </div>

//       {/* User Message */}
//       <div className="message-row user-row">
//         <div className="message-bubble user-bubble">
//           I've had a persistent headache for two days and feel a bit dizzy.
//         </div>
//       </div>

//       {/* Bot Response Example */}
//       <div className="message-row bot-row">
//         <div className="bot-icon-bg">
//           <i className="fa-solid fa-robot"></i>
//         </div>
//         <div className="message-bubble bot-bubble">
//           I understand. Based on those symptoms, you might want to consult a <strong>General Practitioner</strong> or a <strong>Neurologist</strong>. Would you like to see available doctors in those fields?
//         </div>
//       </div>
//     </div>

//     {/* Input Area */}
//     <div className="chat-input-container">
//       <input 
//         type="text" 
//         placeholder="Type your symptoms here..." 
//         className="chat-input-field" 
//       />
//       <button className="chat-submit-btn">
//         <i className="fa-solid fa-paper-plane"></i>
//       </button>
//     </div>
//   </div>
// </section>
//         </div>
//       </div>
//     </div>
//   </>  
//   );
// };

// export default PatientHome;



// import React, { useState } from 'react';
// import '../css/PatientHome.css';
// import doctorProfile from '../images/profile.png';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import Navbar from '../components/Navbar';
// import BookAppointment from './BookAppointment';

// const PatientHome = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
  
//   const [reviews, setReviews] = useState([
//     { name: "Amy T", date: "May 01", text: "Sarah Williams was very patient and thorough during visit my visit.", stars: 4 },
//     { name: "Robert L", date: "April 26", text: "Dr. Choi was great! Explained everything clearly.", stars: 4 }
//   ]);

//   const [newReviewText, setNewReviewText] = useState("");
//   const [rating, setRating] = useState(5);
//   // State For Appointment Booking 
//   const [isBookingOpen, setIsBookingOpen] = useState(false);
  
//   const handlePostReview = (e) => {
//     e.preventDefault();
//     if (!newReviewText.trim()) return;

//     const newEntry = {
//       name: "John (You)",
//       date: new Date().toLocaleDateString('en-US', { month: 'short', day: '02' }),
//       text: newReviewText,
//       stars: rating
//     };

//     setReviews([newEntry, ...reviews]);
//     setNewReviewText("");
//   };

//   return (
//     <>
//       <Navbar/>

//       {/* FIXED: Added the Overlay Logic here */}
//       {isBookingOpen && (
//         <div className="booking-modal-overlay">
//           <div className="booking-modal-content">
//             {/* Pass the close function so the card can close itself */}
//             <BookAppointment onClose={() => setIsBookingOpen(false)} />
//           </div>
//         </div>
//       )}

//       <div className={`patient-home-wrapper ${isBookingOpen ? 'prevent-scroll' : ''}`}>
//         <div className="dashboard-grid">
//           <div className="left-column">
//             <section className="card card-white">
//               <h2 className="card-heading">Upcoming Appointment</h2>
//               <div className="appointment-body">
//                 <div className="profile-image-wrapper">
//                   <img 
//                     src={doctorProfile} 
//                     className="profile-image"
//                     alt="Profile"
//                   />
//                 </div>
//                 <div className="appointment-details">
//                   <div className="dr-header-row">
//                     <div>
//                       <h3 className="dr-name">Dr. Sarah Williams</h3>
//                       <p className="appt-time">May 10, 2024 at 10:00 AM</p>
//                       <p className="dr-specialty">Dr. General Practice</p>
//                     </div>
//                     <span className="medical-data-tag">MedicalData</span>
//                   </div>
//                   <div className="action-buttons">
//                     <button className="reviewbtn">Orphastics</button>
//                     <button className="reviewbtn">Reschedule</button>
//                     <button className="reviewbtn">Cancel</button>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             <div className="quick-actions-grid">
//               <div className="action-card" onClick={() => setIsBookingOpen(true)} style={{ cursor: 'pointer' }}>
//                 <div className="icon-circle icon-cyan">📅</div>
//                 <span>Book Appointment</span>
//               </div>
//               <div className="action-card"><div className="icon-circle icon-orange">📄</div><span>Upload Records</span></div>
//               <div className="action-card"><div className="icon-circle icon-red">💊</div><span>Prescriptions</span></div>
//               <div className="action-card"><div className="icon-circle icon-blue">📋</div><span>Lab Results</span></div>
//             </div>

//             {/* REVIEWS SECTION */}
//             <section className="card card-blue-solid">
//               <h2 className="card-heading white-text">Patient Reviews</h2>
//               <form className="review-form" onSubmit={handlePostReview}>
//                 <textarea 
//                   className="review-input" 
//                   placeholder="Share your experience..."
//                   value={newReviewText}
//                   onChange={(e) => setNewReviewText(e.target.value)}
//                 />
//                 <div className="review-form-footer">
//                   <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rating-picker">
//                     <option value="5">5 Stars</option>
//                     <option value="4">4 Stars</option>
//                     <option value="3">3 Stars</option>
//                   </select>
//                   <button type="submit" className="reviewbtn1">Post Review</button>
//                 </div>
//               </form>
//               {/* ... (rest of reviews list) */}
//             </section>
//           </div>

//           <div className="right-column">
//             {/* Find Doctor and AI sections... */}
//             <section className="card card-white">
//                 <h2 className="card-heading">Find a Doctor</h2>
//                 <div className="no-results-hint">Adjust filters to see available doctors</div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </>   
//   );
// };

// export default PatientHome;


import React, { useState } from 'react';
import '../css/PatientHome.css';
import doctorProfile from '../images/profile.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '../components/Navbar';
import BookAppointment from './BookAppointment';

const PatientHome = () => {
  const [reviews, setReviews] = useState([
    { name: "Amy T", date: "May 01", text: "Sarah Williams was very patient and thorough during visit my visit.", stars: 4 },
    { name: "Robert L", date: "April 26", text: "Dr. Choi was great! Explained everything clearly.", stars: 4 }
  ]);

  const [newReviewText, setNewReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newEntry = {
      name: "John (You)",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '02' }),
      text: newReviewText,
      stars: rating
    };
    setReviews([newEntry, ...reviews]);
    setNewReviewText("");
  };

  return (
    <>
      <Navbar />

      {/* MODAL OVERLAY - This is what opens when you click Book Appointment */}
      {isBookingOpen && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content">
            <BookAppointment onClose={() => setIsBookingOpen(false)} />
          </div>
        </div>
      )}

      <div className={`patient-home-wrapper ${isBookingOpen ? 'prevent-scroll' : ''}`}>
        <div className="dashboard-grid">
          
          {/* LEFT COLUMN */}
          <div className="left-column">
            <section className="card card-white">
              <h2 className="card-heading">Upcoming Appointment</h2>
              <div className="appointment-body">
                <div className="profile-image-wrapper">
                  <img src={doctorProfile} className="profile-image" alt="Profile" />
                </div>
                <div className="appointment-details">
                  <div className="dr-header-row">
                    <div>
                      <h3 className="dr-name">Dr. Sarah Williams</h3>
                      <p className="appt-time">May 10, 2024 at 10:00 AM</p>
                      <p className="dr-specialty">Dr. General Practice</p>
                    </div>
                    <span className="medical-data-tag">MedicalData</span>
                  </div>
                  <div className="action-buttons">
                    <button className="reviewbtn">Orphastics</button>
                    <button className="reviewbtn">Reschedule</button>
                    <button className="reviewbtn">Cancel</button>
                  </div>
                </div>
              </div>
            </section>

            <div className="quick-actions-grid">
              <div className="action-card" onClick={() => setIsBookingOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="icon-circle icon-cyan">📅</div>
                <span>Book Appointment</span>
              </div>
              <div className="action-card"><div className="icon-circle icon-orange">📄</div><span>Upload Records</span></div>
              <div className="action-card"><div className="icon-circle icon-red">💊</div><span>Prescriptions</span></div>
              <div className="action-card"><div className="icon-circle icon-blue">📋</div><span>Lab Results</span></div>
            </div>

            <section className="card card-blue-solid">
              <h2 className="card-heading white-text">Patient Reviews</h2>
              <form className="review-form" onSubmit={handlePostReview}>
                <textarea 
                  className="review-input" 
                  placeholder="Share your experience..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
                <div className="review-form-footer">
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rating-picker">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                  <button type="submit" className="reviewbtn1">Post Review</button>
                </div>
              </form>
              <div className="reviews-list">
                {reviews.map((rev, i) => (
                  <div className="review-item" key={i}>
                    <p>"{rev.text}"</p>
                    <div className="review-meta">
                      <span>{rev.date}. {rev.name}</span>
                      <span className="stars">{"⭐".repeat(rev.stars)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Fully Restored */}
          <div className="right-column">
            {/* FIND DOCTOR SECTION */}
            <section className="card card-white">
              <div className="search-header-flex">
                <h2 className="card-heading">Find a Doctor</h2>
              </div>
              <form className="search-filters-grid">
                <div className="filter-group">
                  <label>Doctor Name</label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="e.g. Dr. Sarah" className="filter-input" />
                  </div>
                </div>
                <div className="filter-group">
                  <label>Location</label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-location-dot"></i>
                    <input type="text" placeholder="City or Zip" className="filter-input" />
                  </div>
                </div>
                <div className="filter-group">
                  <label>Specialization</label>
                  <select className="filter-input">
                    <option>All Specializations</option>
                    <option>General Practice</option>
                    <option>Cardiology</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Availability</label>
                  <select className="filter-input">
                    <option>Any Day</option>
                    <option>Weekdays</option>
                  </select>
                </div>
                <div className="filter-group submit-group">
                  <button type="submit" className="btn-search-apply">
                    <i className="fa-solid fa-sliders"></i> Apply Filters
                  </button>
                </div>
              </form>
              <div className="filtered-results-container">
                <div className="no-results-hint">Adjust filters to see available doctors</div>
              </div>
            </section>

            {/* AI CHATBOT SECTION */}
            <section className="card card-white ai-chatbot-container">
              <div className="ai-text-center">
                <h2 className="ai-title">
                  <i className="fa-solid fa-robot" style={{ marginRight: '10px', color: '#2563eb' }}></i>
                  Ask Medi-Track AI
                </h2>
                <p className="ai-subtitle">Instant symptom analysis & suggestions</p>
              </div>
              <div className="chat-window">
                <div className="chat-messages-scroll">
                  <div className="message-row bot-row">
                    <div className="bot-icon-bg"><i className="fa-solid fa-robot"></i></div>
                    <div className="message-bubble bot-bubble">
                      Hello John! I'm your AI health assistant. Describe how you're feeling...
                    </div>
                  </div>
                </div>
                <div className="chat-input-container">
                  <input type="text" placeholder="Type your symptoms here..." className="chat-input-field" />
                  <button className="chat-submit-btn"><i className="fa-solid fa-paper-plane"></i></button>
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default PatientHome;