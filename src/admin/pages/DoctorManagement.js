import { useState, useEffect } from "react";
import "../css/DoctorManagement.css";
import userpic from "../../doctor/images/user.png";

const matchExp = (exp, range) => {
  if (range === "all") return true;
  if (range === "0-5") return exp <= 5;
  if (range === "6-10") return exp <= 10;
  if (range === "10+") return exp > 10;
  return true;
};
const DoctorManagement = () => {
  const [doctors, setDoctors]     = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const [expFilter, setExpFilter]   = useState("all");
  const [viewDoc, setViewDoc]     = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [filters, setFilters] = useState({
    specializations: [],
    experienceRanges: [],
    statuses: []
  });
  // simulate fetch
  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/all`, {
        method: "GET",
        credentials: "include", // IMPORTANT (for cookies/auth)
      });

      const data = await res.json();

  if (data.success) {
    const formatted = data.doctors.map((doc) => ({
  id: doc._id,
  fullname: doc.fullName,
  email: doc.email,
  phone: doc.mobile,
  gender: doc.gender,
  dob: doc.dob,
  specialization: doc.specialization,
  experience: doc.experience,
  qualification: doc.qualification,
  licenseNumber: doc.licenseNumber,
  workingDays: doc.workingDays,
  workingHours: doc.workingHours,
  clinicName: doc.clinicName,
  clinicAddress: doc.clinicAddress,
  city: doc.city,
  state: doc.state,
  mapLink: doc.mapLink,
  about: doc.about,
  emergencyContact: doc.emergencyContact,
  status: doc.status || "pending",
  photo:  `${userpic}`,
}));
    setDoctors(formatted);        
    setFilters(data.filters || {
        specializations: [],
        experienceRanges: [],
        statuses: []
      }); // 
      } else {
        console.error("Failed to fetch doctors");
      }

    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);
const handleSuspend = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/doctor/${id}/suspend`, {
      method: "PUT",
      credentials: "include",
    });

    if (res.ok) {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, status: "Suspended" } : doc
        )
      );

      setViewDoc(null); // close modal
    }
  } catch (err) {
    console.error(err);
  }
};
  const handleReset = () => { setSearch(""); setSpecFilter("All"); setExpFilter("all"); };

  const filtered = doctors.filter(d => {
  const q = search.toLowerCase();

  const matchSearch =
    !q ||
    d.fullname.toLowerCase().includes(q) ||
    d.email.toLowerCase().includes(q) ||
    d.phone.includes(q);

  const matchSpec =
    specFilter === "All" || d.specialization === specFilter;

  const matchExpRange =
    matchExp(d.experience, expFilter);

  // ✅ ADD THIS LINE (important)
  const matchStatus = d.status.toLowerCase() === "approved";

  return matchSearch && matchSpec && matchExpRange && matchStatus;
});

  const handleDelete = () => {
    setDoctors(prev => prev.filter(d => d.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="dm-page">

      {/* ── HEADER ── */}
      <div className="dm-header">
        <div>
          <h2 className="dm-title">Doctor Management</h2>
          <p className="dm-subtitle">View and manage all registered doctors</p>
        </div>
        <span className="dm-total-badge">Total: {doctors.length}</span>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className="dm-toolbar">
        <div className="dm-search-wrap">
          <input
            className="dm-search"
            placeholder=" 🔍  Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="dm-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <select
          className="dm-filter-select"
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
        >
          <option value="All">All Specializations</option>
          {filters.specializations?.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select className="dm-filter-select" value={expFilter}
          onChange={e => setExpFilter(e.target.value)}>
          {filters.experienceRanges.map(r => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
        </select>

        <button className="dm-reset-btn" onClick={handleReset}>Reset</button>
      </div>
      
      {/* ── TABLE ── */}
      <div className="dm-table-card">
        <div className="dm-table-header">
          <h3 className="dm-table-title">All Doctors</h3>
          <span className="dm-table-count">{filtered.length} records</span>
        </div>

        {loading ? (
          <div className="dm-loading">
            <div className="dm-spinner" />
            <p>Loading doctors...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dm-empty">
            <span>🔍</span>
            <p>No doctors found matching your search or filters.</p>
            <button className="dm-reset-btn" onClick={handleReset}>Clear Filters</button>
          </div>
        ) : (
          <div className="dm-table-wrap">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, i) => (
                  <tr key={doc.id} 
                      onClick={() => setViewDoc(doc)} 
                      className="dm-clickable-row">
                    <td>{i + 1}</td>
                    <td>
                      <div className="dm-doc-cell">
                        <img src={doc.photo} alt={doc.lastname} className="dm-doc-avatar" />
                        <div>
                          <div className="dm-doc-name">{doc.fullname}</div>
                          <div className="dm-doc-email">{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{doc.specialization}</td>
                    <td>{doc.experience} yrs</td>
                    <td><span className={`dm-status ${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL ── */}
      {viewDoc && (
        <div className="dm-overlay" onClick={() => setViewDoc(null)}>
          <div className="dm-modal" onClick={e => e.stopPropagation()}>
            <div className="dm-modal-header">
              <h3>Doctor Details</h3>
              <button className="dm-modal-close" onClick={() => setViewDoc(null)}>✕</button>
            </div>
                {/* ── VIEW MODAL ── */}
            {viewDoc && (
              <div className="dm-overlay" onClick={() => setViewDoc(null)}>
                <div className="dm-modal" onClick={e => e.stopPropagation()}>
                  <div className="dm-modal-header">
                    <h3 className="dm-modal-title">Doctor Details</h3>
                    <button className="dm-modal-close" onClick={() => setViewDoc(null)}>✕</button>
                  </div>

                  <div className="dm-modal-body">
                    {/* PROFILE HEADER */}
                    <div className="dm-profile-section">
                      <img src={viewDoc.photo} alt={viewDoc.fullname} className="dm-main-avatar" />
                      <div className="dm-profile-info">
                        <h2 className="dm-doctor-name">{viewDoc.fullname}</h2>
                        <p className="dm-doctor-subtext">{viewDoc.specialization} · {viewDoc.experience} yrs</p>
                        <span className={`dm-status-pill ${viewDoc.status.toLowerCase()}`}>
                          {viewDoc.status}
                        </span>
                      </div>
                    </div>

                    {/* INFO GRID */}
                    <div className="dm-info-grid">
                      <div className="dm-info-item">
                        <label>EMAIL ID</label>
                        <span>{viewDoc.email}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>PHONE NUMBER</label>
                        <span>{viewDoc.phone}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>GENDER</label>
                        <span>{viewDoc.gender || "Male"}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>DATE OF BIRTH</label>
                        <span>{viewDoc.dob || "15 Mar 1980"}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>QUALIFICATION</label>
                        <span>{viewDoc.qualification}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>REG. NUMBER</label>
                        <span>{viewDoc.licenseNumber}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>HOSPITAL / CLINIC</label>
                        <span>{viewDoc.clinicName || "City Heart Clinic"}</span>
                      </div>
                      <div className="dm-info-item">
                        <label>CITY, STATE</label>
                        <span>{viewDoc.city}, {viewDoc.state}</span>
                      </div>
                    </div>

                    {/* ABOUT SECTION */}
                    <div className="dm-about-section">
                      <label>ABOUT DOCTOR</label>
                      <div className="dm-about-box">
                        {viewDoc.about || "No description provided."}
                      </div>
                    </div>
                  </div>

                  <div className="dm-modal-footer">
                    <button className="dm-footer-btn btn-cancel" onClick={() => setViewDoc(null)}>
                       Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="dm-modal-footer">
             <button
                className="dm-btn dm-btn-cancel"
                onClick={() => setViewDoc(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorManagement;
