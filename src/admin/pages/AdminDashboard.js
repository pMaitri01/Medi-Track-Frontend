import "../css/AdminDashboard.css";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [type, setType] = useState("daily");
   const [growthData, setGrowthData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [approved, setApproved] = useState(0);
const [rejected, setRejected] = useState(0);
  const dailyGrowth = Array.isArray(growthData)
  ? growthData
  : growthData?.dailyGrowth || [];
const monthlyGrowth = growthData?.monthlyGrowth ?? [];
 
  const [behaviorData, setBehaviorData] = useState({
    pieData: [],
    barTimeData: [],
    cancellationData: [],
    dayData: []
  }); const [doctorStats, setDoctorStats] = useState({
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
    fetchPatientBehavior();
    fetchGrowth();
  }, []);
  useEffect(() => {
    fetchOverview();
  }, [type]);
   const getInsights = () => {
    const docs = doctorStats.doctors;

    if (!docs || docs.length === 0) return null;

    const getScore = (d) => {
      const c = d.completed ?? d.completedAppointments ?? 0;
      const r = d.rejected ?? d.rejectedAppointments ?? 0;
      const rt = d.rating ?? d.averageRating ?? 0;
      return (c * 2) + (rt * 10) - r;
    };

    const getSuccessRate = (d) => {
      const c = d.completed ?? 0;
      const r = d.rejected ?? 0;
      const total = c + r;
      return total > 0 ? (c / total) * 100 : 0;
    };

    const sortedByScore = [...docs].sort((a, b) => getScore(b) - getScore(a));

    return {
      topDoctor: sortedByScore[0],
      lowDoctor: sortedByScore[sortedByScore.length - 1],
      bestSuccess: [...docs].sort((a, b) => getSuccessRate(b) - getSuccessRate(a))[0],
      highRejected: [...docs].sort((a, b) => (b.rejected ?? 0) - (a.rejected ?? 0))[0],
    };
  };
const insights = useMemo(() => {
  const docs = doctorStats.doctors;

  if (!docs || docs.length === 0) return null;

  const getScore = (d) => {
    const c = d.completed ?? d.completedAppointments ?? 0;
    const r = d.rejected ?? d.rejectedAppointments ?? 0;
    const rt = d.rating ?? d.averageRating ?? 0;
    return (c * 2) + (rt * 10) - r;
  };

  const getSuccessRate = (d) => {
    const c = d.completed ?? 0;
    const r = d.rejected ?? 0;
    const total = c + r;
    return total > 0 ? (c / total) * 100 : 0;
  };

  const sortedByScore = [...docs].sort((a, b) => getScore(b) - getScore(a));

  return {
    topDoctor: sortedByScore[0],
    lowDoctor: sortedByScore[sortedByScore.length - 1],
    bestSuccess: [...docs].sort((a, b) => getSuccessRate(b) - getSuccessRate(a))[0],
    highRejected: [...docs].sort((a, b) => (b.rejected ?? 0) - (a.rejected ?? 0))[0],
  };
}, [doctorStats]);  const fetchDashboardData = async () => {
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
  const fetchPatientBehavior = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/behavior`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      setBehaviorData(transformData(data));

    } catch (err) {
      console.error(err);
    }
  };
  const transformData = (data) => {
    return {
      pieData: [
        { name: "Repeat", value: data.repeatPatients },
        { name: "New", value: data.newPatients }
      ],

      barTimeData: [
        { name: "Morning", value: data.peakTime === "Morning" ? 1 : 0 },
        { name: "Afternoon", value: data.peakTime === "Afternoon" ? 1 : 0 },
        { name: "Evening", value: data.peakTime === "Evening" ? 1 : 0 },
        { name: "Night", value: data.peakTime === "Night" ? 1 : 0 }
      ],

      cancellationData: [
        { name: "Cancelled", value: Number(data.cancellationRate) },
        { name: "Completed", value: 100 - data.cancellationRate }
      ],

      dayData: [
        { name: "Mon", value: data.mostActiveDay === "Monday" ? 1 : 0 },
        { name: "Tue", value: data.mostActiveDay === "Tuesday" ? 1 : 0 },
        { name: "Wed", value: data.mostActiveDay === "Wednesday" ? 1 : 0 },
        { name: "Thu", value: data.mostActiveDay === "Thursday" ? 1 : 0 },
        { name: "Fri", value: data.mostActiveDay === "Friday" ? 1 : 0 },
        { name: "Sat", value: data.mostActiveDay === "Saturday" ? 1 : 0 },
        { name: "Sun", value: data.mostActiveDay === "Sunday" ? 1 : 0 }
      ]
    };
  };
const fetchGrowth = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/appointment/growth`, // ✅ NEW API
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await res.json();

    setGrowthData(data.growth); // ✅ correct
 // ✅ now it's an array
    setApproved(data.approvedDoctors);
setRejected(data.rejectedDoctors);
  } catch (err) {
    console.error(err);
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

                const total = completed + rejected;

                // ✅ SUCCESS RATE
                const successRate =
                  total > 0 ? ((completed / total) * 100).toFixed(0) : 0;

                // ✅ PERFORMANCE SCORE (custom logic)
                const score =
                  (completed * 2) +        // weight completed
                  (rating * 10) -          // weight rating
                  (rejected * 1);          // penalty

                // ✅ NORMALIZE SCORE (for bar width)
                const maxScore = Math.max(
                  ...doctorStats.doctors.map(d => {
                    const c = d.completed ?? d.completedAppointments ?? 0;
                    const r = d.rejected ?? d.rejectedAppointments ?? 0;
                    const rt = d.rating ?? d.averageRating ?? 0;
                    return (c * 2) + (rt * 10) - r;
                  }),
                  1
                );

                const percent = Math.max((score / maxScore) * 100, 5);

                const getInsights = () => {
                  const docs = doctorStats.doctors;

                  if (!docs || docs.length === 0) return null;

                  const getScore = (d) => {
                    const c = d.completed ?? d.completedAppointments ?? 0;
                    const r = d.rejected ?? d.rejectedAppointments ?? 0;
                    const rt = d.rating ?? d.averageRating ?? 0;
                    return (c * 2) + (rt * 10) - r;
                  };

                  const getSuccessRate = (d) => {
                    const c = d.completed ?? 0;
                    const r = d.rejected ?? 0;
                    const total = c + r;
                    return total > 0 ? (c / total) * 100 : 0;
                  };

                  const sortedByScore = [...docs].sort((a, b) => getScore(b) - getScore(a));

                  const topDoctor = sortedByScore[0];
                  const lowDoctor = sortedByScore[sortedByScore.length - 1];

                  const bestSuccess = [...docs].sort(
                    (a, b) => getSuccessRate(b) - getSuccessRate(a)
                  )[0];

                  const highRejected = [...docs].sort(
                    (a, b) =>
                      (b.rejected ?? 0) - (a.rejected ?? 0)
                  )[0];

                  return {
                    topDoctor,
                    lowDoctor,
                    bestSuccess,
                    highRejected,
                  };
                };


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
                        <span className="tooltip-text">Completed</span>
                      </div>

                      <div className="stat-item">
                        <span className="stat-value">❌ {rejected}</span>
                        <span className="tooltip-text">Rejected</span>
                      </div>

                      {/* ✅ NEW: SUCCESS RATE */}
                      <div className="stat-item">
                        <span className="stat-value">📈 {successRate}%</span>
                        <span className="tooltip-text">Success Rate</span>
                      </div>

                      {/* ✅ NEW: SCORE */}
                      <div className="stat-item">
                        <span className="stat-value">🏆 {Math.round(score)}</span>
                        <span className="tooltip-text">Performance Score</span>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
            <div className="ad-chart-card ad-chart-full">
              <div className="ad-chart-header">
                <h3 className="ad-chart-title">Insights</h3>
                <span className="ad-chart-sub">Smart Summary</span>
              </div>

              {!insights ? (
                <p>No Insights Available</p>
              ) : (
                <div className="insights-grid">

                  {/* TOP DOCTOR */}
                  <div className="insight-card green">
                    <h4>👑 Top Doctor</h4>
                    <p>{insights.topDoctor?.name || insights.topDoctor?.doctorName}</p>
                  </div>

                  {/* BEST SUCCESS */}
                  <div className="insight-card blue">
                    <h4>📈 Best Success Rate</h4>
                    <p>{insights.bestSuccess?.name || insights.bestSuccess?.doctorName}</p>
                  </div>

                  {/* MOST REJECTED */}
                  <div className="insight-card red">
                    <h4>⚠️ High Rejection</h4>
                    <p>{insights.highRejected?.name || insights.highRejected?.doctorName}</p>
                  </div>

                  {/* LOW PERFORMANCE */}
                  <div className="insight-card orange">
                    <h4>📉 Needs Attention</h4>
                    <p>{insights.lowDoctor?.name || insights.lowDoctor?.doctorName}</p>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>

      </div>
      <div className="ad-chart-card ad-chart-full div-patient">
  
  {/* HEADER */}
  <div className="ad-chart-header">
    <h3 className="ad-chart-title">Patient Behavior Analysis</h3>
  </div>

  {/* BODY */}
  <div className="ad-chart-body">

    <div className="behavior-grid">

      {/* Peak Time */}
      <div className="behavior-card">
        <h4>🕒 Peak Time</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={behaviorData.barTimeData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Repeat vs New */}
      <div className="behavior-card">
        <h4>👥 Repeat vs New</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={behaviorData.pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={70}
              innerRadius={40}
              label
            >
              <Cell fill="#3b82f6" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Cancellation */}
      <div className="behavior-card">
        <h4>❌ Cancellation</h4>
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            innerRadius="60%"
            outerRadius="100%"
            data={behaviorData.cancellationData}
          >
            <RadialBar dataKey="value" cornerRadius={10} fill="#ef4444" />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Active Day */}
      <div className="behavior-card">
        <h4>📅 Active Day</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={behaviorData.dayData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>

  </div>
</div>
      <div className="ad-chart-card ad-chart-full div-growth">

  {/* HEADER */}
  <div className="ad-chart-header">
    <h3 className="ad-chart-title">System Growth Analysis</h3>
    <span className="ad-chart-sub">Daily Trends</span>
  </div>

  {/* BODY */}
  <div className="ad-chart-body">

    {/* MAIN CHART */}
    <div style={{ width: "100%", height: 320 }}>
   <ResponsiveContainer width="100%" height="100%">
  <LineChart data={dailyGrowth}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />

    <Line
      type="monotone"
      dataKey="patients"
      stroke="#22c55e"
      name="Patients"
    />

    <Line
      type="monotone"
      dataKey="doctors"
      stroke="#2563eb"
      name="Doctors"
    />
  </LineChart>
</ResponsiveContainer>
    </div>

    {/* STATS CARDS */}
   
      <div className="growth-grid">

  <div className="growth-card">
    <h4>📅 Total Days</h4>
    <p>{dailyGrowth?.length || 0}</p>
  </div>

  <div className="growth-card">
    <h4>✅ Approved Doctors</h4>
    <p>{approved}</p>
  </div>

  <div className="growth-card">
    <h4>❌ Rejected Doctors</h4>
    <p>{rejected}</p>
  </div>

</div>

  </div>
</div>
    </>
  );
};

export default AdminDashboard;