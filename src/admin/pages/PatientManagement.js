import { useState, useEffect } from "react";
import "../css/PatientManagement.css";

// ── Backend field mapping helper ──
// API returns: { _id, name, age, gender, phone, email, address, createdAt }
// UI expects:  { id, name, age, gender, mobile, email, city, appointments, medicalHistory, prescriptions }
const mapPatient = (p) => ({
  id:             p._id,
  name:           p.name           || "—",
  email:          p.email          || "—",
  mobile:         p.phone          || "—",   // phone → mobile
  age:            p.age            || "—",
  gender:         p.gender         || "—",
  city:           p.address        || "—",   // address used as city (adjust if backend sends separate city)
  appointments:   p.appointments   || [],
  medicalHistory: p.medicalHistory || "Not available",
  prescriptions:  p.prescriptions  || "Not available",
});

const apptStatusClass = {
  Completed: "pm-appt-completed",
  Upcoming:  "pm-appt-upcoming",
};

const PatientManagement = () => {
  const [patients, setPatients]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState("");
  const [search, setSearch]           = useState("");
  const [cityFilter, setCityFilter]   = useState("All");
  const [viewPatient, setViewPatient] = useState(null);

  // ── Fetch patients from backend on mount ──
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/patient`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch patients.");
        }

        const data = await res.json();
        // Map backend fields to UI-expected fields
        setPatients(data.map(mapPatient));
      } catch (err) {
        console.error("Error fetching patients:", err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // ── Build city list dynamically from fetched data ──
  const cities = ["All", ...Array.from(new Set(patients.map(p => p.city).filter(Boolean))).sort()];

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.mobile.includes(q);
    const matchCity = cityFilter === "All" || p.city === cityFilter;
    return matchSearch && matchCity;
  });

  const handleReset = () => { setCityFilter("All"); setSearch(""); };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="pm-page">
        <div className="pm-loading">
          <div className="pm-spinner" />
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  // ── Fetch error state ──
  if (fetchError) {
    return (
      <div className="pm-page">
        <div className="pm-fetch-error">
          ❌ {fetchError}
        </div>
      </div>
    );
  }

  return (
    <div className="pm-page">

      {/* ── HEADER ── */}
      <div className="pm-header">
        <div>
          <h2 className="pm-title">Patient Management</h2>
          <p className="pm-subtitle">{patients.length} patients registered</p>
        </div>
        <span className="pm-total-badge">Showing: {filtered.length}</span>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="pm-toolbar">
        <div className="pm-search-wrap">
          <span className="pm-search-icon">🔍</span>
          <input
            type="text"
            className="pm-search"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="pm-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="pm-filter-group">
          <select
            className="pm-city-select"
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
          >
            {cities.map(c => (
              <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
            ))}
          </select>
        </div>

        {(cityFilter !== "All" || search) && (
          <button className="pm-reset-btn" onClick={handleReset}>✕ Reset</button>
        )}
      </div>

      {/* ── TABLE CARD ── */}
      <div className="pm-table-card">
        <div className="pm-table-header">
          <h3 className="pm-table-title">All Patients</h3>
          <span className="pm-table-count">{filtered.length} records</span>
        </div>

        {filtered.length === 0 ? (
          <div className="pm-empty">
            <span>😕</span>
            <p>No patients found in <strong>{cityFilter}</strong>.</p>
            <button className="pm-reset-btn" onClick={handleReset}>Show All</button>
          </div>
        ) : (
          <div className="pm-table-wrap">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Age / Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="pm-patient-cell">
                        <div className="pm-avatar">{p.name.charAt(0)}</div>
                        <div>
                          <div className="pm-patient-name">{p.name}</div>
                          <div className="pm-patient-email">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.mobile}</td>
                    <td>{p.city}</td>
                    <td>{p.age} yrs / {p.gender}</td>
                    <td>
                      <button className="pm-btn pm-btn-view"
                        onClick={() => setViewPatient(p)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── VIEW MODAL ── */}
      {viewPatient && (
        <div className="pm-overlay" onClick={() => setViewPatient(null)}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>

            <div className="pm-modal-header">
              <h3>Patient Details</h3>
              <button className="pm-modal-close" onClick={() => setViewPatient(null)}>✕</button>
            </div>

            <div className="pm-modal-body">

              {/* Personal Info */}
              <div className="pm-modal-section">
                <div className="pm-modal-section-title">👤 Personal Information</div>
                <div className="pm-modal-avatar-row">
                  <div className="pm-modal-avatar">{viewPatient.name.charAt(0)}</div>
                  <div>
                    <h4 className="pm-modal-name">{viewPatient.name}</h4>
                    <p className="pm-modal-sub">{viewPatient.city} · {viewPatient.age} yrs · {viewPatient.gender}</p>
                  </div>
                </div>
                <div className="pm-modal-grid">
                  <div className="pm-modal-item">
                    <span className="pm-modal-label">Email</span>
                    <span className="pm-modal-value">{viewPatient.email}</span>
                  </div>
                  <div className="pm-modal-item">
                    <span className="pm-modal-label">Phone</span>
                    <span className="pm-modal-value">{viewPatient.mobile}</span>
                  </div>
                  <div className="pm-modal-item">
                    <span className="pm-modal-label">City</span>
                    <span className="pm-modal-value">{viewPatient.city}</span>
                  </div>
                  <div className="pm-modal-item">
                    <span className="pm-modal-label">Age / Gender</span>
                    <span className="pm-modal-value">{viewPatient.age} yrs / {viewPatient.gender}</span>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <div className="pm-modal-section">
                <div className="pm-modal-section-title">📅 Appointment History</div>
                {viewPatient.appointments.length === 0 ? (
                  <p className="pm-modal-empty">No appointments found.</p>
                ) : (
                  <div className="pm-appt-list">
                    {viewPatient.appointments.map((a, i) => (
                      <div key={i} className="pm-appt-item">
                        <div className="pm-appt-left">
                          <div className="pm-appt-doctor">{a.doctor}</div>
                          <div className="pm-appt-spec">{a.specialization}</div>
                          <div className="pm-appt-date">📅 {a.date} at {a.time}</div>
                        </div>
                        <span className={`pm-appt-badge ${apptStatusClass[a.status]}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical Records */}
              <div className="pm-modal-section">
                <div className="pm-modal-section-title">🏥 Medical Records</div>
                <div className="pm-modal-record">
                  <span className="pm-modal-label">Medical History</span>
                  <p className="pm-modal-record-text">{viewPatient.medicalHistory}</p>
                </div>
                <div className="pm-modal-record" style={{ marginTop: 10 }}>
                  <span className="pm-modal-label">Current Prescriptions</span>
                  <p className="pm-modal-record-text">{viewPatient.prescriptions}</p>
                </div>
              </div>

            </div>

            <div className="pm-modal-footer">
              <button className="pm-btn pm-btn-cancel" onClick={() => setViewPatient(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientManagement;
