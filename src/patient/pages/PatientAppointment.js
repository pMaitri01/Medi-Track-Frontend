// import React, { useEffect, useState } from "react";
// import "../css/PatientAppointment.css";

// export default function PatientAppointment() {
//   const [appointments, setAppointments] = useState([]);
//   const [activeTab, setActiveTab] = useState("upcoming");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user")); // ✅ get logged-in user
//       const patientId = user?._id;

//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/appointment/all`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         }
//       );

//       const data = await res.json();

//       console.log("API DATA 👉", data); // 🔥 DEBUG

//       const appointmentArray = Array.isArray(data)
//         ? data
//         : data.appointments || [];

//       // ✅ FILTER + FORMAT
//       const formatted = appointmentArray
//         .filter((item) => item.patient?._id === patientId) // ⭐ FILTER LOGGED-IN PATIENT
//         .map((item) => ({
//           id: item._id,
//           doctorName: item.doctor?.fullName || "Unknown", // ⭐ FIXED
//           date: new Date(item.date).toLocaleDateString(),
//           time: item.time,
//           status: item.status?.toLowerCase(),
//         }));

//       setAppointments(formatted);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

//     try {
//       const token = localStorage.getItem("token");

//       await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: "cancelled" }),
//       });

//       fetchAppointments(); // refresh
//     } catch (error) {
//       console.error("Cancel Error:", error);
//     }
//   };

//   const handleReschedule = (id) => {
//     alert("Open reschedule modal here for appointment ID: " + id);
//   };

//   // ✅ FILTER TABS
//   const upcomingAppointments = appointments.filter((a) =>
//     ["pending", "accepted"].includes(a.status)
//   );

//   const pastAppointments = appointments.filter((a) =>
//     ["completed", "rejected", "cancelled"].includes(a.status)
//   );

//   const renderTable = (data, isUpcoming) => (
//     <table>
//       <thead>
//         <tr>
//           <th>Doctor</th>
//           <th>Date</th>
//           <th>Time</th>
//           <th>Status</th>
//           {isUpcoming && <th>Actions</th>}
//         </tr>
//       </thead>

//       <tbody>
//         {data.length > 0 ? (
//           data.map((item) => (
//             <tr key={item.id}>
//               <td>{item.doctorName}</td>
//               <td>{item.date}</td>
//               <td>{item.time}</td>

//               <td>
//                 <span className={`status ${item.status}`}>
//                   {item.status}
//                 </span>
//               </td>

//               {isUpcoming && (
//                 <td>
//                   <button
//                     className="btn-reschedule"
//                     onClick={() => handleReschedule(item.id)}
//                   >
//                     Reschedule
//                   </button>

//                   <button
//                     className="btn-cancel"
//                     onClick={() => handleCancel(item.id)}
//                   >
//                     Cancel
//                   </button>
//                 </td>
//               )}
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td colSpan="5" style={{ textAlign: "center" }}>
//               No appointments found
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   );

//   return (
//     <div className="appointment-container" style={{ padding: "20px" }}>
//       <h2>📅 My Appointments</h2>

//       {/* Tabs */}
//       <div className="tabs">
//         <button
//           className={activeTab === "upcoming" ? "active" : ""}
//           onClick={() => setActiveTab("upcoming")}
//         >
//           Upcoming
//         </button>

//         <button
//           className={activeTab === "past" ? "active" : ""}
//           onClick={() => setActiveTab("past")}
//         >
//           Past
//         </button>
//       </div>

//       {/* Table */}
//       <div className="table-wrapper">
//         {loading ? (
//           <p>Loading...</p>
//         ) : activeTab === "upcoming" ? (
//           renderTable(upcomingAppointments, true)
//         ) : (
//           renderTable(pastAppointments, false)
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import "../css/PatientAppointment.css";

export default function PatientAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const patientId = user?._id;

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/all`,
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
      console.log("API DATA 👉", data);

      const appointmentArray = Array.isArray(data)
        ? data
        : data.appointments || [];

      // ✅ FILTER + FORMAT
      const formatted = appointmentArray
        .filter((item) => item.patient?._id === patientId)
        .map((item) => {
          let doctorName = "Unknown";

          // ✅ Safe doctor mapping (no backend change)
          if (item.doctor && typeof item.doctor === "object") {
            doctorName = item.doctor.fullName || "Unknown";
          }

          if (typeof item.doctor === "string") {
            doctorName = "Doctor not assigned";
          }

          return {
            id: item._id,
            doctorName,
            date: new Date(item.date), // keep Date object for sorting
            time: item.time,
            status: item.status?.toLowerCase(),
          };
        });

      setAppointments(formatted);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      fetchAppointments();
    } catch (error) {
      console.error("Cancel Error:", error);
    }
  };

  const handleReschedule = (id) => {
    alert("Open reschedule modal here for appointment ID: " + id);
  };

  // ✅ SORTED FILTERS

  // 🔥 Upcoming → ASC (nearest first)
  const upcomingAppointments = appointments
    .filter((a) => ["pending", "accepted"].includes(a.status))
    .sort((a, b) => a.date - b.date);

  // 🔥 Past → DESC (latest first)
  const pastAppointments = appointments
    .filter((a) =>
      ["completed", "rejected", "cancelled"].includes(a.status)
    )
    .sort((a, b) => b.date - a.date);

  const renderTable = (data, isUpcoming) => (
    <table>
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          {isUpcoming && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.doctorName}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.time}</td>

              <td>
                <span className={`status ${item.status}`}>
                  {item.status}
                </span>
              </td>

              {isUpcoming && (
                <td>
                  <button
                    className="btn-reschedule"
                    onClick={() => handleReschedule(item.id)}
                  >
                    Reschedule
                  </button>

                  <button
                    className="btn-cancel"
                    onClick={() => handleCancel(item.id)}
                  >
                    Cancel
                  </button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: "center" }}>
              No appointments found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="appointment-container" style={{ padding: "20px" }}>
      <h2>📅 My Appointments</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>

        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : activeTab === "upcoming" ? (
          renderTable(upcomingAppointments, true)
        ) : (
          renderTable(pastAppointments, false)
        )}
      </div>
    </div>
  );
}