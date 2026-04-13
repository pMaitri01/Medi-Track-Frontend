import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/PrescriptionPage.css";
import defaultDoctorImg from "../images/user.png";
import html2pdf from "html2pdf.js";

const TIMING_ORDER = ["Morning", "Afternoon", "Night"];
const TIMING_ICON = { Morning: "🌅", Afternoon: "🌇", Night: "🌙" };

const DATES = ["All Time", "Last 7 Days", "Last Month"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const withinDays = (dateStr, days) =>
  (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) <= days;

const medicineSummary = (medicines) =>
  `${medicines.length} medicine${medicines.length !== 1 ? "s" : ""} prescribed`;

// ── PrescriptionCard ─────────────────────────────────────────────────────────
function PrescriptionCard({ rx, onView }) {
  const isActive = rx.pStatus === "active"; return (
    <div className="rx-card">
      <div className="rx-card-top">
        <img src={defaultDoctorImg} alt="doctor" className="rx-doc-img" />
        <div className="rx-card-info">
          <h3 className="rx-doctor-name">{rx.doctor?.fullName}</h3>
          <span className="rx-spec-tag">{rx.doctor?.specialization}</span>        </div>
        {/* <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
        </span> */}
        <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
          {rx.pStatus}
        </span>
      </div>

      <div className="rx-card-meta">
        <span>📅{formatDate(rx.createdAt)}</span>
        <span>🩺 {rx.diagnosis}</span>
      </div>

      <p className="rx-medicine-summary">💊 {medicineSummary(rx.medicines)}</p>

      <div className="rx-card-actions">
        <button className="rx-btn rx-btn--view" onClick={() => onView(rx)}>
          👁 View Full Prescription
        </button>
        <button className="rx-btn rx-btn--download">⬇ Download</button>
      </div>
    </div>
  );
}

// ── Medicine Table ────────────────────────────────────────────────────────────
function MedicineTable({ medicines }) {
  return (
    <div className="rx-table-wrap">
      <table className="rx-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Timing</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m, i) => (
            <tr key={i}>
              <td>{m.name}</td>
              <td>{m.dosage}</td>
              <td>
                {Array.isArray(m.timing) && m.timing.length > 0 ? (
                  m.timing.map((t, i) => {
                    const slot =
                      typeof t === "string"
                        ? t
                        : t.timeOfDay || t.slot;

                    return (
                      <div key={i}>
                        {TIMING_ICON[slot] || ""} {slot}
                      </div>
                    );
                  })
                ) : (
                  "No timing"
                )}
              </td>  <td>{m.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Timing Groups ─────────────────────────────────────────────────────────────
function TimingGroups({ medicines }) {
  const groups = TIMING_ORDER.reduce((acc, slot) => {
    const list = medicines.filter(
      (m) =>
        m.timing &&
        m.timing.some((t) => {
          const s =
            typeof t === "string"
              ? t
              : t.timeOfDay || t.slot;

          return s === slot;
        })
    );
    if (list.length) acc[slot] = list;
    return acc;
  }, {});

  if (Object.keys(groups).length === 0) {
    return <p className="rx-empty">No schedule available</p>;
  }

  return (
    <div className="rx-timing-groups">
      {Object.entries(groups).map(([slot, list]) => (
        <div key={slot} className="rx-timing-group">
          <p className="rx-timing-label">
            {TIMING_ICON[slot]} {slot}
          </p>
          <div className="rx-timing-pills">
            {list.map((m, i) => {
              const timingObj = m.timing.find((t) => {
                const s =
                  typeof t === "string"
                    ? t
                    : t.timeOfDay || t.slot;

                return s === slot;
              });

              const food =
                timingObj?.intake
                  ? ` (${timingObj.intake.replace("_", " ")})`
                  : "";

              return (
                <span key={`${m.name}-${i}`} className="rx-timing-pill">
                  {m.name} · {m.dosage} {food}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function PrescriptionModal({ rx, onClose }) {
  const [reminder, setReminder] = useState(false);
  if (!rx) return null;
  const handleDownload = () => {
    const element = document.getElementById("pdf-content");

    if (!element) return;

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 10,
          filename: `${rx.patient?.fullName || "patient"}_prescription.pdf`,          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { format: "a4", orientation: "portrait" }
        })
        .from(element)
        .save();
    }, 300);
  };

  //   const handlePreview = () => {
  //   const element = document.getElementById("pdf-content");

  //   html2pdf()
  //     .set({
  //       margin: 10,
  //       filename: `preview.pdf`,
  //       image: { type: "jpeg", quality: 1 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { format: "a4", orientation: "portrait" }
  //     })
  //     .from(element)
  //     .outputPdf("dataurlnewwindow"); // 👈 THIS IS PREVIEW
  // };


  const isActive = rx.pStatus === "active";
  return (
    <div className="rx-overlay" onClick={onClose}>
      <div className="rx-modal" onClick={(e) => e.stopPropagation()}>
        <div id="pdf-content" className="pdf-wrapper pdf-hidden" >

          {/* 🔥 WATERMARK */}
          <div className="watermark">MediTrack</div>

          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ margin: 0 }}>MediTrack</h1>
            <p style={{ margin: "5px 0" }}>Digital HealthCare Prescription System</p>
            <hr />
          </div>

          {/* DOCTOR INFO */}
          <div style={{ marginBottom: "15px" }}>
            <h3>Doctor Details</h3>
            <p><b>Name:</b> Dr. {rx.doctor?.fullName}</p>
            <p><b>Specialization:</b> {rx.doctor?.specialization}</p>
            <p><b>Qualification:</b> MBBS (Add your field if available)</p>
          </div>

          <hr />

          {/* PATIENT INFO */}
          <div style={{ marginBottom: "15px" }}>
            <h3>Patient Details</h3>
            <p><b>Patient Name:</b> {rx.patient?.fullName}</p>    <p><b>Date:</b> {formatDate(rx.createdAt)}</p>
            <p><b>Prescription ID:</b> RX-{rx._id}</p>
          </div>

          <hr />

          {/* DIAGNOSIS */}
          <div style={{ marginBottom: "15px" }}>
            <h3>Diagnosis</h3>
            <p>{rx.diagnosis}</p>
          </div>

          <hr />

          {/* MEDICINE TABLE */}
          <h3>Medicines</h3>

          <table className="pdf-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Timing</th>
                <th>Duration</th>
              </tr>
            </thead>

            <tbody>
              {rx.medicines.map((m, i) => (
                <tr key={i}>
                  <td>{m.name}</td>
                  <td>{m.dosage}</td>
                  <td>
                    {m.timing?.map((t) => t.timeOfDay).join(", ")}
                  </td>
                  <td>{m.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />

          {/* TIMING FORMAT (HOSPITAL STYLE) */}
          <h3>Medicine Schedule</h3>

          {["Morning", "Afternoon", "Night"].map((slot) => (
            <div key={slot} style={{ marginBottom: "10px" }}>
              <b>{slot}:</b>
              <ul>
                {rx.medicines
                  .filter((m) =>
                    m.timing?.some((t) => t.timeOfDay === slot)
                  )
                  .map((m, i) => (
                    <li key={i}>
                      {m.name} - {m.dosage}
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <hr />

          {/* NOTES */}
          <h3>Doctor Notes</h3>
          <ul>
            {(rx.notes || "").split(". ").map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>

          {/* DISCLAIMER */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <p style={{ fontSize: "12px" }}>
              ⚠ This is a computer generated prescription and does not require signature.
            </p>
          </div>

        </div>
        {/* Header */}
        <div className="rx-modal-header">
          <div className="rx-modal-header-left">
            <img src={defaultDoctorImg} alt="doctor" className="rx-modal-img" />
            <div>
              <h2>{rx.doctor?.fullName}</h2>
              <p className="rx-modal-spec">{rx.specialization}</p>
            </div>
          </div>
          <button className="rx-modal-close" onClick={onClose}>✖</button>
        </div>

        {/* Meta strip */}
        <div className="rx-modal-meta">
          <div className="rx-modal-meta-item">
            <span className="rx-modal-meta-label">Date</span>
            <span>{formatDate(rx.createdAt)}</span>
          </div>
          <div className="rx-modal-meta-item">
            <span className="rx-modal-meta-label">Diagnosis</span>
            <span>{rx.diagnosis}</span>
          </div>
          <div className="rx-modal-meta-item">
            <span className="rx-modal-meta-label">Status</span>
            <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
              {rx.pStatus}
            </span>
          </div>
        </div>

        <div className="rx-modal-body">
          {/* Medicine table */}
          <div className="rx-modal-section">
            <h4 className="rx-modal-section-title">💊 Medicines</h4>
            <MedicineTable medicines={rx.medicines} />
          </div>

          {/* Timing groups */}
          <div className="rx-modal-section">
            <h4 className="rx-modal-section-title">⏰ Medicine Schedule</h4>
            <TimingGroups medicines={rx.medicines} />
          </div>

          {/* Doctor notes */}
          <div className="rx-modal-section">
            <h4 className="rx-modal-section-title">📝 Doctor Notes</h4>
            <div className="rx-notes-box">
              {(rx.notes || "").split(". ").filter(Boolean).map((note, i) => (
                <p key={i} className="rx-note-item">• {note.replace(/\.$/, "")}</p>
              ))}
            </div>
          </div>

          {/* Reminder toggle */}
        </div>

        {/* Footer */}
        <div className="rx-modal-footer">
          <button className="rx-btn rx-btn--download"
            onClick={handleDownload}
          >⬇ Download</button>
          <button className="rx-btn rx-btn--close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PrescriptionPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [modalRx, setModalRx] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/prescription/patient",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }, credentials: "include",
        }
      );

      const data = await res.json();

      setPrescriptions(data.data || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filtered = prescriptions.filter((rx) => {
    const tabMatch = rx.pStatus === activeTab.toLowerCase(); const dateMatch =
      dateFilter === "All Time" ? true :
        dateFilter === "Last 7 Days" ? withinDays(rx.createdAt, 7) :
          withinDays(rx.date, 30);
    const q = search.toLowerCase();
    const searchMatch =
      !q ||
      rx.doctor?.fullName?.toLowerCase().includes(q) ||
      rx.diagnosis.toLowerCase().includes(q) ||
      rx.medicines.some((m) => m.name.toLowerCase().includes(q));
    return tabMatch && dateMatch && searchMatch;
  })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="rx-page">
      <Navbar />

      <main className="rx-content">

        {/* Page heading bar */}
        <div className="rx-page-nav">
          <span className="rx-page-icon">💊</span>
          <h1 className="rx-heading">My Prescriptions</h1>
        </div>

        {/* Search + filter */}
        <div className="rx-filter-card">
          <div className="rx-filter-row">
            <input
              className="rx-search"
              type="text"
              placeholder="Search by doctor, medicine, or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rx-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {DATES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="rx-tabs">
          {["Active", "Past"].map((tab) => (
            <button
              key={tab}
              className={`rx-tab ${activeTab === tab ? "rx-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Active" ? "🟢" : "⚪"} {tab} Prescriptions
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <p className="rx-empty">No prescriptions found.</p>
        ) : (
          <div className="rx-grid">
            {filtered.map((rx) => (
              <PrescriptionCard key={rx._id} rx={rx} onView={setModalRx} />
            ))}
          </div>
        )}
      </main>

      <PrescriptionModal rx={modalRx} onClose={() => setModalRx(null)} />
    </div>
  );
}
