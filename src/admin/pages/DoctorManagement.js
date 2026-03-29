import { useState, useEffect } from "react";
import "../css/DoctorManagement.css";

const allDoctors = [
  { id: 1,  name: "Dr. Amit Sharma",   email: "amit@mail.com",   phone: "9876543210", specialization: "Cardiologist",    experience: 12, qualification: "MBBS, MD",  status: "Approved",  photo: "https://randomuser.me/api/portraits/men/45.jpg"   },
  { id: 2,  name: "Dr. Priya Patel",   email: "priya@mail.com",  phone: "9123456780", specialization: "Neurologist",     experience: 8,  qualification: "MBBS, DM",  status: "Pending",   photo: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 3,  name: "Dr. Rahul Mehta",   email: "rahul@mail.com",  phone: "9988776655", specialization: "Orthopedic",      experience: 5,  qualification: "MBBS, MS",  status: "Pending",   photo: "https://randomuser.me/api/portraits/men/32.jpg"   },
  { id: 4,  name: "Dr. Sneha Joshi",   email: "sneha@mail.com",  phone: "9871234560", specialization: "Dermatologist",   experience: 10, qualification: "MBBS, DVD", status: "Approved",  photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 5,  name: "Dr. Karan Desai",   email: "karan@mail.com",  phone: "9765432100", specialization: "Pediatrician",    experience: 2,  qualification: "MBBS, DCH", status: "Rejected",  photo: "https://randomuser.me/api/portraits/men/55.jpg"   },
  { id: 6,  name: "Dr. Meera Shah",    email: "meera@mail.com",  phone: "9654321098", specialization: "Gynecologist",    experience: 15, qualification: "MBBS, MS",  status: "Approved",  photo: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: 7,  name: "Dr. Rohan Trivedi", email: "rohan@mail.com",  phone: "9543210987", specialization: "Cardiologist",    experience: 4,  qualification: "MBBS, MD",  status: "Pending",   photo: "https://randomuser.me/api/portraits/men/22.jpg"   },
  { id: 8,  name: "Dr. Anita Verma",   email: "anita@mail.com",  phone: "9432109876", specialization: "Neurologist",     experience: 9,  qualification: "MBBS, DM",  status: "Approved",  photo: "https://randomuser.me/api/portraits/women/55.jpg" },
  { id: 9,  name: "Dr. Suresh Nair",   email: "suresh@mail.com", phone: "9321098765", specialization: "Orthopedic",      experience: 6,  qualification: "MBBS, MS",  status: "Approved",  photo: "https://randomuser.me/api/portraits/men/60.jpg"   },
  { id: 10, name: "Dr. Kavita Mishra", email: "kavita@mail.com", phone: "9210987654", specialization: "Dermatologist",   experience: 3,  qualification: "MBBS, DVD", status: "Pending",   photo: "https://randomuser.me/api/portraits/women/70.jpg" },
];

const SPECIALIZATIONS = ["All", "Cardiologist", "Neurologist", "Orthopedic", "Dermatologist", "Pediatrician", "Gynecologist"];

const EXP_RANGES = [
  { label: "All Experience", value: "all" },
  { label: "0 – 2 years",    value: "0-2"  },
  { label: "3 – 5 years",    value: "3-5"  },
  { label: "5+ years",       value: "5+"   },
];

const matchExp = (exp, range) => {
  if (range === "all") return true;
  if (range === "0-2")  return exp >= 0 && exp <= 2;
  if (range === "3-5")  return exp >= 3 && exp <= 5;
  if (range === "5+")   return exp > 5;
  return true;
};

const statusClass = {
  Pending:  "dm-badge dm-badge-pending",
  Approved: "dm-badge dm-badge-approved",
  Rejected: "dm-badge dm-badge-rejected",
};

const DoctorManagement = () => {
  const [doctors, setDoctors]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [specFilter, setSpecFilter] = useState("All");
  const [expFilter, setExpFilter]   = useState("all");
  const [viewDoc, setViewDoc]     = useState(null);
  const [deleteId, setDeleteId]   = useState(null);

  // simulate fetch
  useEffect(() => {
    const t = setTimeout(() => { setDoctors(allDoctors); setLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleReset = () => { setSearch(""); setSpecFilter("All"); setExpFilter("all"); };

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      d.name.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.phone.includes(q);
    const matchSpec = specFilter === "All" || d.specialization === specFilter;
    const matchExpRange = matchExp(d.experience, expFilter);
    return matchSearch && matchSpec && matchExpRange;
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
          <span className="dm-search-icon">🔍</span>
          <input
            className="dm-search"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="dm-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <select className="dm-filter-select" value={specFilter}
          onChange={e => setSpecFilter(e.target.value)}>
          {SPECIALIZATIONS.map(s => (
            <option key={s} value={s}>{s === "All" ? "All Specializations" : s}</option>
          ))}
        </select>

        <select className="dm-filter-select" value={expFilter}
          onChange={e => setExpFilter(e.target.value)}>
          {EXP_RANGES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, i) => (
                  <tr key={doc.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="dm-doc-cell">
                        <img src={doc.photo} alt={doc.name} className="dm-doc-avatar" />
                        <div>
                          <div className="dm-doc-name">{doc.name}</div>
                          <div className="dm-doc-email">{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{doc.specialization}</td>
                    <td>{doc.experience} yrs</td>
                    <td><span className={statusClass[doc.status]}>{doc.status}</span></td>
                    <td>
                      <div className="dm-actions">
                        <button className="dm-btn dm-btn-view"
                          onClick={() => setViewDoc(doc)}>
                          View
                        </button>
                        <button className="dm-btn dm-btn-delete"
                          onClick={() => setDeleteId(doc.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
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
            <div className="dm-modal-body">
              <div className="dm-modal-profile">
                <img src={viewDoc.photo} alt={viewDoc.name} className="dm-modal-avatar" />
                <div>
                  <h4 className="dm-modal-name">{viewDoc.name}</h4>
                  <span className={statusClass[viewDoc.status]}>{viewDoc.status}</span>
                </div>
              </div>
              <div className="dm-modal-grid">
                <div className="dm-modal-item">
                  <span className="dm-modal-label">Email Address</span>
                  <span className="dm-modal-value">{viewDoc.email}</span>
                </div>
                <div className="dm-modal-item">
                  <span className="dm-modal-label">Phone Number</span>
                  <span className="dm-modal-value">{viewDoc.phone}</span>
                </div>
                <div className="dm-modal-item">
                  <span className="dm-modal-label">Specialization</span>
                  <span className="dm-modal-value">{viewDoc.specialization}</span>
                </div>
                <div className="dm-modal-item">
                  <span className="dm-modal-label">Qualification</span>
                  <span className="dm-modal-value">{viewDoc.qualification}</span>
                </div>
                <div className="dm-modal-item">
                  <span className="dm-modal-label">Experience</span>
                  <span className="dm-modal-value">{viewDoc.experience} years</span>
                </div>
                <div className="dm-modal-item">
                  <span className="dm-modal-label">Registration Status</span>
                  <span className="dm-modal-value">{viewDoc.status}</span>
                </div>
              </div>
            </div>
            <div className="dm-modal-footer">
              <button className="dm-btn dm-btn-cancel" onClick={() => setViewDoc(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <div className="dm-overlay">
          <div className="dm-dialog">
            <div className="dm-dialog-icon">🗑️</div>
            <h3>Delete Doctor?</h3>
            <p>This action cannot be undone. Are you sure you want to delete this doctor?</p>
            <div className="dm-dialog-actions">
              <button className="dm-btn dm-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="dm-btn dm-btn-delete" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorManagement;
