import { useState, useEffect } from "react";
import "../css/UploadMedicalRecord.css";
import { toast } from "react-toastify";

const UploadMedicalRecord = ({ onClose }) => {
    // Form data state
    const [formData, setFormData] = useState({
        title: "",
        type: "scan",
        doctorId: "",
        date: "",
        description: "",
        file: null
    });

    const [doctors, setDoctors] = useState([]);

    // Handle changes for inputs and file
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Fetch doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/mydoctors`, {
                    credentials: "include"
                });
                const data = await res.json();
                setDoctors(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctors();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for required file
        if (!formData.file) {
            toast.error("Please select a file to upload");
            return;
        }

        // Prepare FormData for file upload
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) data.append(key, formData[key]);
        });

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/record/upload`, {
                method: "POST",
                body: data,
                credentials: "include",
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Server error");

            toast.success("Record uploaded successfully");

            // Reset form
            setFormData({
                title: "",
                type: "scan",
                doctorId: "",
                date: "",
                description: "",
                file: null
            });

            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Upload failed");
        }
    };

    return (
        <div className="UploadMedRec-upload-modal-overlay">
            <div className="UploadMedRec-upload-modal">
                {/* <span className="UploadMedRec-upload-close" onClick={onClose}>✖</span> */}
                <button className="UploadMedRec-upload-close" onClick={onClose}>&times;</button>
                <h2>Upload Medical Record</h2>

                <form onSubmit={handleSubmit} className="UploadMedRec-upload-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="scan">Scan</option>
                        <option value="report">Report</option>
                        <option value="prescription">Prescription</option>
                    </select>

                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                                Dr. {doc.fullName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        name="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleChange}
                        required
                    />

                    <div className="UploadMedRec-upload-btn-group">
                        <button type="submit" className="UploadMedRec-upload-btn-primary">
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="UploadMedRec-upload-btn-cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadMedicalRecord;