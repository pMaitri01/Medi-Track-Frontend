import React, { useState,useEffect } from "react";
import "../css/AppointmentView.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

export default function AppointmentView() {
  const [open, setOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/doctor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const formatted = data.map((item) => ({
        id: item._id,
        name: item.patient?.name || "Unknown",
        time: item.time,
        date: new Date(item.date).toLocaleDateString(),
        doctor: "You",
        status: item.status || "Pending",
        reason: item.reason || "-",
        img: `https://i.pravatar.cc/150?u=${item._id}`,
      }));

      setAppointments(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    // Update UI after backend success
    const updated = appointments.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setAppointments(updated);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

  return (
    <>
      <DoctorNavbar open={open} setOpen={setOpen} />
      <DoctorHeader open={open} />

      <div
        className="appointment-container"
        style={{
          marginLeft: open ? "250px" : "100px",
          transition: "0.3s"
        }}
      >
        {/* Header */}
        <div className="list-header">
          <h2>📅 Appointment View</h2>
        </div>

        {/* Search + Filter */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name or patient ID"
            className="search-input"
          />

          <button
            className="filter-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filter {isFilterOpen ? "▲" : "▼"}
          </button>

          <button className="export-btn">Export</button>
        </div>

        {/* Filter Drawer */}
        {isFilterOpen && (
          <div className="filter-drawer">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Date</label>
                <input type="date" />
              </div>

              <div className="filter-group">
                <label>Doctor</label>
                <select>
                  <option>All Doctors</option>
                  <option>Dr. Smith</option>
                  <option>Dr. Johnson</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select>
                  <option>All</option>
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Time Slot</label>
                <select>
                  <option>All</option>
                  <option>9 - 10</option>
                  <option>10 - 11</option>
                  <option>11 - 12</option>
                  <option>12 - 1</option>
                  <option>2 - 3</option>
                  <option>3 - 4</option>
                  <option>4 - 5</option>
                </select>
              </div>
            </div>

            <div className="filter-footer">
              <button className="apply-btn">Apply</button>
              <button className="reset-btn">Reset</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Patient</th>
                <th>Time</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((item, index) => (
                <tr key={item.id}>
                  <td><input type="checkbox" /></td>

                  <td className="name-cell">
                    <img src={item.img} alt="" />
                    {item.name}
                  </td>

                  <td>{item.time}</td>
                  <td>{item.date}</td>
                  <td>{item.doctor}</td>

                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>{item.reason}</td>

                  <td className="action-cell">
                    {item.status === "Pending" && (
                      <>
                        <button
                          className="accept-btn"
                          onClick={() => handleStatus(item.id, "Accepted")}                        >
                          ✔ Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => handleStatus(item.id, "Rejected")}                        >
                          ✖ Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}