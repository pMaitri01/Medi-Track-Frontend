import { useState, useEffect } from "react";
import "../css/AppointmentView.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

export default function DoctorAppointmentView() {
  const [open, setOpen]                           = useState(true);
  const [appointments, setAppointments]           = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/doctor`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      const appointmentArray = Array.isArray(data) ? data : data.appointments || [];

      const formatted = appointmentArray
        .filter((item) => item.status?.toLowerCase() !== "completed")
        .map((item) => ({
          id:     item._id,
          name:   `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`.trim() || "Unknown",
          email:  item.patient?.email       || "N/A",
          phone:  item.patient?.phoneNumber || "N/A",
          gender: item.patient?.gender      || "N/A",
          time:   item.time,
          date:   new Date(item.date).toLocaleDateString(),
          status: item.status,
          reason: item.reason || "No reason provided",
          img:    `https://ui-avatars.com/api/?name=${item.patient?.firstName || "U"}&background=random&color=fff`,
        }));

      setAppointments(formatted);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <DoctorNavbar open={open} setOpen={setOpen} />
      <DoctorHeader open={open} />

      <div
        className="dappv-container"
        style={{ marginLeft: open ? "250px" : "100px", transition: "0.3s" }}
      >
        {/* Page heading */}
        <div className="dappv-header">
          <h2>📅 Appointment View</h2>
        </div>

        {/* Table */}
        <div className="dappv-table-wrapper">
          {loading ? (
            <div className="dappv-loading">Loading appointments...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedAppointment(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="dappv-name-cell">
                      <img
                        src={item.img}
                        alt=""
                        style={{ width: "30px", borderRadius: "50%", marginRight: "10px" }}
                      />
                      {item.name}
                    </td>
                    <td>{item.time}</td>
                    <td>{item.date}</td>
                    <td>
                      <span className={`dappv-status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {selectedAppointment && (
          <div
            className="dappv-modal-overlay"
            onClick={() => setSelectedAppointment(null)}
          >
            <div
              className="dappv-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dappv-modal-header">
                <h3>Appointment Details</h3>
                <button
                  className="dappv-close-btn"
                  onClick={() => setSelectedAppointment(null)}
                >
                  ×
                </button>
              </div>

              <div className="dappv-modal-body">
                <div className="dappv-detail-section">
                  <h4>👤 Patient Information</h4>
                  <div className="dappv-detail-grid">
                    <p><b>Full Name:</b> {selectedAppointment.name}</p>
                    <p><b>Email:</b>     {selectedAppointment.email}</p>
                    <p><b>Phone:</b>     {selectedAppointment.phone}</p>
                    <p><b>Gender:</b>    {selectedAppointment.gender}</p>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />

                <div className="dappv-detail-section">
                  <h4>📅 Appointment Information</h4>
                  <div className="dappv-detail-grid">
                    <p><b>Date:</b> {selectedAppointment.date}</p>
                    <p><b>Time:</b> {selectedAppointment.time}</p>
                    <p>
                      <b>Current Status:</b>{" "}
                      <span className={`dappv-status ${selectedAppointment.status.toLowerCase()}`}>
                        {selectedAppointment.status}
                      </span>
                    </p>
                    <p><b>Reason:</b> {selectedAppointment.reason}</p>
                  </div>
                </div>
              </div>

              <div className="dappv-modal-footer">
                {selectedAppointment.status?.toLowerCase() === "pending" && (
                  <>
                    <button
                      className="dappv-btn-approve"
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "approved")}
                    >
                      Approve Appointment
                    </button>
                    <button
                      className="dappv-btn-reject"
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {selectedAppointment.status?.toLowerCase() === "accepted" && (
                  <button
                    className="dappv-btn-complete"
                    onClick={() => handleStatusUpdate(selectedAppointment.id, "completed")}
                  >
                    Mark as Completed
                  </button>
                )}

                <button
                  className="dappv-btn-cancel"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
