import { useState, useEffect } from "react";
import "../css/DoctorApproval.css";

const PER_PAGE    = 5;
const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];

const dummyDoctors = [
  { id: 1, name: "Dr. Amit Sharma",   email: "amit@mail.com",   mobile: "9876543210", specialization: "Cardiologist",   experience: 12, qualification: "MBBS, MD",  regNo: "MCI-2345", gender: "Male",   dob: "15 Mar 1980", hospital: "City Heart Clinic",   city: "Surat",       state: "Gujarat", status: "Pending",  about: "Experienced cardiologist with 12 years in interventional cardiology.", photo: "https://randomuser.me/api/portraits/men/45.jpg"   },
  { id: 2, name: "Dr. Priya Patel",   email: "priya@mail.com",  mobile: "9123456780", specialization: "Neurologist",    experience: 8,  qualification: "MBBS, DM",  regNo: "MCI-3456", gender: "Female", dob: "22 Jul 1985", hospital: "NeuroLife Hospital",   city: "Ahmedabad",   state: "Gujarat", status: "Pending",  about: "Specialist in neurological disorders and stroke management.", photo: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 3, name: "Dr. Rahul Mehta",   email: "rahul@mail.com",  mobile: "9988776655", specialization: "Orthopedic",     experience: 5,  qualification: "MBBS, MS",  regNo: "MCI-4567", gender: "Male",   dob: "10 Jan 1990", hospital: "BoneCare Center",      city: "Vadodara",    state: "Gujarat", status: "Approved", about: "Orthopedic surgeon specializing in joint replacement.", photo: "https://randomuser.me/api/portraits/men/32.jpg"   },
  { id: 4, name: "Dr. Sneha Joshi",   email: "sneha@mail.com",  mobile: "9871234560", specialization: "Dermatologist",  experience: 10, qualification: "MBBS, DVD", regNo: "MCI-5678", gender: "Female", dob: "05 Sep 1983", hospital: "SkinCare Clinic",      city: "Surat",       state: "Gujarat", status: "Pending",  about: "Dermatologist with expertise in cosmetic and clinical dermatology.", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 5, name: "Dr. Karan Desai",   email: "karan@mail.com",  mobile: "9765432100", specialization: "Pediatrician",   experience: 7,  qualification: "MBBS, DCH", regNo: "MCI-6789", gender: "Male",   dob: "18 Apr 1987", hospital: "KidsCare Hospital",    city: "Rajkot",      state: "Gujarat", status: "Rejected", about: "Pediatrician focused on child health and immunization.", photo: "https://randomuser.me/api/portraits/men/55.jpg"   },
  { id: 6, name: "Dr. Meera Shah",    email: "meera@mail.com",  mobile: "9654321098", specialization: "Gynecologist",   experience: 15, qualification: "MBBS, MS",  regNo: "MCI-7890", gender: "Female", dob: "30 Nov 1978", hospital: "WomenCare Hospital",   city: "Ahmedabad",   state: "Gujarat", status: "Pending",  about: "Senior gynecologist with 15 years in maternal and fetal medicine.", photo: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: 7, name: "Dr. Rohan Trivedi", email: "rohan@mail.com",  mobile: "9543210987", specialization: "Cardiologist",   experience: 6,  qualification: "MBBS, MD",  regNo: "MCI-8901", gender: "Male",   dob: "12 Jun 1989", hospital: "HeartCare Clinic",     city: "Gandhinagar", state: "Gujarat", status: "Pending",  about: "Cardiologist specializing in preventive cardiology.", photo: "https://randomuser.me/api/portraits/men/22.jpg"   },
  { id: 8, name: "Dr. Anita Verma",   email: "anita@mail.com",  mobile: "9432109876", specialization: "Neurologist",    experience: 9,  qualification: "MBBS, DM",  regNo: "MCI-9012", gender: "Female", dob: "25 Feb 1984", hospital: "BrainCare Institute",  city: "Surat",       state: "Gujarat", status: "Approved", about: "Neurologist with expertise in epilepsy and movement disorders.", photo: "https://randomuser.me/api/portraits/women/55.jpg" },
];

