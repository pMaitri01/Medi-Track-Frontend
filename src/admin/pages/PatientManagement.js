import { useState } from "react";
import "../css/PatientManagement.css";

const initialPatients = [
  { id: 1,  name: "Ravi Shah",      mobile: "9876543210", city: "Surat"     },
  { id: 2,  name: "Neha Patel",     mobile: "9123456780", city: "Ahmedabad" },
  { id: 3,  name: "Karan Mehta",    mobile: "9988776655", city: "Vadodara"  },
  { id: 4,  name: "Sonal Desai",    mobile: "9871234560", city: "Surat"     },
  { id: 5,  name: "Amit Trivedi",   mobile: "9765432100", city: "Rajkot"    },
  { id: 6,  name: "Pooja Sharma",   mobile: "9654321098", city: "Ahmedabad" },
  { id: 7,  name: "Deepak Joshi",   mobile: "9543210987", city: "Gandhinagar"},
  { id: 8,  name: "Rina Verma",     mobile: "9432109876", city: "Surat"     },
  { id: 9,  name: "Suresh Nair",    mobile: "9321098765", city: "Vadodara"  },
  { id: 10, name: "Kavita Mishra",  mobile: "9210987654", city: "Rajkot"    },
];

const PatientManagement = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch]     = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    setPatients(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="pm-page">

      {/* ── HEADER ── */}
      <div className="pm-header">
        <div>
          <h2 className="pm-title">Patient Management</h2>
          <p className="pm-subtitle">{patients.length} patients registered</p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="pm-search-wrap">
        <span className="pm-search-icon">🔍</span>
        <input
          type="text"
          className="pm-search"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="pm-search-clear" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* ── TABLE ── */}
      <div className="pm-table-wrap">
        {filtered.length === 0 ? (
          <div className="pm-empty">
            <span>😕</span>
            <p>No patients found for "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <table className="pm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td className="pm-name">
                    <div className="pm-avatar">{p.name.charAt(0)}</div>
                    {p.name}
                  </td>
                  <td>{p.mobile}</td>
                  <td>{p.city}</td>
                  <td>
                    <button
                      className="pm-btn-delete"
                      onClick={() => setDeleteId(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── DELETE CONFIRM ── */}
      {deleteId && (
        <div className="pm-overlay">
          <div className="pm-dialog">
            <div className="pm-dialog-icon">🗑️</div>
            <h3>Delete Patient?</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="pm-dialog-actions">
              <button className="pm-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="pm-btn-confirm" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientManagement;
