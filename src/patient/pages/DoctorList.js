import React, { useState, useEffect } from 'react';
import '../css/DoctorList.css';
import Navbar from '../components/Navbar';
import defaultDoctorImg from '../images/user.png';

// ── Map backend doctor object to UI format ──
const mapDoctor = (doc) => ({
  id: doc._id,
  name: doc.fullName,
  spec: doc.specialization,
  city: doc.city,
  state: doc.state,
  gender: doc.gender,
  about: doc.about,
  rank: doc.designation,
  exp: doc.experience,
  qualification: doc.qualification,
  email: doc.email,
  mobile: doc.mobile,
  clinicName: doc.clinicName,
  clinicAddress: doc.clinicAddress,
  workingDays: doc.workingDays,
  workingHours: doc.workingHours,
  licenseNumber: doc.licenseNumber,
  emergencyContact: doc.emergencyContact,

  status: doc.status, // ✅ ADD THIS
});

const DoctorList = () => {
  // --- States ---
  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // ── Fetch doctors from backend on mount ──
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/doctor/all`
        );
        if (!res.ok) throw new Error("Failed to fetch doctors.");
        const data = await res.json();
        const approvedDoctors = data.doctors
          .filter(doc => doc.status === "approved" && doc.isProfileComplete) // ✅ FILTER HERE
          .map(mapDoctor);

        setDoctors(approvedDoctors);     
       } catch (err) {
        console.error("DoctorList fetch error:", err);
        setFetchError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filtering States
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterInputs, setFilterInputs] = useState({ specialization: '', location: '', gender: '', experience: '' });
  const [appliedFilters, setAppliedFilters] = useState({ specialization: '', location: '', gender: '', experience: '' });

  // Booking States
  const [bookingDate, setBookingDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];
  
  const today = new Date().toISOString().split('T')[0];

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInputs({ ...filterInputs, [name]: value });
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filterInputs);
  };

  const handleResetFilters = () => {
    const emptyFilters = { specialization: '', location: '', gender: '', experience: '' };
    setFilterInputs(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearchTerm("");     
  };

  // --- LIVE FILTER LOGIC (uses fetched doctors) ---
  const filteredDoctors = doctors.filter((doc) => {
    // 1. Live Match (Checks Name, Spec, or City as you type)
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.spec.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Applied Dropdown Matches
    return (
      matchesSearch &&
      (appliedFilters.specialization === '' || doc.spec === appliedFilters.specialization) &&
      (appliedFilters.location === '' || doc.city === appliedFilters.location) &&
      (appliedFilters.gender === '' || doc.gender === appliedFilters.gender) &&
      (appliedFilters.experience === '' || 
        (appliedFilters.experience === '5+' && doc.exp >= 5) || 
        (appliedFilters.experience === '10+' && doc.exp >= 10))
    );
  });
  const validateBooking = () => {
  let newErrors = {};

  if (!bookingDate) {
    newErrors.date = "Please select a date";
  } else {
    const selected = new Date(bookingDate);
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);

    if (selected < todayDate) {
      newErrors.date = "Past dates not allowed";
    }
  }

  if (!selectedSlot) {
    newErrors.slot = "Please select a time slot";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
const handleConfirmBooking = async () => {
  if (!validateBooking()) return;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/appointment`, // ✅ fixed URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },credentials:"include",
        body: JSON.stringify({
          doctor: selectedDoctor.id,
          patient: user._id, // ✅ required
          date: bookingDate,
          time: selectedSlot,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setShowBooking(false);
    setShowSuccess(true);

  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <nav className="navbar1">
          <div className="nav-logo"><span className="logo-icon">🩺</span> Find a Doctor</div>
        </nav>

        <div className="filter-card">
          <div className="filter-header">
            <input 
              type="text" 
              placeholder="Search by name, city, or specialty..." 
              style={{ 
                padding: "10px", 
                borderRadius: "5px", 
                border: "1px solid #ccc",
                width: "85%",
                marginLeft: "0px" 
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />

            <button className="DL-collapse-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              {isFilterOpen ? "Hide Filters ↑" : "Show Filters ↓"}
            </button>
          </div>

          {isFilterOpen && (
            <>
              <div className="filter-grid">
                <div className="input-group">
                  <label>SPECIALIZATION</label>
                  <select name="specialization" value={filterInputs.specialization} onChange={handleInputChange}>
                    <option value="">All Specializations</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>LOCATION</label>
                  <select name="location" value={filterInputs.location} onChange={handleInputChange}>
                    <option value="">All Locations</option>
                    <option value="Surat">Surat</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Vadodara">Vadodara</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>GENDER</label>
                  <select name="gender" value={filterInputs.gender} onChange={handleInputChange}>
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>EXPERIENCE</label>
                  <select name="experience" value={filterInputs.experience} onChange={handleInputChange}>
                    <option value="">Any Experience</option>
                    <option value="5+">5+ Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
              </div>
              <div className="search-footer">
                <button className="DL-main-search-btn" onClick={handleApplyFilters}>Apply Filter</button>
                <button className="DL-btn-secondary" onClick={handleResetFilters} style={{marginRight: '10px'}}>Reset</button>
              </div>
            </>
          )}
        </div>

        {/* <div className="doctor-list-grid">
          {loading ? (
            <p style={{ padding: "20px", color: "#64748b" }}>Loading doctors...</p>
          ) : fetchError ? (
            <p style={{ padding: "20px", color: "#dc2626" }}>❌ {fetchError}</p>
          ) : filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
            <div key={doc.id} className="doc-card">
              <div className="doc-info">
                <img src={defaultDoctorImg} alt="doctor" className="doc-img" />
                <div className="doc-text">
                  <h3>{doc.name}</h3>
                  <span className="spec-tag">{doc.spec}</span>
                  <p>💼 {doc.rank}</p>
                  <p>🕒 {doc.exp} years experience</p>
                  <p>📍 {doc.city}</p>
                </div>
              </div>
              <div className="doc-actions">
                <button className="DL-btn-secondary" onClick={() => setSelectedDoctor(doc)}>👁 Details</button>
                <button className="btn-primary" onClick={() => { setSelectedDoctor(doc); setShowBooking(true); }}>📅 Book</button>
              </div>
            </div>
          )) : <p style={{ padding: "20px" }}>No doctors found.</p>}
        </div> */}
        <div className="doctor-list-grid">
  {loading ? (
    <p>Loading doctors...</p>
  ) : fetchError ? (
    <p style={{ color: "red" }}>{fetchError}</p>
  ) : filteredDoctors.length > 0 ? (
    filteredDoctors.map((doc) => (
      <div key={doc.id} className="doc-card">

        {/* Top Section */}
        <div className="doc-info">
          <img src={defaultDoctorImg} alt="doctor" className="doc-img" />

          <div className="doc-text">
            <h3>{doc.name}</h3>
            <span className="spec-tag">{doc.spec}</span>
            <p>💼 {doc.rank}</p>
            <p>🕒 {doc.exp} years experience</p>
            <p>📍 {doc.city}</p>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="doc-footer">
          <button
            className="DL-btn-secondary"
            onClick={() => {
              setSelectedDoctor(doc);
              setShowDetails(true);
            }}
          >
            👁 Details
          </button>

          <button
            className="btn-primary"
           onClick={() => {
            // console.log("Book clicked", doc);
            setSelectedDoctor(doc);
            setShowBooking(true);
          }}
          >
            📅 Book
          </button>
        </div>

      </div>
    ))
  ) : (
    <p>No doctors found.</p>
  )}
</div>
      </main>

      {/* Booking Modal */}
      {showBooking && selectedDoctor && (
  <div className="modal-overlay">
    <div className="booking-modal">

      {/* HEADER */}
      <div className="booking-header">
        <div className="doctor-summary">
          <img src={defaultDoctorImg} alt="doc" />
          <div className="doctor-name">
            <h3>{selectedDoctor.name}</h3>
            <p>{selectedDoctor.spec} • {selectedDoctor.city}</p>
          </div>
        </div>
        <button className="close-btn" onClick={() => setShowBooking(false)}>✖</button>
      </div>

      {/* BODY */}
      <div className="booking-body">

        {/* STEP 1 - DATE */}
        <div className="booking-step">
          <h4>📅 Select Date</h4>
          <input
            type="date"
            min={today}
            value={bookingDate}
            onChange={(e) => {
              setBookingDate(e.target.value);
              setSelectedSlot("");
              setErrors({ ...errors, date: "" }); // clear error
            }}
          />

        {errors.date && <p className="error-text">{errors.date}</p>}
        </div>

        {/* STEP 2 - TIME */}
        <div className="booking-step">
          <h4>⏰ Select Time</h4>

          {bookingDate ? (
          <>
            <div className="slots-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  className={`slot-btn ${selectedSlot === slot ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setErrors({ ...errors, slot: "" }); // clear error
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>

            {errors.slot && <p className="error-text">{errors.slot}</p>}
          </>
        ) : (
          <p className="placeholder">Select date first</p>
        )}
        </div>

      </div>

      {/* FOOTER */}
      <div className="booking-footer">
        <button
          className={`confirm-btn ${
            (!bookingDate || !selectedSlot) ? "disabled" : ""
          }`}
          disabled={!bookingDate || !selectedSlot}
          onClick={handleConfirmBooking}
        >
          Confirm Appointment
        </button>
        <button className="cancel-btn" onClick={() => setShowBooking(false)}>
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

  {showSuccess && (
  <div className="modal-overlay">
    <div className="success-card">
      {/* Cancel/Close button at top right */}
      <button 
        className="close-btn-success" 
        onClick={() => setShowSuccess(false)}
      >
        ✖
      </button>

      <div className="success-icon">✅</div>
      <h2>Appointment Confirmed</h2>
      <p>Your visit has been successfully scheduled.</p>
      
      {/* Optional: Add an 'OK' button to make it user-friendly */}
      <button 
        className="DL-main-search-btn" 
        style={{ marginTop: '20px' }} 
        onClick={() => setShowSuccess(false)}
      >
        Done
      </button>
    </div>
  </div>
)}

{showDetails && selectedDoctor && (
  <div className="modal-overlay">
    <div className="details-modal">

      {/* HEADER */}
      <div className="booking-header">
        <h3>Doctor Details</h3>
        <button onClick={() => setShowDetails(false)}>✖</button>
      </div>

      {/* BODY */}
      {/* <div className="details-body">

        <img 
          src={defaultDoctorImg} 
          alt="doctor" 
          style={{ width: "120px", borderRadius: "50%" }}
        />

        <h2>{selectedDoctor.name}</h2>
        <p><strong>Specialization:</strong> {selectedDoctor.spec}</p>
        <p><strong>Experience:</strong> {selectedDoctor.exp} years</p>
        <p><strong>City:</strong> {selectedDoctor.city}</p>
        <p><strong>Gender:</strong> {selectedDoctor.gender}</p>
        <p><strong>Designation:</strong> {selectedDoctor.rank}</p>
        <p><strong>About:</strong> {selectedDoctor.about}</p>

      </div> */}

      <div className="details-body">
  <img 
    src={defaultDoctorImg} 
    alt="doctor" 
    style={{ width: "100px", borderRadius: "50%", marginBottom: '10px' }}
  />
  <h2>{selectedDoctor.name}</h2>
  <span className="spec-tag">{selectedDoctor.spec}</span>

  <div className="info-sections" style={{ textAlign: 'left', marginTop: '20px' }}>
    
    {/* Section 1: Professional Details */}
    <div className="info-group">
      <h4 style={{ color: '#0d9488', borderBottom: '1px solid #eee' }}>Professional Info</h4>
      <p><strong>Designation:</strong> {selectedDoctor.rank}</p>
      <p><strong>Experience:</strong> {selectedDoctor.exp} years</p>
      <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
      <p><strong>License No:</strong> {selectedDoctor.licenseNumber}</p>
    </div>

    {/* Section 2: Contact Details */}
    <div className="info-group" style={{ marginTop: '15px' }}>
      <h4 style={{ color: '#0d9488', borderBottom: '1px solid #eee' }}>Contact & Location</h4>
      <p><strong>Email:</strong> {selectedDoctor.email}</p>
      <p><strong>Mobile:</strong> {selectedDoctor.mobile}</p>
      <p><strong>Location:</strong> {selectedDoctor.city}, {selectedDoctor.state}</p>
      <p><strong>Emergency:</strong> {selectedDoctor.emergencyContact}</p>
    </div>

    {/* Section 3: Clinic & Availability */}
    <div className="info-group" style={{ marginTop: '15px' }}>
      <h4 style={{ color: '#0d9488', borderBottom: '1px solid #eee' }}>Clinic Details</h4>
      <p><strong>Clinic:</strong> {selectedDoctor.clinicName}</p>
      <p><strong>Address:</strong> {selectedDoctor.clinicAddress}</p>
      <p><strong>Working Days:</strong> {selectedDoctor.workingDays}</p>
      <p><strong>Hours:</strong> {selectedDoctor.workingHours}</p>
    </div>

    {/* Section 4: About */}
    <div className="info-group" style={{ marginTop: '15px' }}>
      <h4 style={{ color: '#0d9488', borderBottom: '1px solid #eee' }}>About</h4>
      <p style={{ fontStyle: 'italic', color: '#64748b' }}>{selectedDoctor.about}</p>
    </div>

  </div>
</div>

      {/* FOOTER */}
      <div className="booking-footer">
        <button 
          className="btn-primary"
          onClick={() => {
            setShowDetails(false);
            setShowBooking(true);
          }}
        >
          📅 Book Appointment
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default DoctorList;