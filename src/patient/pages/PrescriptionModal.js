import React, { useEffect, useState } from "react";
import "../css/PrescriptionModal.css";
import { toast } from "react-toastify";

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
        toast.error("Failed to load prescriptions");
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="PrescriptionModal-modal-overlay">

      <div className="PrescriptionModal-modal-container">

        {/* HEADER */}
        <div className="PrescriptionModal-modal-header">
          <h2>
            {selectedPrescription ? "Prescription Details" : "Active Prescriptions"}
          </h2>

          <button
            className="PrescriptionModal-close-btn"
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
        <div className="PrescriptionModal-modal-body">

          {/* LIST VIEW */}
          {!selectedPrescription && (
            <>
              {loading ? (
                <p className="PrescriptionModal-no-data">Loading prescriptions...</p>
              ) : prescriptions.length > 0 ? (
                prescriptions.map((p) => (
                  <div key={p._id} className="PrescriptionModal-list-card">

                    <div>
                      <h4>Dr. {p.doctor?.fullName || "Unknown"}</h4>
                      <p>{new Date(p.createdAt).toDateString()}</p>
                      <p>Diagnosis: {p.diagnosis}</p>
                    </div>

                    <button
                      className="PrescriptionModal-view-btn"
                      onClick={() => setSelectedPrescription(p)}
                    >
                      View Details
                    </button>

                  </div>
                ))
              ) : (
                <p className="PrescriptionModal-no-data">No active prescriptions</p>
              )}
            </>
          )}

          {/* DETAIL VIEW */}
          {selectedPrescription && (
            <div className="PrescriptionModal-prescription-detail">

              <h3>Dr. {selectedPrescription.doctor?.fullName}</h3>

              <p><b>Diagnosis:</b> {selectedPrescription.diagnosis}</p>

              <h4>💊 Medicines</h4>

              <table className="PrescriptionModal-medicine-table">
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

              <div className="PrescriptionModal-section-box">
                <h4>📝 Notes</h4>
                <p>{selectedPrescription.notes || "No notes provided"}</p>
              </div>

              <button
                className="PrescriptionModal-back-btn"
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