const statusClass = {
  Pending:  "da-badge da-badge-pending",
  Approved: "da-badge da-badge-approved",
  Rejected: "da-badge da-badge-rejected",
};

const DoctorApproval = () => {
  const [doctors, setDoctors]           = useState(dummyDoctors);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]                 = useState(1);
  const [selectedDoc, setSelectedDoc]   = useState(null); // right panel
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError]   = useState("");
  const [loading, setLoading]           = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closePanel = () => {
    setSelectedDoc(null);
    setRejectReason("");
    setRejectError("");
  };

  // ── Approve ──
  const handleApprove = () => {
    setLoading("approve");
    setTimeout(() => {
      setDoctors(prev => prev.map(d =>
        d.id === selectedDoc.id ? { ...d, status: "Approved" } : d
      ));
      setLoading(null);
      showToast(`${selectedDoc.name} approved successfully!`, "success");
      closePanel();
    }, 1000);
  };

  // ── Reject ──
  const handleReject = () => {
    if (!rejectReason.trim()) { setRejectError("Rejection reason is required."); return; }
    setLoading("reject");
    setTimeout(() => {
      setDoctors(prev => prev.map(d =>
        d.id === selectedDoc.id ? { ...d, status: "Rejected" } : d
      ));
      setLoading(null);
      showToast(`${selectedDoc.name} has been rejected.`, "reject");
      closePanel();
    }, 1000);
  };

  // ── Filter + paginate ──
  const filtered   = doctors.filter(d => statusFilter === "All" || d.status === statusFilter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [statusFilter]);

  const counts = {
    total:    doctors.length,
    pending:  doctors.filter(d => d.status === "Pending").length,
    approved: doctors.filter(d => d.status === "Approved").length,
  };

  return (
    <div className="da-page">

      {/* ── TOAST ── */}
      {toast && (
        <div className={`da-toast da-toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="da-stats">
        <div className="da-stat-card">
          <div className="da-stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>🧑‍⚕️</div>
          <div className="da-stat-info">
            <span className="da-stat-value">{counts.total}</span>
            <span className="da-stat-label">Total Doctors</span>
          </div>
        </div>
        <div className="da-stat-card">
          <div className="da-stat-icon" style={{ background: "#fefce8", color: "#ca8a04" }}>⏳</div>
          <div className="da-stat-info">
            <span className="da-stat-value">{counts.pending}</span>
            <span className="da-stat-label">Pending Approvals</span>
          </div>
        </div>
        <div className="da-stat-card">
          <div className="da-stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>✅</div>
          <div className="da-stat-info">
            <span className="da-stat-value">{counts.approved}</span>
            <span className="da-stat-label">Approved Doctors</span>
          </div>
        </div>
      </div>

      {/* ── STATUS TABS ── */}
      <div className="da-status-tabs">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            className={"da-tab-btn" + (statusFilter === tab ? " da-tab-active" : "")}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
            <span className="da-tab-count">
              {tab === "All" ? doctors.length : doctors.filter(d => d.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="da-table-card">
        <div className="da-table-header">
          <h3 className="da-table-title">Doctor Registrations</h3>
          <span className="da-table-count">{filtered.length} records</span>
        </div>

        <div className="da-table-wrap">
          {paginated.length === 0 ? (
            <div className="da-empty">
              <span>🔍</span>
              <p>No doctors found for this status.</p>
            </div>
          ) : (
            <table className="da-table">
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
                {paginated.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className={"da-row-clickable" + (selectedDoc?.id === doc.id ? " da-row-selected" : "")}
                    onClick={() => { setSelectedDoc(doc); setRejectReason(""); setRejectError(""); }}
                    title="Click to view details"
                  >
                    <td>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td>
                      <div className="da-doc-cell">
                        <img src={doc.photo} alt={doc.name} className="da-doc-avatar" />
                        <div>
                          <div className="da-doc-name">{doc.name}</div>
                          <div className="da-doc-email">{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{doc.specialization}</td>
                    <td>{doc.experience} yrs</td>
                    <td><span className={statusClass[doc.status]}>{doc.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="da-pagination">
            <span>
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="da-page-btns">
              <button className="da-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={"da-page-btn" + (page === i + 1 ? " active" : "")} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
              <button className="da-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT SLIDE PANEL ── */}
      {selectedDoc && (
        <>
          {/* Overlay — click outside to close */}
          <div className="da-panel-overlay" onClick={closePanel} />

          {/* Sliding panel */}
          <div className="da-panel">

            {/* Panel header */}
            <div className="da-panel-header">
              <h2 className="da-panel-title">Doctor Details</h2>
              <button className="da-panel-close" onClick={closePanel}>✕</button>
            </div>

            {/* Scrollable body */}
            <div className="da-panel-body">

              {/* Profile */}
              <div className="da-panel-profile">
                <img src={selectedDoc.photo} alt={selectedDoc.name} className="da-panel-avatar" />
                <div>
                  <h3 className="da-panel-name">{selectedDoc.name}</h3>
                  <p className="da-panel-spec">{selectedDoc.specialization} · {selectedDoc.experience} yrs</p>
                  <span className={statusClass[selectedDoc.status]}>{selectedDoc.status}</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="da-panel-grid">
                <div className="da-panel-item">
                  <span className="da-panel-label">Email ID</span>
                  <span className="da-panel-value">{selectedDoc.email}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">Phone Number</span>
                  <span className="da-panel-value">{selectedDoc.mobile}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">Gender</span>
                  <span className="da-panel-value">{selectedDoc.gender}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">Date of Birth</span>
                  <span className="da-panel-value">{selectedDoc.dob}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">Qualification</span>
                  <span className="da-panel-value">{selectedDoc.qualification}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">Reg. Number</span>
                  <span className="da-panel-value">{selectedDoc.regNo}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">Hospital / Clinic</span>
                  <span className="da-panel-value">{selectedDoc.hospital}</span>
                </div>
                <div className="da-panel-item">
                  <span className="da-panel-label">City, State</span>
                  <span className="da-panel-value">{selectedDoc.city}, {selectedDoc.state}</span>
                </div>
              </div>

              {/* About */}
              <div className="da-panel-about">
                <span className="da-panel-label">About Doctor</span>
                <p className="da-panel-about-text">{selectedDoc.about}</p>
              </div>

              {/* Document */}
              <div className="da-panel-doc-row">
                <span className="da-panel-label">Uploaded Documents</span>
                <a href="#!" className="da-doc-link">📄 View License Document</a>
              </div>

              {/* Reject reason input — shown only when status is not already Rejected */}
              {selectedDoc.status !== "Rejected" && (
                <div className="da-panel-reject-section">
                  <span className="da-panel-label">Rejection Reason (required to reject)</span>
                  <textarea
                    className={"da-reject-textarea" + (rejectError ? " da-reject-err" : "")}
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={e => { setRejectReason(e.target.value); setRejectError(""); }}
                    rows={3}
                  />
                  {rejectError && <span className="da-reject-error">{rejectError}</span>}
                </div>
              )}

            </div>

            {/* Panel footer — action buttons */}
            <div className="da-panel-footer">
              <button className="da-btn da-btn-cancel" onClick={closePanel}>
                🔙 Cancel
              </button>
              {selectedDoc.status !== "Rejected" && (
                <button
                  className="da-btn da-btn-reject-lg"
                  disabled={loading === "reject"}
                  onClick={handleReject}
                >
                  {loading === "reject" ? "Rejecting..." : "❌ Reject"}
                </button>
              )}
              {selectedDoc.status !== "Approved" && (
                <button
                  className="da-btn da-btn-approve-lg"
                  disabled={loading === "approve"}
                  onClick={handleApprove}
                >
                  {loading === "approve" ? "Approving..." : "✅ Approve"}
                </button>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default DoctorApproval;
