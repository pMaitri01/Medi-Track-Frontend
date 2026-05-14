import { useState, useEffect } from "react";
import "../css/PatientList.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

const PatientList = () => {
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [filters, setFilters] = useState({
    age: "All",
    date: "",
    gender: "All",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    age: "All",
    date: "",
    gender: "All",
  });

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const contentStyle = {
    marginLeft: open ? "250px" : "100px",
    transition: "margin-left 0.3s ease-in-out",
    width: `calc(100% - ${open ? "250px" : "100px"})`,
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  };

  // ── Fetch patients ──
  const fetchPatients = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patient/list`,
      );
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // ── Fetch appointments ──
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/doctor`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      if (res.status === 401) {
        console.error("Unauthorized");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  // ── Filter logic ───
  const patientIds = [...new Set(appointments.map((a) => a.patient?._id))];

  const filteredPatients = patients
    .filter((p) => patientIds.includes(p._id))
    .filter((p) => {
      const search = searchTerm.trim().toLowerCase();

      const fullName = (p.name || "").toLowerCase();
      const phone = (p.phone || "").toLowerCase();
      const id = (p._id || "").toLowerCase(); // convert to string

      const matchesSearch =
        fullName.includes(search) ||
        phone.includes(search) ||
        id.includes(search);

      // Age filter
      let age = p.age;
      if (!age && p.dob) {
        const diff = Date.now() - new Date(p.dob).getTime();
        age = new Date(diff).getUTCFullYear() - 1970;
      }

      let matchesAge = true;
      if (appliedFilters.age === "0-18") matchesAge = age <= 18;
      else if (appliedFilters.age === "19-45")
        matchesAge = age >= 19 && age <= 45;
      else if (appliedFilters.age === "45+") matchesAge = age > 45;

      // Gender filter
      let matchesGender = true;
      if (appliedFilters.gender !== "All") {
        matchesGender = (p.gender || "") === appliedFilters.gender;
      }

      // Date filter
      let matchesDate = true;
      if (appliedFilters.date && p.createdAt) {
        const patientDate = new Date(p.createdAt).toISOString().split("T")[0];
        matchesDate = patientDate === appliedFilters.date;
      }

      return matchesSearch && matchesAge && matchesGender && matchesDate;
    });

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <DoctorNavbar open={open} setOpen={setOpen} />

      <div style={contentStyle}>
        <DoctorHeader open={open} />

        <div className="dplist-container">
          {/* Page heading */}
          <div className="dplist-header">
            <div className="dplist-title-section">
              <span>👥</span>
              <h2>Patient List</h2>
            </div>
          </div>

          {/* Search + filter */}
          <div className="dplist-filter-bar-container">
            <div className="dplist-filter-bar">
              <input
                type="text"
                placeholder="Search by name, phone or ID"
                className="dplist-search-input"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className={`dplist-filter-toggle-btn${isFilterOpen ? " active" : ""}`}
                onClick={toggleFilter}
              >
                Filter {isFilterOpen ? "▲" : "▼"}
              </button>
            </div>

            {isFilterOpen && (
              <div className="dplist-filter-drawer">
                <div className="dplist-filter-grid">
                  <div className="dplist-filter-group">
                    <label>Age</label>
                    <select
                      value={filters.age}
                      onChange={(e) =>
                        setFilters({ ...filters, age: e.target.value })
                      }
                    >
                      <option value="All">Any Age</option>
                      <option value="0-18">0–18</option>
                      <option value="19-45">19–45</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>

                  <div className="dplist-filter-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) =>
                        setFilters({ ...filters, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="dplist-filter-group">
                    <label>Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters({ ...filters, gender: e.target.value })
                      }
                    >
                      <option value="All">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Buttons beside fields */}
                  <div className="dplist-filter-actions">
                    <button
                      className="dplist-apply-btn"
                      onClick={() => setAppliedFilters(filters)}
                    >
                      Apply
                    </button>

                    <button
                      className="dplist-reset-btn"
                      onClick={() => {
                        const reset = { age: "All", date: "", gender: "All" };
                        setFilters(reset);
                        setAppliedFilters(reset);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="dplist-table-wrapper">
            <table className="dplist-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age / Gender</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="dplist-row-clickable"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsModalOpen(true);
                      }}
                    >
                      <td>{patient.name}</td>
                      <td>
                        {patient.age ||
                          (patient.dob
                            ? new Date().getFullYear() -
                              new Date(patient.dob).getFullYear()
                            : "N/A")}{" "}
                        / {patient.gender}
                      </td>
                      <td>📞 {patient.phone}</td>
                      <td>{patient.email}</td>
                      <td>{patient.city}</td>
                      <td>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#94a3b8",
                      }}
                    >
                      No Patients Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {isModalOpen && selectedPatient && (
              <div
                className="dp-modal-overlay"
                onClick={() => setIsModalOpen(false)}
              >
                <div
                  className="dp-modal-new"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* HEADER */}
                  <div className="dp-modal-header-new">
                    <div className="dp-user">
                      <div className="dp-avatar">
                        {selectedPatient.name
                          ?.split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <h2>{selectedPatient.name}</h2>
                        <span>{selectedPatient.gender}</span>
                      </div>
                    </div>
                    <button
                      className="dp-close-btn"
                      onClick={() => setIsModalOpen(false)}
                    >
                      ✖
                    </button>
                  </div>

                  {/* BODY */}
                  <div className="dp-modal-grid">
                    {/* BASIC INFO */}
                    <div className="dp-card">
                      <h4>👤 Basic Information</h4>

                      <p>
                        <span>Name:</span> {selectedPatient.name || "N/A"}
                      </p>

                      <p>
                        <span>Gender:</span> {selectedPatient.gender || "N/A"}
                      </p>

                      <p>
                        <span>Age:</span>{" "}
                        {selectedPatient.age ||
                          (selectedPatient.dob
                            ? new Date().getFullYear() -
                              new Date(selectedPatient.dob).getFullYear()
                            : "N/A")}
                      </p>

                      <p>
                        <span>DOB:</span>{" "}
                        {selectedPatient.dob
                          ? new Date(selectedPatient.dob).toLocaleDateString()
                          : "N/A"
                        }
                      </p>
                    </div>

                    {/* ADDRESS */}
                    <div className="dp-card">
                      <h4>📍 Address</h4>

                      <p>
                        <span>Address:</span> {selectedPatient.address || "N/A"}
                      </p>

                      <p>
                        <span>City:</span> {selectedPatient.city || "N/A"}
                      </p>

                      <p>
                        <span>State:</span> {selectedPatient.state || "N/A"}
                      </p>

                      <p>
                        <span>Pincode:</span> {selectedPatient.pincode || "N/A"}
                      </p>
                    </div>

                    {/* CONTACT */}
                    <div className="dp-card">
                      <h4>📞 Contact Details</h4>

                      <p>
                        <span>Mobile:</span> {selectedPatient.phone || "N/A"}
                      </p>

                      <p>
                        <span>Email:</span> {selectedPatient.email || "N/A"}
                      </p>
                    </div>
                    {/* EMERGENCY */}
                    <div className="dp-card">
                      <h4>🚨 Emergency Contact</h4>

                      <p>
                        <span>Name:</span>{" "}
                        {selectedPatient.emergencyContact?.name || "N/A"}
                      </p>

                      <p>
                        <span>Mobile:</span>{" "}
                        {selectedPatient.emergencyContact?.mobile || "N/A"}
                      </p>

                      <p>
                        <span>Relation:</span>{" "}
                        {selectedPatient.emergencyContact?.relationship ||
                          "N/A"}
                      </p>
                    </div>

                    {/* MEDICAL */}
                    <div className="dp-card">
                      <h4>🩺 Medical Details</h4>

                      <p>
                        <span>Blood Group:</span>{" "}
                        {selectedPatient.bloodGroup || "N/A"}
                      </p>

                      <p>
                        <span>Weight:</span>{" "}
                        {selectedPatient.weight
                          ? `${selectedPatient.weight} kg`
                          : "N/A"}
                      </p>

                      <p>
                        <span>Diseases:</span>{" "}
                        {selectedPatient.diseases?.length
                          ? selectedPatient.diseases.join(", ")
                          : "None"}
                      </p>

                      <p>
                        <span>Allergies:</span>{" "}
                        {selectedPatient.allergies || "None"}
                      </p>

                      <p>
                        <span>Medications:</span>{" "}
                        {selectedPatient.medications || "None"}
                      </p>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="dp-modal-footer-new">
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination footer */}
          <div className="dplist-footer-pagination">
            <span>
              Showing {String(currentPatients.length).padStart(2, "0")} of{" "}
              {String(filteredPatients.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientList;