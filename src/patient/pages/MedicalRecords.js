import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/MedicalRecords.css";
import defaultDoctorImg from "../images/user.png";

// ── Dummy Data ──────────────────────────────────────────────────────────────

const HEALTH_SUMMARY = [
  { icon: "🩸", label: "Blood Pressure", value: "120 / 80", unit: "mmHg", color: "#fee2e2", text: "#991b1b" },
  { icon: "🍬", label: "Sugar Level", value: "92", unit: "mg/dL", color: "#fef3c7", text: "#92400e" },
  { icon: "⚖️", label: "Weight", value: "72", unit: "kg", color: "#d1fae5", text: "#065f46" },
];

const TABS = ["All Records", "Lab", "Scan", "Visit"];
const DATES = ["All Time", "Last 7 Days", "Last Month"];
const TYPE_ICON = { Lab: "🧪", Scan: "🩻", Visit: "🏥" };
const TYPE_COLOR = {
  Lab: { bg: "#e0f2fe", color: "#0369a1" },
  Scan: { bg: "#f3e8ff", color: "#6b21a8" },
  Visit: { bg: "#d1fae5", color: "#065f46" },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const withinDays = (dateStr, days) => {
  const diff = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
  return diff <= days;
};
const capitalizeType = (type) => {
  if (!type) return "";
  if (type === "prescription") return "Visit"; // mapping fix
  return type.charAt(0).toUpperCase() + type.slice(1);
};
// ── RecordCard ───────────────────────────────────────────────────────────────
function RecordCard({ record }) {
  const tc = TYPE_COLOR[record.type] || {};
  return (
    <div className="mr-card">
      <div className="mr-card-top">
        <div className="mr-card-icon" style={{ background: tc.bg, color: tc.color }}>
          {TYPE_ICON[record.type] || "📄"}
        </div>
        <div className="mr-card-info">
          <h3 className="mr-card-title">{record.title}</h3>
          <span className="mr-type-tag" style={{ background: tc.bg, color: tc.color }}>
            {record.type}
          </span>
        </div>
      </div>

      <div className="mr-card-meta">
        <span>📅 {formatDate(record.date)}</span>
        <span>👨‍⚕️ {record.doctor}</span>
      </div>

      <p className="mr-card-desc">{record.description}</p>

      <div className="mr-card-actions">
        <button
          className="mr-btn mr-btn--download"
          onClick={() => {
            if (record.file) {
              window.open(record.file, "_blank");
            } else {
              alert("No file available");
            }
          }}
        >
          ⬇ Download
        </button>
      </div>
    </div>
  );
}

// ── TimelineItem ─────────────────────────────────────────────────────────────
function TimelineItem({ record }) {
  const tc = TYPE_COLOR[record.type] || {};
  return (
    <div className="mr-timeline-item">
      <div className="mr-timeline-dot" style={{ background: tc.color }} />
      <div className="mr-timeline-card">
        <div className="mr-timeline-header">
          <span className="mr-type-tag" style={{ background: tc.bg, color: tc.color }}>
            {TYPE_ICON[record.type]} {record.type}
          </span>
          <span className="mr-timeline-date">{formatDate(record.date)}</span>
        </div>
        <h4>{record.title}</h4>
        <p className="mr-timeline-doctor">👨‍⚕️ {record.doctor}</p>
        <p className="mr-card-desc">{record.description}</p>
        <div className="mr-card-actions">
          <button className="mr-btn mr-btn--download">⬇ Download</button>
        </div>
      </div>
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
// function RecordModal({ record, onClose }) {
//   if (!record) return null;
//   const tc = TYPE_COLOR[record.type] || {};
//   return (
//     <div className="mr-overlay" onClick={onClose}>
//       <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
//         <div className="mr-modal-header">
//           <div className="mr-modal-title-row">
//             <span className="mr-modal-icon" style={{ background: tc.bg, color: tc.color }}>
//               {TYPE_ICON[record.type]}
//             </span>
//             <h2>{record.title}</h2>
//           </div>
//           <button className="mr-modal-close" onClick={onClose}>✖</button>
//         </div>

//         <div className="mr-modal-body">
//           <div className="mr-modal-meta">
//             <div className="mr-modal-meta-item">
//               <span className="mr-modal-meta-label">Date</span>
//               <span>{formatDate(record.date)}</span>
//             </div>
//             <div className="mr-modal-meta-item">
//               <span className="mr-modal-meta-label">Doctor</span>
//               <span>{record.doctor}</span>
//             </div>
//             <div className="mr-modal-meta-item">
//               <span className="mr-modal-meta-label">Type</span>
//               <span className="mr-type-tag" style={{ background: tc.bg, color: tc.color }}>
//                 {record.type}
//               </span>
//             </div>
//           </div>

//           <div className="mr-modal-section">
//             <h4>Notes / Description</h4>
//             <p>{record.description}</p>
//           </div>

//           <div className="mr-modal-preview">
//             {record.file ? (
//               record.file.includes("/raw/upload/") || record.file.endsWith(".pdf") ? (
//                 <iframe
//                   src={`${record.file
//                     .replace("/raw/upload/", "/image/upload/")
//                     .replace("/upload/", "/upload/fl_attachment:false/")
//                     }#toolbar=0`}
//                   className="mr-pdf-preview"
//                 />
//               ) : (
//                 <img
//                   src={record.file}
//                   alt="Medical Record"
//                   className="mr-image-preview"
//                 />
//               )
//             ) : (
//               <p>No file attached</p>
//             )}
//           </div>
//         </div>

//         <div className="mr-modal-footer">
//           <button className="mr-btn mr-btn--download">⬇ Download</button>
//           <button className="mr-btn mr-btn--close" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MedicalRecords() {
  const [activeTab, setActiveTab] = useState("All Records");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [viewMode, setViewMode] = useState("card");   // "card" | "timeline"
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const patientId = user?._id;

        if (!patientId) {
          console.error("No patientId found");
          return;
        }

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/record/patient/${patientId}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error("Error:", data.message);
          return;
        }

        const formatted = data.records.map((r) => ({
          id: r._id,
          title: r.title,
          type: capitalizeType(r.type),
          date: r.date,
          doctor: r.doctorName || "Unknown",
          description: r.description,
          file: r.fileUrl || null, // ✅ direct use
        }));

        setRecords(formatted);

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchRecords();
  }, []);

  // ── Filter logic ──
  const filtered = records
    .filter((r) => {
      const tabMatch = activeTab === "All Records" || r.type === activeTab;
      const dateMatch =
        dateFilter === "All Time" ? true :
          dateFilter === "Last 7 Days" ? withinDays(r.date, 7) :
            withinDays(r.date, 30);
      const q = search.toLowerCase();
      const searchMatch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);
      return tabMatch && dateMatch && searchMatch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mr-page">
      <Navbar />

      <main className="mr-content">

        {/* ── Page heading bar ── */}
        <div className="mr-page-nav">
          <span className="mr-page-icon">🗂</span>
          <h1 className="mr-heading">Medical Records</h1>
          <button className="mr-upload-btn">⬆ Upload Record</button>
        </div>

        {/* ── Health Summary Cards ── */}
        <div className="mr-summary-grid">
          {HEALTH_SUMMARY.map((s) => (
            <div className="mr-summary-card" key={s.label}
              style={{ borderTop: `4px solid ${s.text}` }}>
              <span className="mr-summary-icon">{s.icon}</span>
              <div>
                <p className="mr-summary-label">{s.label}</p>
                <p className="mr-summary-value" style={{ color: s.text }}>
                  {s.value} <span className="mr-summary-unit">{s.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Filter bar ── */}
        <div className="mr-filter-card">
          <div className="mr-filter-top">
            <input
              className="mr-search"
              type="text"
              placeholder="Search by title, doctor, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="mr-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {DATES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* ── Tabs + View toggle ── */}
        <div className="mr-tabs-row">
          <div className="mr-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`mr-tab ${activeTab === tab ? "mr-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mr-view-toggle">
            <button
              className={`mr-toggle-btn ${viewMode === "card" ? "mr-toggle-btn--active" : ""}`}
              onClick={() => setViewMode("card")}
            >
              ⊞ Cards
            </button>
            <button
              className={`mr-toggle-btn ${viewMode === "timeline" ? "mr-toggle-btn--active" : ""}`}
              onClick={() => setViewMode("timeline")}
            >
              ☰ Timeline
            </button>
          </div>
        </div>

        {/* ── Records ── */}
        {filtered.length === 0 ? (
          <p className="mr-empty">No records found.</p>
        ) : viewMode === "card" ? (
          <div className="mr-grid">
            {filtered.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        ) : (
          <div className="mr-timeline">
            {filtered.map((r) => (
              <TimelineItem key={r.id} record={r} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
    </div>
  );
}
