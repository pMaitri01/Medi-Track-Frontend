import { useState, useEffect } from "react";
import "../css/DoctorApproval.css";

const SPECIALIZATIONS = ["All", "Cardiologist", "Neurologist", "Orthopedic", "Dermatologist", "Pediatrician", "Gynecologist"];
const PER_PAGE = 5;
const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];

const dummyDoctors = [
  { id: 1,  name: "Dr. Amit Sharma",   email: "amit@mail.com",   mobile: "9876543210", specialization: "Cardiologist",   experience: 12, qualification: "MBBS, MD", regNo: "MCI-2345", gender: "Male",   dob: "15 Mar 1980", hospital: "City Heart Clinic",    city: "Surat",      state: "Gujarat",     status: "Pending",  about: "Experienced cardiologist with 12 years in interventional cardiology.", photo: "https://randomuser.me/api/portraits/men/45.jpg"  },
  { id: 2,  name: "Dr. Priya Patel",   email: "priya@mail.com",  mobile: "9123456780", specialization: "Neurologist",    experience: 8,  qualification: "MBBS, DM", regNo: "MCI-3456", gender: "Female", dob: "22 Jul 1985", hospital: "NeuroLife Hospital",    city: "Ahmedabad",  state: "Gujarat",     status: "Pending",  about: "Specialist in neurological disorders and stroke management.", photo: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 3,  name: "Dr. Rahul Mehta",   email: "rahul@mail.com",  mobile: "9988776655", specialization: "Orthopedic",     experience: 5,  qualification: "MBBS, MS", regNo: "MCI-4567", gender: "Male",   dob: "10 Jan 1990", hospital: "BoneCare Center",       city: "Vadodara",   state: "Gujarat",     status: "Approved", about: "Orthopedic surgeon specializing in joint replacement.", photo: "https://randomuser.me/api/portraits/men/32.jpg"  },
  { id: 4,  name: "Dr. Sneha Joshi",   email: "sneha@mail.com",  mobile: "9871234560", specialization: "Dermatologist",  experience: 10, qualification: "MBBS, DVD", regNo: "MCI-5678", gender: "Female", dob: "05 Sep 1983", hospital: "SkinCare Clinic",       city: "Surat",      state: "Gujarat",     status: "Pending",  about: "Dermatologist with expertise in cosmetic and clinical dermatology.", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 5,  name: "Dr. Karan Desai",   email: "karan@mail.com",  mobile: "9765432100", specialization: "Pediatrician",   experience: 7,  qualification: "MBBS, DCH", regNo: "MCI-6789", gender: "Male",   dob: "18 Apr 1987", hospital: "KidsCare Hospital",     city: "Rajkot",     state: "Gujarat",     status: "Rejected", about: "Pediatrician focused on child health and immunization.", photo: "https://randomuser.me/api/portraits/men/55.jpg"  },
  { id: 6,  name: "Dr. Meera Shah",    email: "meera@mail.com",  mobile: "9654321098", specialization: "Gynecologist",   experience: 15, qualification: "MBBS, MS", regNo: "MCI-7890", gender: "Female", dob: "30 Nov 1978", hospital: "WomenCare Hospital",    city: "Ahmedabad",  state: "Gujarat",     status: "Pending",  about: "Senior gynecologist with 15 years in maternal and fetal medicine.", photo: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: 7,  name: "Dr. Rohan Trivedi", email: "rohan@mail.com",  mobile: "9543210987", specialization: "Cardiologist",   experience: 6,  qualification: "MBBS, MD", regNo: "MCI-8901", gender: "Male",   dob: "12 Jun 1989", hospital: "HeartCare Clinic",      city: "Gandhinagar", state: "Gujarat",    status: "Pending",  about: "Cardiologist specializing in preventive cardiology.", photo: "https://randomuser.me/api/portraits/men/22.jpg"  },
  { id: 8,  name: "Dr. Anita Verma",   email: "anita@mail.com",  mobile: "9432109876", specialization: "Neurologist",    experience: 9,  qualification: "MBBS, DM", regNo: "MCI-9012", gender: "Female", dob: "25 Feb 1984", hospital: "BrainCare Institute",   city: "Surat",      state: "Gujarat",     status: "Approved", about: "Neurologist with expertise in epilepsy and movement disorders.", photo: "https://randomuser.me/api/portraits/women/55.jpg" },
];

const statusClass = { Pending: "da-badge da-badge-pending", Approved: "da-badge da-badge-approved", Rejected: "da-badge da-badge-rejected" };

