import { useState, useEffect } from "react";
import "../css/DoctorApproval.css";
import userpic from "../../doctor/images/user.png"

const PER_PAGE    = 5;
const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];

const statusClass = {
  pending:  "da-badge da-badge-pending",
  approved: "da-badge da-badge-approved",
  rejected: "da-badge da-badge-rejected",
};

const DoctorApproval = () => {
  const [doctors, setDoctors] = useState([]);
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
  const handleApprove = async () => {
  try {
    setLoading("approve");

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/doctor/${selectedDoc.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "approved" }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setDoctors(prev =>
        prev.map(d =>
          d.id === selectedDoc.id ? { ...d, status: "Approved" } : d
        )
      );

      showToast(`${selectedDoc.name} approved successfully!`, "success");
      closePanel();
    } else {
      showToast(data.message || "Failed to approve doctor", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Something went wrong", "error");
  } finally {
    setLoading(null);
  }
};

  // ── Reject ──
  // const handleReject = () => {
  //   if (!rejectReason.trim()) { setRejectError("Rejection reason is required."); return; }
  //   setLoading("reject");
  //   setTimeout(() => {
  //     setDoctors(prev => prev.map(d =>
  //       d.id === selectedDoc.id ? { ...d, status: "Rejected" } : d
  //     ));
  //     setLoading(null);
  //     showToast(`${selectedDoc.name} has been rejected.`, "reject");
  //     closePanel();
  //   }, 1000);
  // };
  const handleReject = async () => {
  if (!rejectReason.trim()) {
    setRejectError("Rejection reason is required.");
    return;
  }

  try {
    setLoading("reject");

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/doctor/${selectedDoc.id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: "rejected",
         // rejectionReason: rejectReason, // optional (if backend supports)
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      // ✅ update UI
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === selectedDoc.id ? { ...d, status: "rejected" } : d
        )
      );

      showToast(`${selectedDoc.name} has been rejected.`, "error");
      closePanel();
    } else {
      showToast(data.message || "Failed to reject doctor", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Something went wrong", "error");
  } finally {
    setLoading(null);
  }
};

  // ── Filter + paginate ──
  const filtered = doctors.filter(d => d.status === "pending");
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [statusFilter]);

  const counts = {
    total:    doctors.length,
    pending:  doctors.filter(d => d.status === "Pending").length,
    approved: doctors.filter(d => d.status === "Approved").length,
  };
  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/all`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        const formatted = data.doctors.map(doc => ({
          id: doc._id,
          name: doc.fullName ? `Dr. ${doc.fullName}` : "",
          email: doc.email,
          mobile: doc.mobile,
          specialization: doc.specialization,
          experience: doc.experience,
          qualification: doc.qualification,
          regNo: doc.licenseNumber,
          gender: doc.gender,
          dob: doc.dob,
          hospital: doc.clinicName,
          city: doc.city,
          state: doc.state,
          about: doc.about,
          status: (doc.status || "pending").toLowerCase(),
          photo: `${userpic}` // optional
        }));

        setDoctors(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchDoctors();
}, []);
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
