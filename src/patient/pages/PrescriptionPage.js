import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/PrescriptionPage.css";
import defaultDoctorImg from "../images/user.png";
import { generatePrescriptionPDF } from "../utils/generatePrescriptionPDF";

const TIMING_ORDER = ["Morning", "Afternoon", "Night"];
const TIMING_ICON = { Morning: "🌅", Afternoon: "🌇", Night: "🌙" };

const DATES = ["All Time", "Last 7 Days", "Last Month"];
 
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const withinDays = (dateStr, days) =>
  (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) <= days;

const medicineSummary = (medicines) =>
  `${medicines.length} medicine${medicines.length !== 1 ? "s" : ""} prescribed`;

const shortId = (id = "") => `RX-${String(id).slice(-8).toUpperCase()}`;

// ── PrescriptionCard ─────────────────────────────────────────────────────────
function PrescriptionCard({ rx, onView }) {
  const isActive = rx.pStatus === "active"; return (
    <div className="PrescriptionPage-rx-card">
      <div className="PrescriptionPage-rx-card-top">
        <img src={defaultDoctorImg} alt="doctor" className="PrescriptionPage-rx-doc-img" />
        <div className="PrescriptionPage-rx-card-info">
          <h3 className="PrescriptionPage-rx-doctor-name">
            {rx.doctor?.fullName ? `Dr. ${rx.doctor.fullName}` : "—"}
          </h3>
          <span className="PrescriptionPage-rx-spec-tag">{rx.doctor?.specialization}</span>        </div>
        {/* <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
        </span> */}
        <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
          {rx.pStatus}
        </span>
      </div>

      <div className="PrescriptionPage-rx-card-meta">
        <span>📅{formatDate(rx.createdAt)}</span>
        <span>🩺 {rx.diagnosis}</span>
      </div>

      <p className="PrescriptionPage-rx-medicine-summary">💊 {medicineSummary(rx.medicines)}</p>

      <div className="PrescriptionPage-rx-card-actions">
        <button className="PrescriptionPage-rx-btn rx-btn--view" onClick={() => onView(rx)}>
          👁 View Full Prescription
        </button>
        {/* <button className="PrescriptionPage-rx-btn rx-btn--download">⬇ Download</button> */}
          <button className="PrescriptionPage-rx-btn rx-btn--download" onClick={() => generatePrescriptionPDF(rx)}>
  Download
</button>
      </div>
    </div>
  );
}

// ── Medicine Table ────────────────────────────────────────────────────────────
function MedicineTable({ medicines }) {
  return (
    <div className="PrescriptionPage-rx-table-wrap">
      <table className="PrescriptionPage-rx-table">
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
    return <p className="PrescriptionPage-rx-empty">No schedule available</p>;
  }

  return (
    <div className="PrescriptionPage-rx-timing-groups">
      {Object.entries(groups).map(([slot, list]) => (
        <div key={slot} className="PrescriptionPage-rx-timing-group">
          <p className="PrescriptionPage-rx-timing-label">
            {TIMING_ICON[slot]} {slot}
          </p>
          <div className="PrescriptionPage-rx-timing-pills">
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
                <span key={`${m.name}-${i}`} className="PrescriptionPage-rx-timing-pill">
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
  if (!rx) return null;

  const handleDownload = () => {
    generatePrescriptionPDF(rx);
  };

  const isActive = rx.pStatus === "active";
  return (
    <div className="PrescriptionPage-rx-overlay" onClick={onClose}>
      <div className="PrescriptionPage-rx-modal" onClick={(e) => e.stopPropagation()}>
       
        {/* Header */}
        <div className="PrescriptionPage-rx-modal-header">
          <div className="PrescriptionPage-rx-modal-header-left">
            <img src={defaultDoctorImg} alt="doctor" className="PrescriptionPage-rx-modal-img" />
            <div>
              <h2>{rx.doctor ? `Dr. ${rx.doctor.fullName}` : ""}</h2>
              <p className="PrescriptionPage-rx-modal-spec">{rx.specialization}</p>
            </div>
          </div>
          <button className="PrescriptionPage-rx-modal-close" onClick={onClose}>✖</button>
        </div>

        {/* Meta strip */}
        <div className="PrescriptionPage-rx-modal-meta">
          <div className="PrescriptionPage-rx-modal-meta-item">
            <span className="PrescriptionPage-rx-modal-meta-label">Date</span>
            <span>{formatDate(rx.createdAt)}</span>
          </div>
          <div className="PrescriptionPage-rx-modal-meta-item">
            <span className="PrescriptionPage-rx-modal-meta-label">Diagnosis</span>
            <span>{rx.diagnosis}</span>
          </div>
          <div className="PrescriptionPage-rx-modal-meta-item">
            <span className="PrescriptionPage-rx-modal-meta-label">Status</span>
            <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
              {rx.pStatus}
            </span>
          </div>
        </div>

        <div className="PrescriptionPage-rx-modal-body">
          {/* Medicine table */}
          <div className="PrescriptionPage-rx-modal-section">
            <h4 className="PrescriptionPage-rx-modal-section-title">💊 Medicines</h4>
            <MedicineTable medicines={rx.medicines} />
          </div>

          {/* Timing groups */}
          <div className="PrescriptionPage-rx-modal-section">
            <h4 className="PrescriptionPage-rx-modal-section-title">⏰ Medicine Schedule</h4>
            <TimingGroups medicines={rx.medicines} />
          </div>

          {/* Doctor notes */}
          <div className="PrescriptionPage-rx-modal-section">
            <h4 className="PrescriptionPage-rx-modal-section-title">📝 Doctor Notes</h4>
            <div className="PrescriptionPage-rx-notes-box">
              {(rx.notes || "").split(". ").filter(Boolean).map((note, i) => (
                <p key={i} className="PrescriptionPage-rx-note-item">• {note.replace(/\.$/, "")}</p>
              ))}
            </div>
          </div>

          {/* Reminder toggle */}
        </div>

        {/* Footer */}
        <div className="PrescriptionPage-rx-modal-footer">
          <button className="PrescriptionPage-rx-btn rx-btn--download"
            onClick={handleDownload}
          >⬇ Download</button>
          <button className="PrescriptionPage-rx-btn rx-btn--close" onClick={onClose}>Close</button>
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
    <div className="PrescriptionPage-rx-page">
      <Navbar />

      <main className="PrescriptionPage-rx-content">

        {/* Page heading bar */}
        <div className="PrescriptionPage-rx-page-nav">
          <span className="PrescriptionPage-rx-page-icon">💊</span>
          <h1 className="PrescriptionPage-rx-heading">My Prescriptions</h1>
        </div>

        {/* Search + filter */}
        <div className="PrescriptionPage-rx-filter-card">
          <div className="PrescriptionPage-rx-filter-row">
            <input
              className="PrescriptionPage-rx-search"
              type="text"
              placeholder="Search by doctor, medicine, or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="PrescriptionPage-rx-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {DATES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="PrescriptionPage-rx-tabs">
          {["Active", "Past"].map((tab) => (
            <button
              key={tab}
              className={`PrescriptionPage-rx-tab-active-past ${activeTab === tab ? "rx-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Active" ? "🟢" : "⚪"} {tab} Prescriptions
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <p className="PrescriptionPage-rx-empty">No prescriptions found.</p>
        ) : (
          <div className="PrescriptionPage-rx-grid">
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


