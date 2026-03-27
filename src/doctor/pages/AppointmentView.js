// import React, { useState } from "react";
// import "../css/AppointmentView.css";
// import DoctorHeader from "../components/DoctorHeader";
// import DoctorNavbar from "../components/DoctorNavbar";

// const appointmentData = [
//   {
//     id: "A001",
//     name: "John Doe",
//     time: "9:00 AM",
//     date: "17/04/2024",
//     doctor: "Dr. Smith",
//     status: "Pending",
//     reason: "Fever",
//     img: "https://i.pravatar.cc/150?u=A001"
//   },
//   {
//     id: "A002",
//     name: "Mary Smith",
//     time: "10:00 AM",
//     date: "18/04/2024",
//     doctor: "Dr. Johnson",
//     status: "Completed",
//     reason: "Checkup",
//     img: "https://i.pravatar.cc/150?u=A002"
//   }
// ];

// export default function AppointmentView() {
//   const [open, setOpen] = useState(true);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   return (
//     <>
//       <DoctorHeader open={open} />
//       <DoctorNavbar open={open} setOpen={setOpen} />

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
//                   <option>Completed</option>
//                   <option>Cancelled</option>
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
//               </tr>
//             </thead>

//             <tbody>
//               {appointmentData.map((item) => (
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
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState } from "react";
import "../css/AppointmentView.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

const initialData = [
  {
    id: "A001",
    name: "John Doe",
    time: "9:00 AM",
    date: "17/04/2024",
    doctor: "Dr. Smith",
    status: "Pending",
    reason: "Fever",
    img: "https://i.pravatar.cc/150?u=A001"
  },
  {
    id: "A002",
    name: "Mary Smith",
    time: "10:00 AM",
    date: "18/04/2024",
    doctor: "Dr. Johnson",
    status: "Pending",
    reason: "Checkup",
    img: "https://i.pravatar.cc/150?u=A002"
  }
];

export default function AppointmentView() {
  const [open, setOpen] = useState(true);
  const [appointments, setAppointments] = useState(initialData);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleStatus = (index, newStatus) => {
    const updated = [...appointments];
    updated[index].status = newStatus;
    setAppointments(updated);
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
                          onClick={() => handleStatus(index, "Accepted")}
                        >
                          ✔ Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => handleStatus(index, "Rejected")}
                        >
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