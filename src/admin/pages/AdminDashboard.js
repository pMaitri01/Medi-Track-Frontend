import "../css/AdminDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ── Stat cards data ──
const stats = [
  { label: "Total Doctors",        value: 48,  icon: "🧑‍⚕️", color: "#2563eb", bg: "#eff6ff" },
  { label: "Total Patients",       value: 320, icon: "🧑‍🤝‍🧑", color: "#16a34a", bg: "#f0fdf4" },
  { label: "Total Appointments",   value: 215, icon: "📅",   color: "#9333ea", bg: "#faf5ff" },
  { label: "Pending Appointments", value: 34,  icon: "⏳",   color: "#ea580c", bg: "#fff7ed" },
];

// ── Recent appointments ──
const recentAppointments = [
  { id: 1, patient: "Ravi Shah",    doctor: "Dr. Amit Sharma",  date: "27 Mar 2026", status: "Pending"   },
  { id: 2, patient: "Neha Patel",   doctor: "Dr. Priya Patel",  date: "27 Mar 2026", status: "Confirmed" },
  { id: 3, patient: "Karan Mehta",  doctor: "Dr. Rahul Mehta",  date: "26 Mar 2026", status: "Completed" },
  { id: 4, patient: "Sonal Desai",  doctor: "Dr. Amit Sharma",  date: "26 Mar 2026", status: "Pending"   },
  { id: 5, patient: "Amit Trivedi", doctor: "Dr. Priya Patel",  date: "25 Mar 2026", status: "Cancelled" },
];

const statusClass = {
  Pending:   "ad-badge ad-badge-pending",
  Confirmed: "ad-badge ad-badge-confirmed",
  Completed: "ad-badge ad-badge-completed",
  Cancelled: "ad-badge ad-badge-cancelled",
};

// ── Chart data ──
const lineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{
    label: "Appointments",
    data: [18, 32, 27, 45, 38, 22, 30],
    borderColor: "#2563eb",
    backgroundColor: "rgba(37,99,235,0.08)",
    borderWidth: 2.5,
    pointBackgroundColor: "#2563eb",
    pointRadius: 4,
    tension: 0.4,
    fill: true,
  }],
};

const barData = {
  labels: ["Dr. Amit", "Dr. Priya", "Dr. Rahul", "Dr. Sneha", "Dr. Meera"],
  datasets: [{
    label: "Appointments",
    data: [52, 44, 38, 31, 27],
    backgroundColor: ["#2563eb","#16a34a","#9333ea","#ea580c","#0891b2"],
    borderRadius: 6,
    borderSkipped: false,
  }],
};

const pieData = {
  labels: ["New Patients", "Returning Patients"],
  datasets: [{
    data: [120, 200],
    backgroundColor: ["#2563eb", "#e2e8f0"],
    hoverBackgroundColor: ["#1d4ed8", "#cbd5e1"],
    borderWidth: 0,
  }],
};

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: "bottom", labels: { font: { size: 12 }, padding: 16 } },
    title:  { display: false },
    tooltip: { bodyFont: { size: 12 }, titleFont: { size: 12 } },
  },
  scales: title === "pie" ? {} : {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } }, beginAtZero: true },
  },
});

const AdminDashboard = () => (
  <div className="ad-page">

    {/* ── STAT CARDS ── */}
    <div className="ad-cards-grid">
      {stats.map((s) => (
        <div className="ad-card" key={s.label}>
          <div className="ad-card-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
          <div className="ad-card-info">
            <span className="ad-card-value" style={{ color: s.color }}>{s.value}</span>
            <span className="ad-card-label">{s.label}</span>
          </div>
        </div>
      ))}
    </div>

    {/* ── CHARTS ROW 1: Line (full width) ── */}
    <div className="ad-chart-card ad-chart-full">
      <div className="ad-chart-header">
        <h3 className="ad-chart-title">📈 Appointments per Day</h3>
        <span className="ad-chart-sub">Last 7 days</span>
      </div>
      <div className="ad-chart-body">
        <Line data={lineData} options={chartOptions("line")} />
      </div>
    </div>

    {/* ── CHARTS ROW 2: Bar + Pie ── */}
    <div className="ad-charts-row">
      <div className="ad-chart-card">
        <div className="ad-chart-header">
          <h3 className="ad-chart-title">🏆 Top Doctors</h3>
          <span className="ad-chart-sub">By appointments</span>
        </div>
        <div className="ad-chart-body">
          <Bar data={barData} options={chartOptions("bar")} />
        </div>
      </div>

      <div className="ad-chart-card">
        <div className="ad-chart-header">
          <h3 className="ad-chart-title">🧑‍🤝‍🧑 Patient Growth</h3>
          <span className="ad-chart-sub">New vs Returning</span>
        </div>
        <div className="ad-chart-body ad-chart-pie-body">
          <Pie data={pieData} options={chartOptions("pie")} />
        </div>
      </div>
    </div>

    {/* ── RECENT APPOINTMENTS ── */}
    <div className="ad-section">
      <div className="ad-section-header">
        <h2 className="ad-section-title">Recent Appointments</h2>
        <span className="ad-section-count">{recentAppointments.length} records</span>
      </div>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAppointments.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.patient}</td>
                <td>{row.doctor}</td>
                <td>{row.date}</td>
                <td><span className={statusClass[row.status]}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
);

export default AdminDashboard;
