import "../css/AdminDashboard.css";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [type, setType] = useState("daily");
  const [statusData, setStatusData] = useState([]);
  const [doctorStats, setDoctorStats] = useState({
    doctors: []
  });
  const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "yellow"];
  // ✅ STATE
  const [statsData, setStatsData] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointment: 0,
  });
  const statusClass = {
    Pending: "ad-badge ad-badge-pending",
    Cancelled: "ad-badge ad-badge-cancelled",
    Completed: "ad-badge ad-badge-completed",
    Rejected: "ad-badge ad-badge-rejected",
    Approved: "ad-badge ad-badge-Approved",
  };
  // ✅ API CALL
  useEffect(() => {
    fetchDashboardData();
    fetchStatusStats();
    fetchDoctorPerformance();
  }, []);
  useEffect(() => {
    fetchOverview();
  }, [type]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/dashboard`, // 👈 use your backend URL
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }, credentials: "include",
        }
      );

      const data = await res.json();
      console.log("API DATA 👉", data);

      setStatsData(data);

    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/overview?type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      // ✅ FORMAT LABELS HERE
      const formattedData = data.map(item => {
        let newLabel = item.label;

        // 📅 Monthly → Jan, Feb
        if (type === "monthly") {
          const [year, month] = item.label.split("-");
          const date = new Date(year, month - 1);
          newLabel = date.toLocaleString("en-IN", { month: "short" }); // Jan, Feb
        }

        // 📆 Daily → 18 May
        if (type === "daily") {
          const date = new Date(item.label);
          newLabel = date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
          });
        }

        // 📊 Yearly → keep as is (2026)
        if (type === "yearly") {
          newLabel = item.label;
        }

        // 📅 Weekly → already formatted
        return {
          ...item,
          label: newLabel,
        };
      });

      setOverviewData(formattedData);

    } catch (error) {
      console.error(error);
    }
  };
  const fetchStatusStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/status-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      // optional: format labels nicely
      const formatted = data.map(item => ({
        name: item.status,
        value: item.count
      }));

      setStatusData(formatted);

    } catch (error) {
      console.error(error);
    }
  };
  const fetchDoctorPerformance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/performance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      setDoctorStats(data);

    } catch (error) {
      console.error(error);
    }
  };
  const stats = [
    { label: "Total Doctors", value: statsData.totalDoctors, icon: "⚕️", color: "#2563eb", bg: "#eff6ff" },
    { label: "Total Patients", value: statsData.totalPatients, icon: "🧑‍🤝‍🧑", color: "#16a34a", bg: "#f0fdf4" },
    { label: "Total Appointments", value: statsData.totalAppointments, icon: "📅", color: "#9333ea", bg: "#faf5ff" },
    { label: "Pending Appointments", value: statsData.pendingAppointment, icon: "⏳", color: "#ea580c", bg: "#fff7ed" },
  ];

  return (
    <>
      <div className="ad-page">

        {/* ✅ DISPLAY COUNTS */}
        <div className="ad-cards-grid">
          {stats.map((s, index) => (
            <div className="ad-card" key={index}>

              {/* ICON */}
              <div
                className="ad-card-icon"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>

              {/* TEXT */}
              <div className="ad-card-info">
                <span
                  className="ad-card-value"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>

                <span className="ad-card-label">
                  {s.label}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>
      {/* <div className="ad-section"> */}
      <div className="ad-chart-card ad-chart-full">
        <div className="ad-chart-header">
          <h3 className="ad-chart-title">Appointment Overview</h3>
          <div style={{ marginBottom: "10px" }}>
            <select value={type} onChange={(e) => setType(e.target.value)} className="AppointmentOverviewSelect">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="ad-chart-body" style={{ height: 350, minHeight: 300 }}>
          {overviewData.length === 0 ? (
            <div>No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="adminDashboard-sec">
        <div className="ad-chart-card div-status">
          <div className="ad-chart-header">
            <h3 className="ad-chart-title">Appointment Status</h3>
          </div>

          {/* PIE CHART */}
          <div className="ad-status-pie">
            <PieChart width={280} height={260}>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>

          {/* STATUS LIST BELOW */}
          <div className="ad-status-list-vertical">
            {statusData.map((item, index) => (
              <div key={index} className="status-row">

                <div className="status-left">
                  <span
                    className="status-dot"
                    style={{ background: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>{item.name}</span>
                </div>

                <span className="status-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ad-chart-card ad-chart-full">
          <div className="ad-chart-header">
            <h3 className="ad-chart-title">Doctor Performance</h3>
            <span className="ad-chart-sub">Visual Ranking</span>
          </div>

          <div className="ad-chart-body">
            {!doctorStats?.doctors?.length ? (
              <p>No Data Available</p>
            ) : (
              doctorStats?.doctors?.map((doc, index) => {

                const name = doc.name || doc.fullName || doc.doctorName || "Unknown";

                const completed =
                  doc.completed ??
                  doc.completedAppointments ??
                  doc.completedCount ??
                  0;

                const rejected =
                  doc.rejected ??
                  doc.rejectedAppointments ??
                  doc.rejectedCount ??
                  0;

                const rating =
                  doc.rating ??
                  doc.averageRating ??
                  0;

                const percent = Math.min((completed / 10) * 100, 100);

                return (
                  <div key={index} className="doctor-bar-card">

                    <div className="doctor-bar-header">
                      <h4>#{index + 1} {name}</h4>
                      <span>⭐ {rating.toFixed(1)}</span>
                    </div>

                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="doctor-bar-details">

                      <div className="stat-item">
                        <span className="stat-value">✅ {completed}</span>
                        <span className="tooltip-text">Completed Appointments</span>
                      </div>

                      <div className="stat-item">
                        <span className="stat-value">❌ {rejected}</span>
                        <span className="tooltip-text">Rejected Appointments</span>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default AdminDashboard;