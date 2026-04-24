import { useState, useEffect } from "react";
import "../css/UploadMedicalRecord.css";

const UploadMedicalRecord = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        type: "scan",
        doctorName: "",
        date: "",
        description: "",
        file: null
    });
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "file") {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/mydoctors`, {
                    credentials: "include"
                });

                const data = await res.json();
                setDoctors(data);
                console.log("Doctors API response:", data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchDoctors();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("type", formData.type);
        data.append("doctorName", formData.doctorName);
        data.append("date", formData.date);
        data.append("description", formData.description);
        data.append("file", formData.file);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/record/upload`, {
                method: "POST",
                body: data,
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message);

            alert("Record uploaded successfully ✅");
            onClose();

        } catch (err) {
            console.error(err);
            alert("Upload failed ❌");
        }
    };

    return (
        <div className="upload-modal-overlay">
            <div className="upload-modal">

                <span className="upload-close" onClick={onClose}>✖</span>

                <h2>Upload Medical Record</h2>

                <form onSubmit={handleSubmit} className="upload-form">

                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        onChange={handleChange}
                        required
                    />

                    <select name="type" onChange={handleChange}>
                        <option value="scan">Scan</option>
                        <option value="report">Report</option>
                        <option value="prescription">Prescription</option>
                    </select>

                    <select
  name="doctorName"
  onChange={handleChange}
  required
>
  <option value="">Select Doctor</option>

  {Array.isArray(doctors) &&
    doctors.map((doc) => (
      <option key={doc._id} value={doc.fullName}>
        {doc.fullName} ({doc.specialization})
      </option>
    ))}
</select>

                    {/* <input
            type="date"
            name="date"
            onChange={handleChange}
          /> */}
                    <input
                        type="date"
                        name="date"
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        name="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleChange}
                        required
                    />

                    <div className="upload-btn-group">
                        <button type="submit" className="upload-btn-primary">
                            Upload
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="upload-btn-cancel"
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