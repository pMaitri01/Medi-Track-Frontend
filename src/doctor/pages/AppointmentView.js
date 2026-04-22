import { useState, useEffect } from "react";
import "../css/AppointmentView.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";
import { useNavigate } from "react-router-dom";

export default function DoctorAppointmentView() {
  const [open, setOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const getDateTime = (dateStr, timeStr) => {
  const date = new Date(dateStr);

  if (timeStr) {
    let [time, modifier] = timeStr.split(" ");
    let [h, m] = time.split(":");

    let hours = parseInt(h, 10);
    let minutes = parseInt(m, 10);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
  }

  return date;
};

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
          id: item._id,
          patientId: item.patient?._id || item.patient,

          name:
            `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`.trim() ||
            "Unknown",

          email: item.patient?.email || "N/A",
          phone: item.patient?.mobile || "N/A",
          gender: item.patient?.gender || "N/A",

          time: item.time,

          // ✅ KEEP ORIGINAL DATE
          rawDate: item.date,

          // ✅ DISPLAY DATE
          date: new Date(item.date).toLocaleDateString(),

          status: item.status,
          type: item.type || item.appointmentType || "N/A",

          img: `https://ui-avatars.com/api/?name=${item.patient?.firstName || "U"}&background=random&color=fff`,
        }));

      const sorted = formatted.sort((a, b) => {
  return getDateTime(a.rawDate, a.time) - getDateTime(b.rawDate, b.time);
});
setAppointments(sorted);
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

const startVideoCall = (appointment) => {
  // Create unique room name using appointment id
  const roomName = `meditrack-${appointment.id}`;

  // Navigate to video call page
  navigate(`/video-call/${roomName}`, {
    state: {
      appointmentId: appointment.id,
      role: "doctor"
    }
  });
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
                  <th>Type</th>
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
                      <span className={`dappv-type ${item.type?.toLowerCase()}`}>
                        {item.type}
                      </span>
                    </td>
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
                    <p><b>Type:</b> {selectedAppointment.type}</p>
                    <p>
                      <b>Current Status:</b>{" "}
                      <span className={`dappv-status ${selectedAppointment.status.toLowerCase()}`}>
                        {selectedAppointment.status}
                      </span>
                    </p>
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
{/* ✅ If time reached → show Start Call button */}
{
  selectedAppointment.status?.toLowerCase() === "approved" &&
  selectedAppointment.type?.toLowerCase() === "video" && (
    // <button
    //   className="dappv-btn-startcall"
    //   onClick={() => startVideoCall(selectedAppointment)}
    // >
    //   Start Call
    // </button>
    <button  className="dappv-btn-startcall"
  onClick={() => navigate(`/video-call/${selectedAppointment._id}`)}
>
  Start Video Consultation
</button>
)}
                {selectedAppointment.status?.toLowerCase() === "approved" && (

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
