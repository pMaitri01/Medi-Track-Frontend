import { useState } from "react";
import Navbar from "../components/Navbar";
import "../css/PrescriptionPage.css";
import defaultDoctorImg from "../images/user.png";

// ── Dummy Data ──────────────────────────────────────────────────────────────
const DUMMY_PRESCRIPTIONS = [
  {
    id: "1",
    doctorName: "Dr. Aisha Sharma",
    specialization: "Cardiologist",
    date: "2026-04-01",
    diagnosis: "Hypertension",
    status: "Active",
    notes: "Avoid salty food. Drink plenty of water. Take medicines on time.",
    medicines: [
      { name: "Amlodipine",   dosage: "5mg",  timing: ["Morning"],           duration: "30 days" },
      { name: "Telmisartan",  dosage: "40mg", timing: ["Night"],             duration: "30 days" },
      { name: "Aspirin",      dosage: "75mg", timing: ["Morning"],           duration: "30 days" },
    ],
  },
  {
    id: "2",
    doctorName: "Dr. Ravi Mehta",
    specialization: "Dermatologist",
    date: "2026-03-18",
    diagnosis: "Eczema",
    status: "Active",
    notes: "Apply cream after bath. Avoid scratching. Keep skin moisturised.",
    medicines: [
      { name: "Cetirizine",   dosage: "10mg", timing: ["Night"],             duration: "14 days" },
      { name: "Betamethasone",dosage: "0.1%", timing: ["Morning", "Night"],  duration: "14 days" },
    ],
  },
  {
    id: "3",
    doctorName: "Dr. Priya Nair",
    specialization: "Neurologist",
    date: "2026-02-10",
    diagnosis: "Migraine",
    status: "Past",
    notes: "Rest in a dark room during attacks. Avoid screen time.",
    medicines: [
      { name: "Sumatriptan",  dosage: "50mg", timing: ["Morning"],           duration: "7 days"  },
      { name: "Propranolol",  dosage: "20mg", timing: ["Morning", "Night"],  duration: "21 days" },
    ],
  },
  {
    id: "4",
    doctorName: "Dr. Suresh Kumar",
    specialization: "Orthopedic",
    date: "2026-01-05",
    diagnosis: "Lower Back Pain",
    status: "Past",
    notes: "Avoid heavy lifting. Do prescribed physiotherapy exercises daily.",
    medicines: [
      { name: "Ibuprofen",    dosage: "400mg",timing: ["Morning","Afternoon","Night"], duration: "5 days" },
      { name: "Muscle Relax", dosage: "500mg",timing: ["Night"],             duration: "5 days"  },
      { name: "Calcium",      dosage: "500mg",timing: ["Morning"],           duration: "60 days" },
    ],
  },
  {
    id: "5",
    doctorName: "Dr. Meena Iyer",
    specialization: "Gynecologist",
    date: "2025-12-20",
    diagnosis: "Iron Deficiency Anaemia",
    status: "Past",
    notes: "Eat iron-rich food. Avoid tea/coffee with meals.",
    medicines: [
      { name: "Ferrous Sulphate", dosage: "200mg", timing: ["Morning","Night"], duration: "45 days" },
      { name: "Folic Acid",       dosage: "5mg",   timing: ["Morning"],         duration: "45 days" },
    ],
  },
];

const TIMING_ORDER = ["Morning", "Afternoon", "Night"];
const TIMING_ICON  = { Morning: "🌅", Afternoon: "🌇", Night: "🌙" };

