// import React, { useState,useEffect } from "react";
// import "../css/AppointmentView.css";
// import DoctorHeader from "../components/DoctorHeader";
// import DoctorNavbar from "../components/DoctorNavbar";

// export default function AppointmentView() {
//   const [open, setOpen] = useState(true);
//   const [appointments, setAppointments] = useState([]);  
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   useEffect(() => {
//     fetchAppointments();
//   }, []);
  
//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/doctor`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       const formatted = data.map((item) => ({
//         id: item._id,
//         name: item.patient?.name || "Unknown",
//         time: item.time,
//         date: new Date(item.date).toLocaleDateString(),
//         doctor: "You",
//         status: item.status || "Pending",
//         reason: item.reason || "-",
//         img: `https://i.pravatar.cc/150?u=${item._id}`,
//       }));

//       setAppointments(formatted);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleStatus = async (id, newStatus) => {
//   try {
//     const token = localStorage.getItem("token");

//     await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ status: newStatus }),
//     });

//     // Update UI after backend success
//     const updated = appointments.map((item) =>
//       item.id === id ? { ...item, status: newStatus } : item
//     );

//     setAppointments(updated);
//   } catch (error) {
//     console.error("Error updating status:", error);
//   }
// };

//   return (
//     <>
//       <DoctorNavbar open={open} setOpen={setOpen} />
//       <DoctorHeader open={open} />

//       <div
//         className="appointment-container"
//         style={{
//           marginLeft: open ? "250px" : "100px",
//           transition: "0.3s"
//         }}
//       >
//         {/* Header */}
//         <div className="list-header">
//           <h2>📅 Appointment View</h2>
//         </div>

//         {/* Search + Filter */}
//         <div className="filter-bar">
//           <input
//             type="text"
//             placeholder="Search by name or patient ID"
//             className="search-input"
//           />

//           <button
//             className="filter-btn"
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//           >
//             Filter {isFilterOpen ? "▲" : "▼"}
//           </button>

//           <button className="export-btn">Export</button>
//         </div>

//         {/* Filter Drawer */}
//         {isFilterOpen && (
//           <div className="filter-drawer">
//             <div className="filter-grid">
//               <div className="filter-group">
//                 <label>Date</label>
//                 <input type="date" />
//               </div>

//               <div className="filter-group">
//                 <label>Doctor</label>
//                 <select>
//                   <option>All Doctors</option>
//                   <option>Dr. Smith</option>
//                   <option>Dr. Johnson</option>
//                 </select>
//               </div>

//               <div className="filter-group">
//                 <label>Status</label>
//                 <select>
//                   <option>All</option>
//                   <option>Pending</option>
//                   <option>Accepted</option>
//                   <option>Rejected</option>
//                 </select>
//               </div>

//               <div className="filter-group">
//                 <label>Time Slot</label>
//                 <select>
//                   <option>All</option>
//                   <option>9 - 10</option>
//                   <option>10 - 11</option>
//                   <option>11 - 12</option>
//                   <option>12 - 1</option>
//                   <option>2 - 3</option>
//                   <option>3 - 4</option>
//                   <option>4 - 5</option>
//                 </select>
//               </div>
//             </div>

//             <div className="filter-footer">
//               <button className="apply-btn">Apply</button>
//               <button className="reset-btn">Reset</button>
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         <div className="table-wrapper">
//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Patient</th>
//                 <th>Time</th>
//                 <th>Date</th>
//                 <th>Doctor</th>
//                 <th>Status</th>
//                 <th>Reason</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {appointments.map((item, index) => (
//                 <tr key={item.id}>
//                   <td><input type="checkbox" /></td>

//                   <td className="name-cell">
//                     <img src={item.img} alt="" />
//                     {item.name}
//                   </td>

//                   <td>{item.time}</td>
//                   <td>{item.date}</td>
//                   <td>{item.doctor}</td>

//                   <td>
//                     <span className={`status ${item.status.toLowerCase()}`}>
//                       {item.status}
//                     </span>
//                   </td>

//                   <td>{item.reason}</td>

//                   <td className="action-cell">
//                     {item.status === "Pending" && (
//                       <>
//                         <button
//                           className="accept-btn"
//                           onClick={() => handleStatus(item.id, "Accepted")}                        >
//                           ✔ Accept
//                         </button>

//                         <button
//                           className="reject-btn"
//                           onClick={() => handleStatus(item.id, "Rejected")}                        >
//                           ✖ Reject
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useState, useEffect } from "react";
// import "../css/AppointmentView.css";
// import DoctorHeader from "../components/DoctorHeader";
// import DoctorNavbar from "../components/DoctorNavbar";

// export default function AppointmentView() {
//   const [open, setOpen] = useState(true);
//   const [appointments, setAppointments] = useState([]);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//   try {
//     setLoading(true);

//     const token = localStorage.getItem("token");

//     const res = await fetch(
//       `${process.env.REACT_APP_API_URL}/api/appointment/doctor`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//           credentials:"include",
//       }
//     );

//     const data = await res.json();

//     console.log("API DATA 👉", data); // 🔥 DEBUG

//     // ✅ Convert backend data → frontend format
//       const appointmentArray = Array.isArray(data)
//   ? data
//   : data.appointments || [];

// const formatted = appointmentArray.map((item) => ({
//   id: item._id,
//   name: `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`.trim() || "Unknown",
//   time: item.time,
//   date: new Date(item.date).toLocaleDateString(),
//   status: (item.status),
//   reason: item.reason || "-",
//   img: `https://ui-avatars.com/api/?name=${item.patient?.firstName || 'U'}&background=random&color=fff`,
// }));

//     setAppointments(formatted);

//   } catch (error) {
//     console.error("Fetch Error:", error);
//   } finally {
//     setLoading(false);
//   }
// };
//   const handleStatus = async (id, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (res.ok) {
//         // Update local state immediately for better UX
//         setAppointments((prev) =>
//           prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
//         );
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <>
//       <DoctorNavbar open={open} setOpen={setOpen} />
//       <DoctorHeader open={open} />

//       <div
//         className="appointment-container"
//         style={{
//           marginLeft: open ? "250px" : "100px",
//           transition: "0.3s",
//           padding: "20px"
//         }}
//       >
//         <div className="list-header">
//           <h2>📅 Appointment View</h2>
//         </div>

//         <div className="filter-bar">
//           <input type="text" placeholder="Search by name..." className="search-input" />
//           <button className="filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
//             Filter {isFilterOpen ? "▲" : "▼"}
//           </button>
//           <button className="export-btn">Export</button>
//         </div>

//         {isFilterOpen && (
//           <div className="filter-drawer">
//             <div className="filter-grid">
//               <div className="filter-group">
//                 <label>Status</label>
//                 <select>
//                   <option>All</option>
//                   <option>Pending</option>
//                   <option>Accepted</option>
//                   <option>Rejected</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="table-wrapper">
//           {loading ? (
//             <div className="loading-state">Loading appointments...</div>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Patient</th>
//                   <th>Time</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {appointments.length > 0 ? (
//                   appointments.map((item) => (
//                     <tr key={item.id}
//                       style={{ cursor: "pointer" }}
//                       onClick={() => setSelectedAppointment(item)}
//                     >
//                       <td className="name-cell">
//                         <img src={item.img} alt="" style={{ width: "30px", borderRadius: "50%", marginRight: "10px" }} />
//                         {item.name}
//                       </td>
//                       <td>{item.time}</td>
//                       <td>{item.date}</td>
//                       <td>
//                         <span className={`status ${item.status.toLowerCase()}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>No appointments found.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           )}
//           {selectedAppointment && (
//   <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
//     <div className="modal" onClick={(e) => e.stopPropagation()}>

//       <div className="modal-header">
//         <h3>Appointment Details</h3>
//         <button onClick={() => setSelectedAppointment(null)}>✕</button>
//       </div>

//       <div className="modal-body">

//         <div className="modal-user">
//           <img src={selectedAppointment.img} alt="" />
//           <h4>{selectedAppointment.name}</h4>
//         </div>

//         <div className="modal-info">
//           <p><b>Date:</b> {selectedAppointment.date}</p>
//           <p><b>Time:</b> {selectedAppointment.time}</p>
//           <p><b>Status:</b> {selectedAppointment.status}</p>
//           <p><b>Reason:</b> {selectedAppointment.reason}</p>
//         </div>

//       </div>

//       <div className="modal-footer">
//         <button onClick={() => setSelectedAppointment(null)}>Close</button>
//       </div>

//     </div>
//   </div>
// )}
//         </div>
//       </div>
//     </>
//   );
// }





import React, { useState, useEffect } from "react";
import "../css/AppointmentView.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

export default function AppointmentView() {
  const [open, setOpen] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/doctor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials:"include"
      });

      const data = await res.json();
      const appointmentArray = Array.isArray(data) ? data : data.appointments || [];

      const formatted = appointmentArray.map((item) => ({
        id: item._id,
        name: `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`.trim() || "Unknown",
        email: item.patient?.email || "N/A",
        phone: item.patient?.phoneNumber || "N/A",
        gender: item.patient?.gender || "N/A",
        time: item.time,
        date: new Date(item.date).toLocaleDateString(),
        status: item.status,
        reason: item.reason || "No reason provided",
        img: `https://ui-avatars.com/api/?name=${item.patient?.firstName || 'U'}&background=random&color=fff`,
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials:"include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local list
        setAppointments((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        // Close modal after action
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

      <div className="appointment-container" style={{ marginLeft: open ? "250px" : "100px", transition: "0.3s", padding: "20px" }}>
        <div className="list-header">
          <h2>📅 Appointment View</h2>
        </div>

        {/* ... Filter Bar Code ... */}

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">Loading appointments...</div>
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
                  <tr key={item.id} onClick={() => setSelectedAppointment(item)} style={{ cursor: "pointer" }}>
                    <td className="name-cell">
                      <img src={item.img} alt="" style={{ width: "30px", borderRadius: "50%", marginRight: "10px" }} />
                      {item.name}
                    </td>
                    <td>{item.time}</td>
                    <td>{item.date}</td>
                    <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL SECTION */}
        {selectedAppointment && (
          <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Patient & Appointment Details</h3>
                <button className="close-x" onClick={() => setSelectedAppointment(null)}>×</button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h4>👤 Patient Information</h4>
                  <div className="detail-grid">
                    <p><b>Full Name:</b> {selectedAppointment.name}</p>
                    <p><b>Email:</b> {selectedAppointment.email}</p>
                    <p><b>Phone:</b> {selectedAppointment.phone}</p>
                    <p><b>Gender:</b> {selectedAppointment.gender}</p>
                  </div>
                </div>

                <hr />

                <div className="detail-section">
                  <h4>📅 Appointment Information</h4>
                  <div className="detail-grid">
                    <p><b>Date:</b> {selectedAppointment.date}</p>
                    <p><b>Time:</b> {selectedAppointment.time}</p>
                    <p><b>Current Status:</b> <span className={`status ${selectedAppointment.status.toLowerCase()}`}>{selectedAppointment.status}</span></p>
                    <p><b>Reason:</b> {selectedAppointment.reason}</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                {/* Only show Approve/Reject if status is Pending */}
{selectedAppointment.status?.toLowerCase() === "pending" && (                  <>
                    <button className="btn-approve" onClick={() => handleStatusUpdate(selectedAppointment.id, "Accepted")}>
                      Approve Appointment
                    </button>
                    <button className="btn-reject" onClick={() => handleStatusUpdate(selectedAppointment.id, "Rejected")}>
                      Reject
                    </button>
                  </>
                )}
                <button className="btn-cancel" onClick={() => setSelectedAppointment(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}