const DoctorApproval = () => {
  const [doctors, setDoctors]           = useState(dummyDoctors);
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]                 = useState(1);

  const [viewDoc, setViewDoc]         = useState(null);   // details modal
  const [confirmDoc, setConfirmDoc]   = useState(null);   // approve confirm
  const [rejectDoc, setRejectDoc]     = useState(null);   // reject modal
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [loading, setLoading]         = useState(null);   // id being processed
  const [toast, setToast]             = useState(null);   // { msg, type }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (doc) => { setConfirmDoc(doc); setViewDoc(null); };

  const confirmApprove = () => {
    setLoading(confirmDoc.id);
    setTimeout(() => {
      setDoctors(prev => prev.map(d => d.id === confirmDoc.id ? { ...d, status: "Approved" } : d));
      setLoading(null);
      setConfirmDoc(null);
      showToast(`Dr. ${confirmDoc.name.split(" ")[1]} approved successfully!`, "success");
    }, 1000);
  };

  const handleReject = (doc) => { setRejectDoc(doc); setRejectReason(""); setRejectError(""); setViewDoc(null); };

  const confirmReject = () => {
    if (!rejectReason.trim()) { setRejectError("Rejection reason is required."); return; }
    setLoading(rejectDoc.id);
    setTimeout(() => {
      setDoctors(prev => prev.map(d => d.id === rejectDoc.id ? { ...d, status: "Rejected" } : d));
      setLoading(null);
      setRejectDoc(null);
      showToast(`Dr. ${rejectDoc.name.split(" ")[1]} has been rejected.`, "reject");
    }, 1000);
  };

  // ── Filtering — status only ──
  const filtered = doctors.filter(d =>
    statusFilter === "All" || d.status === statusFilter
  );

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
              <p>No doctors found matching your filters.</p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((doc, i) => (
                  <tr key={doc.id}>
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
                    <td>
                      <div className="da-actions">
                        <button className="da-btn da-btn-view" onClick={() => setViewDoc(doc)}>View</button>
                        {doc.status !== "Approved" && (
                          <button className="da-btn da-btn-approve"
                            disabled={loading === doc.id}
                            onClick={() => handleApprove(doc)}>
                            {loading === doc.id ? "..." : "Approve"}
                          </button>
                        )}
                        {doc.status !== "Rejected" && (
                          <button className="da-btn da-btn-reject"
                            disabled={loading === doc.id}
                            onClick={() => handleReject(doc)}>
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="da-pagination">
            <span>Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
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

      {/* ── DETAILS MODAL ── */}
      {viewDoc && (
        <div className="da-overlay" onClick={() => setViewDoc(null)}>
          <div className="da-modal" onClick={e => e.stopPropagation()}>
            <div className="da-modal-header">
              <h2>Doctor Details</h2>
              <button className="da-modal-close" onClick={() => setViewDoc(null)}>✕</button>
            </div>
            <div className="da-modal-body">
              <div className="da-modal-profile">
                <img src={viewDoc.photo} alt={viewDoc.name} className="da-modal-avatar" />
                <div className="da-modal-profile-info">
                  <h3>{viewDoc.name}</h3>
                  <p>{viewDoc.specialization} · {viewDoc.experience} yrs experience</p>
                  <span className={statusClass[viewDoc.status]}>{viewDoc.status}</span>
                </div>
              </div>

              <div className="da-info-grid">
                <div className="da-info-item"><span className="da-info-label">Gender</span><span className="da-info-value">{viewDoc.gender}</span></div>
                <div className="da-info-item"><span className="da-info-label">Date of Birth</span><span className="da-info-value">{viewDoc.dob}</span></div>
                <div className="da-info-item"><span className="da-info-label">Email</span><span className="da-info-value">{viewDoc.email}</span></div>
                <div className="da-info-item"><span className="da-info-label">Mobile</span><span className="da-info-value">{viewDoc.mobile}</span></div>
                <div className="da-info-item"><span className="da-info-label">Qualification</span><span className="da-info-value">{viewDoc.qualification}</span></div>
                <div className="da-info-item"><span className="da-info-label">Reg. Number</span><span className="da-info-value">{viewDoc.regNo}</span></div>
                <div className="da-info-item"><span className="da-info-label">Hospital / Clinic</span><span className="da-info-value">{viewDoc.hospital}</span></div>
                <div className="da-info-item"><span className="da-info-label">Location</span><span className="da-info-value">{viewDoc.city}, {viewDoc.state}</span></div>
                <div className="da-info-item da-info-full">
                  <span className="da-info-label">Documents</span>
                  <a href="#!" className="da-doc-link">📄 View License Document</a>
                </div>
              </div>

              <div className="da-about-box">
                <h4>About</h4>
                <p>{viewDoc.about}</p>
              </div>
            </div>

            <div className="da-modal-footer">
              <button className="da-btn da-btn-cancel" onClick={() => setViewDoc(null)}>Close</button>
              {viewDoc.status !== "Approved" && (
                <button className="da-btn da-btn-approve" onClick={() => handleApprove(viewDoc)}>✅ Approve</button>
              )}
              {viewDoc.status !== "Rejected" && (
                <button className="da-btn da-btn-reject" onClick={() => handleReject(viewDoc)}>❌ Reject</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVE CONFIRM ── */}
      {confirmDoc && (
        <div className="da-overlay">
          <div className="da-confirm-modal">
            <div className="da-confirm-icon">✅</div>
            <h3>Approve Doctor?</h3>
            <p>Are you sure you want to approve <strong>{confirmDoc.name}</strong>? They will be able to receive patient appointments.</p>
            <div className="da-confirm-actions">
              <button className="da-btn da-btn-cancel" onClick={() => setConfirmDoc(null)}>Cancel</button>
              <button className="da-btn da-btn-confirm-approve"
                disabled={loading === confirmDoc.id}
                onClick={confirmApprove}>
                {loading === confirmDoc.id ? "Approving..." : "Yes, Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectDoc && (
        <div className="da-overlay">
          <div className="da-reject-modal">
            <h3>❌ Reject Doctor</h3>
            <p>Provide a reason for rejecting <strong>{rejectDoc.name}</strong>.</p>
            <textarea
              className="da-reject-textarea"
              placeholder="Enter rejection reason (required)..."
              value={rejectReason}
              onChange={e => { setRejectReason(e.target.value); setRejectError(""); }}
            />
            {rejectError && <span className="da-reject-error">{rejectError}</span>}
            <div className="da-reject-actions">
              <button className="da-btn da-btn-cancel" onClick={() => setRejectDoc(null)}>Cancel</button>
              <button className="da-btn da-btn-confirm-reject"
                disabled={loading === rejectDoc.id}
                onClick={confirmReject}>
                {loading === rejectDoc.id ? "Rejecting..." : "Submit Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorApproval;
