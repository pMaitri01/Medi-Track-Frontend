import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/MedicalRecords.css";
import UploadMedicalRecord from "./UploadMedicalRecord";
import defaultDoctorImg from "../images/user.png";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const TABS = ["All Records", "Report", "Scan", "Prescription"];
const DATES = ["All Time", "Last 7 Days", "Last Month"];
const TYPE_ICON = { Report: "🧪", Scan: "🩻", Prescription: "🏥" };
const TYPE_COLOR = {
  Scan: { bg: "#f3e8ff", color: "#6b21a8" },
  Report: { bg: "#e0f2fe", color: "#0369a1" },
  Prescription: { bg: "#d1fae5", color: "#065f46" },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const withinDays = (dateStr, days) => {
  const diff = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
  console.log("date:", dateStr, "diff:", diff, "days:", days, "result:", diff <= days);
  return diff <= days;
};

const withinLastCalendarMonth = (dateStr) => {
  if (!dateStr) return false;
  const record = new Date(dateStr);
  const now = new Date();
  
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  
  return record >= firstDayLastMonth && record <= lastDayLastMonth;
};

const capitalizeType = (type) => {
  if (!type) return "";
  if (type === "prescription") return "Prescription";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

function RecordCard({ record }) {
  const tc = TYPE_COLOR[record.type] || {};

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  return (
    <div className="MedRec-mr-card">
      <div className="MedRec-mr-card-top">
        <div className="MedRec-mr-card-icon" style={{ background: tc.bg, color: tc.color }}>
          {TYPE_ICON[record.type] || "📄"}
        </div>
        <div className="MedRec-mr-card-info">
          <h3 className="MedRec-mr-card-title">{record.title}</h3>
          <span className="MedRec-mr-type-tag" style={{ background: tc.bg, color: tc.color }}>
            {record.type}
          </span>
        </div>
      </div>

      <div className="MedRec-mr-card-meta">
        <span>📅 {formatDate(record.date)}</span>
        <span>👨‍⚕️ {record.doctor}</span>
      </div>

      <p className="MedRec-mr-card-desc">{record.description}</p>

      <div className="MedRec-mr-card-actions">
        <button
          className="MedRec-mr-btn MedRec-mr-btn--download"
          onClick={() => {
            if (record.file) {
              window.open(record.file, "_blank");
            } else {
              toast.info("No file available for this record");
            }
          }}
        >
          ⬇ Download
        </button>
         <button
    className="MedRec-mr-btn MedRec-mr-btn--ai"
    onClick={() => {
      setShowSummary(!showSummary);
    }}
    disabled={!record.file}
  >
    🧠 AI Summary
  </button>
      </div>
      {showSummary && (
  <div className="MedRec-mr-ai-box">
    {loading ? (
      <p className="MedRec-mr-ai-loading">⏳ Generating AI summary...</p>
    ) : summary ? (
      // ✅ Use ReactMarkdown here, not <p>
      <div className="MedRec-mr-ai-text">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    ) : (
      <button
        className="MedRec-mr-btn MedRec-mr-btn--generate"
        onClick={async () => {
          try {
            setLoading(true);
            const res = await fetch(
              `${process.env.REACT_APP_API_URL}/api/record/generate-summary/${record.id}`,
              { method: "POST", credentials: "include" }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to generate summary");
            setSummary(data.summary);
          } catch (err) {
            console.error(err);
            toast.error("Failed to generate summary");
          } finally {
            setLoading(false);
          }
        }}
      >
        Generate Summary
      </button>
    )}
  </div>
)}
    </div>
  );
}

function TimelineItem({ record }) {
  const tc = TYPE_COLOR[record.type] || {};
  return (
    <div className="MedRec-mr-timeline-item">
      <div className="MedRec-mr-timeline-dot" style={{ background: tc.color }} />
      <div className="MedRec-mr-timeline-card">
        <div className="MedRec-mr-timeline-header">
          <span className="MedRec-mr-type-tag" style={{ background: tc.bg, color: tc.color }}>
            {TYPE_ICON[record.type]} {record.type}
          </span>
          <span className="MedRec-mr-timeline-date">{formatDate(record.date)}</span>
        </div>
        <h4>{record.title}</h4>
        <p className="MedRec-mr-timeline-doctor">👨‍⚕️{record.doctor}</p>
        <p className="MedRec-mr-card-desc">{record.description}</p>
        <div className="MedRec-mr-card-actions">
          <button className="MedRec-mr-btn MedRec-mr-btn--download">⬇ Download</button>
        </div>
      </div>
    </div>
  );
}

export default function MedicalRecords() {
  const [activeTab, setActiveTab] = useState("All Records");
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [viewMode, setViewMode] = useState("card");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const patientId = user?._id;
        if (!patientId) return;

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/record/my`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (!res.ok) return;

        // ✅ SAFE CHECK FIRST
if (!data.records || !Array.isArray(data.records)) {
  setRecords([]);
  return;
}

        const formatted = data.records.map((r) => ({
          id: r._id,
          title: r.title,
          type: capitalizeType(r.type),
          date: r.date,
          doctor: r.doctor?.fullName ? `Dr. ${r.doctor.fullName}` : "Unknown",
          description: r.description,
          file: r.fileUrl || null,
        }));

        setRecords(formatted);
    //     const recordsArray = data.records || data || [];

    // setRecords(Array.isArray(recordsArray) ? recordsArray : []);
  } catch (error) {
    console.error("Fetch error:", error);
    setRecords([]);
  }
};
    fetchRecords();
  }, []);

  const filtered = records
    .filter((r) => {
      const tabMatch = activeTab === "All Records" || r.type === activeTab;
      const dateMatch =
        dateFilter === "All Time" ? true :
          dateFilter === "Last 7 Days" ? withinDays(r.date, 7) :
          dateFilter === "Last Month" ? withinLastCalendarMonth(r.date) :
          true;
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
    <div className="MedRec-mr-page">
      <Navbar />

      <main className="MedRec-mr-content">
        <div className="MedRec-mr-page-nav">
          <span className="MedRec-mr-page-icon">🗂</span>
          <h1 className="MedRec-mr-heading">Medical Records</h1>
          <button
            className="MedRec-mr-upload-btn"
            onClick={() => setShowUpload(true)}
          >
            ⬆ Upload Record
          </button>
        </div>

        <div className="MedRec-mr-filter-card">
          <div className="MedRec-mr-filter-top">
            <input
              className="MedRec-mr-search"
              type="text"
              placeholder="Search by title, doctor, or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="MedRec-mr-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              {DATES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="MedRec-mr-tabs-row">
          <div className="MedRec-mr-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`MedRec-mr-tab ${activeTab === tab ? "MedRec-mr-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="MedRec-mr-view-toggle">
            <button
              className={`MedRec-mr-toggle-btn ${viewMode === "card" ? "MedRec-mr-toggle-btn--active" : ""}`}
              onClick={() => setViewMode("card")}
            >
              ⊞ Cards
            </button>
            <button
              className={`MedRec-mr-toggle-btn ${viewMode === "timeline" ? "MedRec-mr-toggle-btn--active" : ""}`}
              onClick={() => setViewMode("timeline")}
            >
              ☰ Timeline
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="MedRec-mr-empty">No records found.</p>
        ) : viewMode === "card" ? (
          <div className="MedRec-mr-grid">
            {filtered.map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
          </div>
        ) : (
          <div className="MedRec-mr-timeline">
            {filtered.map((r) => (
              <TimelineItem key={r.id} record={r} />
            ))}
          </div>
        )}
      </main>
      {showUpload && (
        <UploadMedicalRecord onClose={() => setShowUpload(false)} />
      )}

    </div>
  );
}