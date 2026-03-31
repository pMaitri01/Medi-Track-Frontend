import { useState, useEffect } from "react";
import "../css/AppointmentManagement.css";

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const statusClass = {
  Pending:  "am-badge am-badge-pending",
  Accepted: "am-badge am-badge-accepted",
  Rejected: "am-badge am-badge-rejected",
};

// ── Map backend fields to UI fields ──
const mapAppointment = (a, i) => ({
  id:      a._id || i,
  patient: a.patientName || "—",
  doctor:  typeof a.doctor === "object" ? (a.doctor?.fullName || "—") : (a.doctor || "—"),
  date:    a.date  || "—",
  time:    a.time  || "—",
  status:  a.status || "Pending",   // default to Pending if not set
});

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [filter, setFilter]             = useState("All");

  // ── Fetch appointments from backend on mount ──
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch appointments.");
        }

        const data = await res.json();
        setAppointments(data.map(mapAppointment));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filtered = filter === "All"
    ? appointments
    : appointments.filter(a => a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "All"
      ? appointments.length
      : appointments.filter(a => a.status === f).length;
    return acc;
  }, {});

  // ── Loading state ──
  if (loading) {
    return (
      <div className="am-page">
        <div className="am-loading">
          <div className="am-spinner" />
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="am-page">
        <div className="am-error">❌ {error}</div>
      </div>
    );
  }

  return (
    <div className="am-page">

      {/* ── HEADER ── */}
      <div className="am-header">
        <div>
          <h2 className="am-title">Appointment Management</h2>
          <p className="am-subtitle">View all appointment records</p>
        </div>
        <div className="am-total-badge">
          Total: {appointments.length}
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="am-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={"am-filter-btn" + (filter === f ? " am-filter-active" : "")}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="am-filter-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="am-table-wrap">
        {filtered.length === 0 ? (
          <div className="am-empty">
            <span>📭</span>
            <p>No appointments found for "<strong>{filter}</strong>"</p>
          </div>
        ) : (
          <table className="am-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td className="am-patient">{a.patient}</td>
                  <td className="am-doctor">{a.doctor}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td><span className={statusClass[a.status]}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AppointmentManagement;
