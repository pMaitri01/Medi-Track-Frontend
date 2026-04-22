import "../css/AdminDashboard.css";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  // ✅ STATE
  const [statsData, setStatsData] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointment: 0,
  });
  const statusClass = {
    Pending: "ad-badge ad-badge-pending",
    Confirmed: "ad-badge ad-badge-confirmed",
    Completed: "ad-badge ad-badge-completed",
    Cancelled: "ad-badge ad-badge-cancelled",
  };
  // ✅ API CALL
  useEffect(() => {
    fetchDashboardData();
    fetchAppointments();
  }, []);

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
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }, credentials: "include",
        }
      );

      const data = await res.json();
      console.log("Appointments 👉", data);

      setAppointments(data);

    } catch (error) {
      console.error(error);
    }
  };

  // ✅ DYNAMIC STATS
  // const stats = [
  //   { label: "Total Doctors", value: statsData.totalDoctors },
  //   { label: "Total Patients", value: statsData.totalPatients },
  //   { label: "Total Appointments", value: statsData.totalAppointments },
  //   { label: "Pending Appointments", value: statsData.pendingAppointment },
  // ];
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
      <div className="ad-section">
        <div className="ad-section-header">
          <h2 className="ad-section-title">Recent Appointments</h2>
          <span className="ad-section-count">
            {appointments.length} records
          </span>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((row, index) => (
                <tr key={row._id}>
                  <td>{index + 1}</td>
                  <td>
                    {row.patient?.firstName
                      ? `${row.patient.firstName} ${row.patient.lastName}`
                      : "—"}
                  </td>

                  <td>
                    {row.doctor?.fullName || "—"}
                  </td>
                  <td>
                    {new Date(row.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>
                    <span className={`ad-type ${row.type ? row.type.toLowerCase() : "default"}`}>
                      {row.type || "N/A"}
                    </span>
                  </td>

                  <td>
                    <span className={statusClass[
                      row.status
                        ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
                        : "Pending"
                    ]}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;