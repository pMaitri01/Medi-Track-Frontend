import { useState, useEffect } from "react";
import "../css/PatientList.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

const PatientList = () => {
  const [open, setOpen]               = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const [patients, setPatients]         = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [filters, setFilters] = useState({ age: "All", date: "", gender: "All" });
  const [appliedFilters, setAppliedFilters] = useState({ age: "All", date: "", gender: "All" });

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const contentStyle = {
    marginLeft:      open ? "250px" : "100px",
    transition:      "margin-left 0.3s ease-in-out",
    width:           `calc(100% - ${open ? "250px" : "100px"})`,
    minHeight:       "100vh",
    backgroundColor: "#f8fafc",
  };

  // ── Fetch patients ──────────────────────────────────────────────────────
  const fetchPatients = async () => {
    try {
      const res  = await fetch(`${process.env.REACT_APP_API_URL}/api/patient/list`);
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // ── Fetch appointments ──────────────────────────────────────────────────
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { console.error("No token found."); return; }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/doctor`,
        {
          method:  "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      if (res.status === 401) { console.error("Unauthorized"); return; }
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

  // ── Filter logic ────────────────────────────────────────────────────────
  const patientIds = [...new Set(appointments.map((a) => a.patient?._id))];

  const filteredPatients = patients
    .filter((p) => patientIds.includes(p._id))
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p._id.includes(searchTerm);

      let matchesAge = true;
      if (appliedFilters.age === "0-18")  matchesAge = p.age <= 18;
      else if (appliedFilters.age === "19-45") matchesAge = p.age >= 19 && p.age <= 45;
      else if (appliedFilters.age === "45+")   matchesAge = p.age > 45;

      let matchesGender = true;
      if (appliedFilters.gender !== "All") matchesGender = p.gender === appliedFilters.gender;

      let matchesDate = true;
      if (appliedFilters.date) {
        const patientDate = new Date(p.createdAt).toISOString().split("T")[0];
        matchesDate = patientDate === appliedFilters.date;
      }

      return matchesSearch && matchesAge && matchesGender && matchesDate;
    });

  const indexOfLast    = currentPage * patientsPerPage;
  const indexOfFirst   = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  // ── Delete patient ──────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/patient/${id}`, { method: "DELETE" });
      setPatients((prev) => prev.filter((p) => p._id !== id));
      alert("Patient deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

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
                      onChange={(e) => setFilters({ ...filters, age: e.target.value })}
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
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                  </div>

                  <div className="dplist-filter-group">
                    <label>Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    >
                      <option value="All">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="dplist-filter-footer">
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
                  <th>Patient ID</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.name}</td>
                      <td>{patient.age} / {patient.gender}</td>
                      <td>📞 {patient.phone}</td>
                      <td>{patient.email}</td>
                      <td>{patient._id}</td>
                      <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="dplist-view-btn">👁</button>
                        <button
                          className="dplist-delete-btn"
                          onClick={() => handleDelete(patient._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                      No Patients Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
