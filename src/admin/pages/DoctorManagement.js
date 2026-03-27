import { useState } from "react";
import "../css/DoctorManagement.css";

const initialDoctors = [
  { id: 1,  name: "Dr. Amit Sharma",   specialization: "Cardiologist",   experience: 12, status: "Approved"  },
  { id: 2,  name: "Dr. Priya Patel",   specialization: "Neurologist",    experience: 8,  status: "Pending"   },
  { id: 3,  name: "Dr. Rahul Mehta",   specialization: "Orthopedic",     experience: 5,  status: "Pending"   },
  { id: 4,  name: "Dr. Sneha Joshi",   specialization: "Dermatologist",  experience: 10, status: "Approved"  },
  { id: 5,  name: "Dr. Karan Desai",   specialization: "Pediatrician",   experience: 7,  status: "Rejected"  },
  { id: 6,  name: "Dr. Meera Shah",    specialization: "Gynecologist",   experience: 15, status: "Approved"  },
  { id: 7,  name: "Dr. Rohan Trivedi", specialization: "Psychiatrist",   experience: 6,  status: "Pending"   },
  { id: 8,  name: "Dr. Anita Verma",   specialization: "Ophthalmologist",experience: 9,  status: "Rejected"  },
];

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const statusClass = {
  Pending:  "dm-badge dm-badge-pending",
  Approved: "dm-badge dm-badge-approved",
  Rejected: "dm-badge dm-badge-rejected",
};

const DoctorManagement = () => {
  const [doctors, setDoctors]   = useState(initialDoctors);
  const [filter, setFilter]     = useState("All");
  const [deleteId, setDeleteId] = useState(null); // confirm dialog

  const updateStatus = (id, status) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = () => {
    setDoctors(prev => prev.filter(d => d.id !== deleteId));
    setDeleteId(null);
  };

  const filtered = filter === "All" ? doctors : doctors.filter(d => d.status === filter);

  const counts = {
    All:      doctors.length,
    Pending:  doctors.filter(d => d.status === "Pending").length,
    Approved: doctors.filter(d => d.status === "Approved").length,
    Rejected: doctors.filter(d => d.status === "Rejected").length,
  };

  return (
    <div className="dm-page">

      {/* ── HEADER ── */}
      <div className="dm-header">
        <div>
          <h2 className="dm-title">Doctor Management</h2>
          <p className="dm-subtitle">Review and manage doctor registrations</p>
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="dm-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={"dm-filter-btn" + (filter === f ? " dm-filter-active" : "")}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="dm-filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="dm-table-wrap">
        {filtered.length === 0 ? (
          <div className="dm-empty">No doctors found for "{filter}".</div>
        ) : (
          <table className="dm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
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
                  <td className="dm-name">{doc.name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.experience} yrs</td>
                  <td>
                    <span className={statusClass[doc.status]}>{doc.status}</span>
                  </td>
                  <td>
                    <div className="dm-actions">
                      {doc.status !== "Approved" && (
                        <button
                          className="dm-btn dm-btn-approve"
                          onClick={() => updateStatus(doc.id, "Approved")}
                        >
                          Approve
                        </button>
                      )}
                      {doc.status !== "Rejected" && (
                        <button
                          className="dm-btn dm-btn-reject"
                          onClick={() => updateStatus(doc.id, "Rejected")}
                        >
                          Reject
                        </button>
                      )}
                      <button
                        className="dm-btn dm-btn-delete"
                        onClick={() => confirmDelete(doc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── DELETE CONFIRM DIALOG ── */}
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
