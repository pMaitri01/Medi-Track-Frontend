import { useState } from "react";
import "../css/PatientManagement.css";

const allPatients = [
  {
    id: 1, name: "Ravi Shah",     email: "ravi@mail.com",   mobile: "9876543210",
    city: "Surat",      age: 34, gender: "Male",
    appointments: [
      { doctor: "Dr. Amit Sharma",   specialization: "Cardiologist",  date: "20 Mar 2026", time: "10:00 AM", status: "Completed" },
      { doctor: "Dr. Priya Patel",   specialization: "Neurologist",   date: "28 Mar 2026", time: "11:00 AM", status: "Upcoming"  },
    ],
    medicalHistory: "Hypertension, mild chest pain episodes.",
    prescriptions: "Amlodipine 5mg, Aspirin 75mg",
  },
  {
    id: 2, name: "Neha Patel",    email: "neha@mail.com",   mobile: "9123456780",
    city: "Ahmedabad", age: 28, gender: "Female",
    appointments: [
      { doctor: "Dr. Sneha Joshi",   specialization: "Dermatologist", date: "15 Mar 2026", time: "02:00 PM", status: "Completed" },
    ],
    medicalHistory: "Skin allergy, eczema.",
    prescriptions: "Cetirizine 10mg, Hydrocortisone cream",
  },
  {
    id: 3, name: "Karan Mehta",   email: "karan@mail.com",  mobile: "9988776655",
    city: "Vadodara",  age: 42, gender: "Male",
    appointments: [
      { doctor: "Dr. Rahul Mehta",   specialization: "Orthopedic",    date: "10 Mar 2026", time: "09:00 AM", status: "Completed" },
      { doctor: "Dr. Rahul Mehta",   specialization: "Orthopedic",    date: "01 Apr 2026", time: "09:00 AM", status: "Upcoming"  },
    ],
    medicalHistory: "Knee pain, mild arthritis.",
    prescriptions: "Diclofenac 50mg, Calcium supplements",
  },
  {
    id: 4, name: "Sonal Desai",   email: "sonal@mail.com",  mobile: "9871234560",
    city: "Surat",     age: 31, gender: "Female",
    appointments: [
      { doctor: "Dr. Meera Shah",    specialization: "Gynecologist",  date: "22 Mar 2026", time: "03:00 PM", status: "Completed" },
    ],
    medicalHistory: "No significant history.",
    prescriptions: "Folic acid, Iron supplements",
  },
  {
    id: 5, name: "Amit Trivedi",  email: "amit@mail.com",   mobile: "9765432100",
    city: "Rajkot",    age: 55, gender: "Male",
    appointments: [
      { doctor: "Dr. Amit Sharma",   specialization: "Cardiologist",  date: "05 Mar 2026", time: "10:00 AM", status: "Completed" },
      { doctor: "Dr. Amit Sharma",   specialization: "Cardiologist",  date: "05 Apr 2026", time: "10:00 AM", status: "Upcoming"  },
    ],
    medicalHistory: "Diabetes Type 2, high cholesterol.",
    prescriptions: "Metformin 500mg, Atorvastatin 10mg",
  },
  {
    id: 6, name: "Pooja Sharma",  email: "pooja@mail.com",  mobile: "9654321098",
    city: "Ahmedabad", age: 26, gender: "Female",
    appointments: [
      { doctor: "Dr. Karan Desai",   specialization: "Pediatrician",  date: "18 Mar 2026", time: "11:00 AM", status: "Completed" },
    ],
    medicalHistory: "No significant history.",
    prescriptions: "Vitamin D3, Multivitamin",
  },
  {
    id: 7, name: "Deepak Joshi",  email: "deepak@mail.com", mobile: "9543210987",
    city: "Gandhinagar", age: 38, gender: "Male",
    appointments: [
      { doctor: "Dr. Rohan Trivedi", specialization: "Psychiatrist",  date: "12 Mar 2026", time: "04:00 PM", status: "Completed" },
    ],
    medicalHistory: "Anxiety disorder, mild depression.",
    prescriptions: "Escitalopram 10mg, Clonazepam 0.5mg",
  },
  {
    id: 8, name: "Rina Verma",    email: "rina@mail.com",   mobile: "9432109876",
    city: "Surat",     age: 45, gender: "Female",
    appointments: [
      { doctor: "Dr. Anita Verma",   specialization: "Neurologist",   date: "08 Mar 2026", time: "10:00 AM", status: "Completed" },
      { doctor: "Dr. Anita Verma",   specialization: "Neurologist",   date: "08 Apr 2026", time: "10:00 AM", status: "Upcoming"  },
    ],
    medicalHistory: "Migraine, occasional vertigo.",
    prescriptions: "Sumatriptan 50mg, Betahistine 16mg",
  },
  {
    id: 9, name: "Suresh Nair",   email: "suresh@mail.com", mobile: "9321098765",
    city: "Vadodara",  age: 60, gender: "Male",
    appointments: [
      { doctor: "Dr. Amit Sharma",   specialization: "Cardiologist",  date: "01 Mar 2026", time: "09:00 AM", status: "Completed" },
    ],
    medicalHistory: "Coronary artery disease, post-bypass.",
    prescriptions: "Clopidogrel 75mg, Bisoprolol 5mg",
  },
  {
    id: 10, name: "Kavita Mishra", email: "kavita@mail.com", mobile: "9210987654",
    city: "Rajkot",   age: 33, gender: "Female",
    appointments: [
      { doctor: "Dr. Sneha Joshi",   specialization: "Dermatologist", date: "25 Mar 2026", time: "01:00 PM", status: "Upcoming"  },
    ],
    medicalHistory: "Psoriasis.",
    prescriptions: "Methotrexate 7.5mg, Moisturizer",
  },
];

const CITIES = ["All", ...Array.from(new Set(allPatients.map(p => p.city))).sort()];

const apptStatusClass = {
  Completed: "pm-appt-completed",
  Upcoming:  "pm-appt-upcoming",
};

const PatientManagement = () => {
  const [patients, setPatients] = useState(allPatients);
  const [search, setSearch]         = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [viewPatient, setViewPatient] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.mobile.includes(q);
    const matchCity = cityFilter === "All" || p.city === cityFilter;
    return matchSearch && matchCity;
  });

  const handleDelete = () => {
    setPatients(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  const handleReset = () => { setCityFilter("All"); setSearch(""); };

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
            {CITIES.map(c => (
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
                  <th>Actions</th>
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
                      <div className="pm-actions">
                        <button className="pm-btn pm-btn-view"
                          onClick={() => setViewPatient(p)}>
                          View
                        </button>
                        <button className="pm-btn pm-btn-delete"
                          onClick={() => setDeleteId(p.id)}>
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

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <div className="pm-overlay">
          <div className="pm-dialog">
            <div className="pm-dialog-icon">🗑️</div>
            <h3>Delete Patient?</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="pm-dialog-actions">
              <button className="pm-btn pm-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="pm-btn pm-btn-confirm" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientManagement;
