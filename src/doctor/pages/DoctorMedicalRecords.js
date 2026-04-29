import { useState, useEffect } from "react";
import "../css/DoctorMedicalRecords.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

const DoctorMedicalRecords = () => {
    const [open, setOpen] = useState(true);
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedPatientData, setSelectedPatientData] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/record/patients`,
                    { credentials: "include" }
                );

                const data = await res.json();
                console.log("PATIENT API RESPONSE:", data);

                // SAFE SET
                if (Array.isArray(data)) {
                    setPatients(data);
                } else if (Array.isArray(data.patients)) {
                    setPatients(data.patients);
                } else {
                    setPatients([]);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatients();
    }, []);
    useEffect(() => {
        if (!selectedPatient) return;

        const fetchRecords = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/record/patient/${selectedPatient}?search=${search}`,
                    { credentials: "include" }
                );

                const data = await res.json();
                setRecords(Array.isArray(data) ? data : data.records || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchRecords();
    }, [selectedPatient, search]);

    const contentStyle = {
        marginLeft: open ? "250px" : "100px",
        transition: "margin-left 0.3s ease-in-out",
        width: `calc(100% - ${open ? "250px" : "100px"})`,
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
    };
    const getDownloadUrl = (url, fileName) => {
        if (!url) return "#";

        const safeName = encodeURIComponent(fileName || "medical-record.pdf");

        return url.replace(
            "/upload/",
            `/upload/fl_attachment:${safeName}/`
        );
    };
    return (
        <>
            <DoctorNavbar open={open} setOpen={setOpen} />

            <div style={contentStyle}>
                <DoctorHeader open={open} />

                <div className="dmr-container">

                    {/* Header */}
                    <div className="dmr-header">
                        <h2>📂 Medical Records</h2>
                    </div>

                    {/* Search */}
                    <div className="dmr-search-bar">
                        <input
                            type="text"
                            placeholder="Search patient or record..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="dmr-records-section">

                        {/* Patient Dropdown */}
                        <div className="dmr-dropdown">
                            <label>Select Patient</label>
                            <select
                                onChange={(e) => {
                                    const patientId = e.target.value;
                                    setSelectedPatient(patientId);

                                    const patientObj = patients.find(p => p._id === patientId);
                                    setSelectedPatientData(patientObj); // ✅ IMPORTANT
                                }}
                            >
                                <option value="">Select a patient</option>
                                {patients.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Patient Info */}
                        <div className="dmr-patient-info">
                            <h3>{selectedPatientData?.name || "Select Patient"}</h3>

                            <p>
                                Age: {selectedPatientData?.age || "--"} |{" "}
                                {selectedPatientData?.gender || "--"} |
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="dmr-stats">
                            <div className="dmr-card">Total Records: {records.length}</div>
                            <div className="dmr-card">
                                Reports: {records.filter(r => r.type === "lab").length}
                            </div>
                            <div className="dmr-card">
                                Scans: {records.filter(r => r.type === "scan").length}
                            </div>
                            <div className="dmr-card">
                                Prescriptions: {records.filter(r => r.type === "prescription").length}
                            </div>
                        </div>

                        {/* Records Table */}
                        <div className="dmr-table-wrapper">
                            <table className="dmr-table">
                                <thead>
                                    <tr>
                                        <th>File</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan="4">No records found</td>
                                        </tr>
                                    ) : (
                                        records.map((rec) => (
                                            <tr key={rec._id}>
                                                <td>{rec.title}</td>
                                                <td>{rec.type}</td>
                                                <td>{new Date(rec.date).toLocaleDateString()}</td>
                                                <td>
                                                    {rec.fileUrl ? (
                                                        <a href={rec.fileUrl} target="_blank" rel="noreferrer">
                                                            <button className="download-btn">
                                                                Download Record
                                                            </button>
                                                        </a>
                                                    ) : (
                                                        <span>No file</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorMedicalRecords;