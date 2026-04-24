// import React, { useEffect, useState } from "react";
// import "../css/PrescriptionModal.css"; // 👈 shared styles (important)

// const PrescriptionModal = ({ isOpen, onClose }) => {
//   const [prescriptions, setPrescriptions] = useState([]);

//   useEffect(() => {
//     if (!isOpen) return;

//     const fetchData = async () => {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/prescription/active`,
//         { credentials: "include" }
//       );

//       const data = await res.json();
//       setPrescriptions(data || []);
//     };

//     fetchData();
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">

//         {/* SAME HEADER STYLE AS BOOK APPOINTMENT */}
//         <div className="modal-header">
//           <h2>Prescriptions</h2>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         {/* BODY */}
//         <div className="modal-body">
//   {prescriptions.length === 0 ? (
//     <p className="no-data">No active prescriptions</p>
//   ) : Array.isArray(prescriptions) ? (
//     prescriptions.map((p) => (
//       <div key={p._id} className="list-card">
//         <div>
//           <h4>Dr. {p.doctorName}</h4>
//           <p>{new Date(p.createdAt).toDateString()}</p>
//         </div>
//         <span className="status-badge active">Active</span>
//       </div>
//     ))
//   ) : (
//     <p className="no-data">Loading or invalid data</p>
//   )}
// </div>

//       </div>
//     </div>
//   );
// };

// export default PrescriptionModal;

import React, { useEffect, useState } from "react";
import "../css/PrescriptionModal.css";

const PrescriptionModal = ({ isOpen, onClose }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/prescription/active`,
                    { credentials: "include" }
                );

                const data = await res.json();
                console.log("Prescription API:", data);

                // Normalize response safely
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.prescriptions)
                            ? data.prescriptions
                            : [];

                setPrescriptions(list);
            } catch (err) {
                console.error("Error fetching prescriptions:", err);
                setPrescriptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen]);

    if (!isOpen) return null;
return (
  <div className="modal-overlay">

    <div className="modal-container">

      {/* HEADER */}
      <div className="modal-header">
        <h2>
          {selectedPrescription ? "Prescription Details" : "Active Prescriptions"}
        </h2>

        <button
          className="close-btn"
          onClick={() => {
            selectedPrescription
              ? setSelectedPrescription(null)
              : onClose();
          }}
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="modal-body">

        {/* LIST VIEW */}
        {!selectedPrescription && (
          <>
            {loading ? (
              <p className="no-data">Loading prescriptions...</p>
            ) : prescriptions.length > 0 ? (
              prescriptions.map((p) => (
                <div key={p._id} className="list-card">

                  <div>
                    <h4>Dr. {p.doctor?.fullName || "Unknown"}</h4>
                    <p>{new Date(p.createdAt).toDateString()}</p>
                    <p>Diagnosis: {p.diagnosis}</p>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => setSelectedPrescription(p)}
                  >
                    View Details
                  </button>

                </div>
              ))
            ) : (
              <p className="no-data">No active prescriptions</p>
            )}
          </>
        )}

        {/* DETAIL VIEW */}
        {selectedPrescription && (
          <div className="prescription-detail">

            <h3>Dr. {selectedPrescription.doctor?.fullName}</h3>

            <p><b>Diagnosis:</b> {selectedPrescription.diagnosis}</p>

            <h4>💊 Medicines</h4>

            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Time</th>
                  <th>Duration</th>
                </tr>
              </thead>

              <tbody>
                {selectedPrescription.medicines?.map((m, i) => (
                  <tr key={i}>
                    <td>{m.name}</td>
                    <td>{m.dosage}</td>
                    <td>
                      {typeof m.timeOfDay === "object"
                        ? m.timeOfDay?.timeOfDay
                        : m.timeOfDay}
                    </td>
                    <td>{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-box">
              <h4>📝 Notes</h4>
              <p>{selectedPrescription.notes || "No notes provided"}</p>
            </div>

            <button
              className="back-btn"
              onClick={() => setSelectedPrescription(null)}
            >
              ← Back
            </button>

          </div>
        )}

      </div>
    </div>
  </div>
);
};

export default PrescriptionModal;