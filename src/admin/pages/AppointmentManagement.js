import { useState } from "react";
import "../css/AppointmentManagement.css";

const appointments = [
  { id: 1,  patient: "Ravi Shah",      doctor: "Dr. Amit Sharma",   date: "27 Mar 2026", time: "10:00 AM", status: "Pending"  },
  { id: 2,  patient: "Neha Patel",     doctor: "Dr. Priya Patel",   date: "27 Mar 2026", time: "11:00 AM", status: "Accepted" },
  { id: 3,  patient: "Karan Mehta",    doctor: "Dr. Rahul Mehta",   date: "26 Mar 2026", time: "12:00 PM", status: "Rejected" },
  { id: 4,  patient: "Sonal Desai",    doctor: "Dr. Amit Sharma",   date: "26 Mar 2026", time: "04:00 PM", status: "Pending"  },
  { id: 5,  patient: "Amit Trivedi",   doctor: "Dr. Sneha Joshi",   date: "25 Mar 2026", time: "10:00 AM", status: "Accepted" },
  { id: 6,  patient: "Pooja Sharma",   doctor: "Dr. Meera Shah",    date: "25 Mar 2026", time: "11:00 AM", status: "Pending"  },
  { id: 7,  patient: "Deepak Joshi",   doctor: "Dr. Priya Patel",   date: "24 Mar 2026", time: "02:00 PM", status: "Accepted" },
  { id: 8,  patient: "Rina Verma",     doctor: "Dr. Rahul Mehta",   date: "24 Mar 2026", time: "03:00 PM", status: "Rejected" },
  { id: 9,  patient: "Suresh Nair",    doctor: "Dr. Rohan Trivedi", date: "23 Mar 2026", time: "10:00 AM", status: "Pending"  },
  { id: 10, patient: "Kavita Mishra",  doctor: "Dr. Amit Sharma",   date: "23 Mar 2026", time: "04:00 PM", status: "Accepted" },
];

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const statusClass = {
  Pending:  "am-badge am-badge-pending",
  Accepted: "am-badge am-badge-accepted",
  Rejected: "am-badge am-badge-rejected",
};

const AppointmentManagement = () => {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? appointments
    : appointments.filter(a => a.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "All" ? appointments.length : appointments.filter(a => a.status === f).length;
    return acc;
  }, {});

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