const DATES  = ["All Time", "Last 7 Days", "Last Month"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const withinDays = (dateStr, days) =>
  (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) <= days;

const medicineSummary = (medicines) =>
  `${medicines.length} medicine${medicines.length !== 1 ? "s" : ""} prescribed`;

// ── PrescriptionCard ─────────────────────────────────────────────────────────
function PrescriptionCard({ rx, onView }) {
  const isActive = rx.status === "Active";
  return (
    <div className="rx-card">
      <div className="rx-card-top">
        <img src={defaultDoctorImg} alt="doctor" className="rx-doc-img" />
        <div className="rx-card-info">
          <h3 className="rx-doctor-name">{rx.doctorName}</h3>
          <span className="rx-spec-tag">{rx.specialization}</span>
        </div>
        <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
          {rx.status}
        </span>
      </div>

      <div className="rx-card-meta">
        <span>📅 {formatDate(rx.date)}</span>
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
              <td>{m.timing.map((t) => `${TIMING_ICON[t]} ${t}`).join("  ")}</td>
              <td>{m.duration}</td>
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
    const list = medicines.filter((m) => m.timing.includes(slot));
    if (list.length) acc[slot] = list;
    return acc;
  }, {});

  return (
    <div className="rx-timing-groups">
      {Object.entries(groups).map(([slot, list]) => (
        <div key={slot} className="rx-timing-group">
          <p className="rx-timing-label">{TIMING_ICON[slot]} {slot}</p>
          <div className="rx-timing-pills">
            {list.map((m, i) => (
              <span key={i} className="rx-timing-pill">{m.name} · {m.dosage}</span>
            ))}
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
  const isActive = rx.status === "Active";

  return (
    <div className="rx-overlay" onClick={onClose}>
      <div className="rx-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="rx-modal-header">
          <div className="rx-modal-header-left">
            <img src={defaultDoctorImg} alt="doctor" className="rx-modal-img" />
            <div>
              <h2>{rx.doctorName}</h2>
              <p className="rx-modal-spec">{rx.specialization}</p>
            </div>
          </div>
          <button className="rx-modal-close" onClick={onClose}>✖</button>
        </div>

        {/* Meta strip */}
        <div className="rx-modal-meta">
          <div className="rx-modal-meta-item">
            <span className="rx-modal-meta-label">Date</span>
            <span>{formatDate(rx.date)}</span>
          </div>
          <div className="rx-modal-meta-item">
            <span className="rx-modal-meta-label">Diagnosis</span>
            <span>{rx.diagnosis}</span>
          </div>
          <div className="rx-modal-meta-item">
            <span className="rx-modal-meta-label">Status</span>
            <span className={`rx-badge ${isActive ? "rx-badge--active" : "rx-badge--past"}`}>
              {rx.status}
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
              {rx.notes.split(". ").filter(Boolean).map((note, i) => (
                <p key={i} className="rx-note-item">• {note.replace(/\.$/, "")}</p>
              ))}
            </div>
          </div>

          {/* Reminder toggle */}
          {isActive && (
            <div className="rx-reminder-row">
              <span className="rx-reminder-label">
                🔔 {reminder ? "Reminder Active" : "Set Reminder"}
              </span>
              <button
                className={`rx-toggle ${reminder ? "rx-toggle--on" : ""}`}
                onClick={() => setReminder((r) => !r)}
                aria-label="Toggle reminder"
              >
                <span className="rx-toggle-knob" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rx-modal-footer">
          <button className="rx-btn rx-btn--download">⬇ Download</button>
          <button className="rx-btn rx-btn--close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PrescriptionPage() {
  const [activeTab,   setActiveTab]   = useState("Active");
  const [search,      setSearch]      = useState("");
  const [dateFilter,  setDateFilter]  = useState("All Time");
  const [modalRx,     setModalRx]     = useState(null);

  const filtered = DUMMY_PRESCRIPTIONS
    .filter((rx) => {
      const tabMatch  = rx.status === activeTab;
      const dateMatch =
        dateFilter === "All Time"    ? true :
        dateFilter === "Last 7 Days" ? withinDays(rx.date, 7) :
        withinDays(rx.date, 30);
      const q = search.toLowerCase();
      const searchMatch =
        !q ||
        rx.doctorName.toLowerCase().includes(q) ||
        rx.diagnosis.toLowerCase().includes(q)  ||
        rx.medicines.some((m) => m.name.toLowerCase().includes(q));
      return tabMatch && dateMatch && searchMatch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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
              <PrescriptionCard key={rx.id} rx={rx} onView={setModalRx} />
            ))}
          </div>
        )}
      </main>

      <PrescriptionModal rx={modalRx} onClose={() => setModalRx(null)} />
    </div>
  );
}
