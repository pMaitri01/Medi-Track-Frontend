import React, { useState, useEffect } from 'react';
import '../css/DoctorList.css';
import Navbar from '../components/Navbar';
import defaultDoctorImg from '../images/user.png';

// ── Map backend doctor object to UI format ──
const mapDoctor = (doc) => ({
  id:     doc._id,
  name:   doc.fullName,
  spec:   doc.specialization  || "General Physician",
  exp:    doc.experience       || 0,
  city:   doc.city             || "Surat",
  gender: doc.gender           || "Male",
  about:  doc.about            || "Experienced doctor with excellent patient care.",
  rank:   doc.designation      || "Consultant",
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

  // ── Fetch doctors from backend on mount ──
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/doctor/names`
        );
        if (!res.ok) throw new Error("Failed to fetch doctors.");
        const data = await res.json();
        setDoctors(data.map(mapDoctor));
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
  const handleConfirmBooking = () => {
  if (!validateBooking()) return;

  setShowBooking(false);
  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
    setBookingDate("");
    setSelectedSlot("");
    setErrors({});
  }, 3000);
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
            onClick={() => setSelectedDoctor(doc)}
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
            <div className="success-icon">✅</div>
            <h2>Appointment Confirmed</h2>
            <p>Your visit has been successfully scheduled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;