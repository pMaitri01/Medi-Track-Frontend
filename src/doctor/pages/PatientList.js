import React, { useState, useEffect } from "react";
import "../css/PatientList.css";
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

const PatientList = () => {
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const patientsPerPage = 5; // you can change (5, 10, etc.)
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

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  
  const contentStyle = {
    marginLeft: open ? "250px" : "100px",
    transition: "margin-left 0.3s ease-in-out",
    width: `calc(100% - ${open ? "250px" : "100px"})`,
    minHeight: "100vh",
    backgroundColor: "#f4f2ee",
  };

  // ✅ Fetch Patients
  const fetchPatients = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patient/list`
      );
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // ✅ Fetch Appointments (FIXED)
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔥 DEBUG
      console.log("TOKEN:", token);

      if (!token) {
        console.error("No token found. Please login again.");
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/doctor`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },credentials:"include",
        }
      );

      // 🔥 HANDLE 401
      if (res.status === 401) {
        console.error("Unauthorized - Invalid or expired token");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await res.json();
      console.log("Appointments:", data);

      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  // ✅ FIXED: Correct patient ID extraction
  const patientIds = [
    ...new Set(
      appointments.map((a) => a.patient?._id) // 🔥 FIXED HERE
    ),
  ];

  // ✅ Filter Patients
  const filteredPatients = patients
    .filter((p) => patientIds.includes(p._id))
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p._id.includes(searchTerm);

      let matchesAge = true;
      if (appliedFilters.age === "0-18") matchesAge = p.age <= 18;
      else if (appliedFilters.age === "19-45")
        matchesAge = p.age >= 19 && p.age <= 45;
      else if (appliedFilters.age === "45+") matchesAge = p.age > 45;

      let matchesGender = true;
      if (appliedFilters.gender !== "All") {
        matchesGender = p.gender === appliedFilters.gender;
      }

      let matchesDate = true;
      if (appliedFilters.date) {
        const patientDate = new Date(p.createdAt)
          .toISOString()
          .split("T")[0];
        matchesDate = patientDate === appliedFilters.date;
      }

      return matchesSearch && matchesAge && matchesGender && matchesDate;
    });
    // Pagination logic
const indexOfLast = currentPage * patientsPerPage;
const indexOfFirst = indexOfLast - patientsPerPage;

const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
  // ✅ Delete Patient
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/patient/${id}`,
        {
          method: "DELETE",
        }
      );

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

        <div className="patient-list-container">
          <div className="list-header">
            <div className="title-section">
              <i className="patient-icon">👥</i>
              <h2>Patient List</h2>
            </div>
          </div>

          <div className="filter-bar-container">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search by name, phone or ID"
                className="search-input"
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className={`filter-toggle-btn ${
                  isFilterOpen ? "active" : ""
                }`}
                onClick={toggleFilter}
              >
                Filter {isFilterOpen ? "▲" : "▼"}
              </button>
            </div>

            {isFilterOpen && (
              <div className="filter-drawer">
                <div className="filter-grid">
                  <div className="filter-group">
                    <label>Age</label>
                    <select
                      value={filters.age}
                      onChange={(e) =>
                        setFilters({ ...filters, age: e.target.value })
                      }
                    >
                      <option value="All">Any Age</option>
                      <option value="0-18">0-18</option>
                      <option value="19-45">19-45</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) =>
                        setFilters({ ...filters, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="filter-group">
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
                </div>

                <div className="filter-footer">
                  <button
                    className="apply-filter-btn"
                    onClick={() => setAppliedFilters(filters)}
                  >
                    Apply
                  </button>
                  <button
                    className="reset-filter-btn"
                    onClick={() => {
                      const reset = {
                        age: "All",
                        date: "",
                        gender: "All",
                      };
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

          <div className="table-wrapper">
            <table className="patient-table">
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
                      <td>
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="view-btn">👁</button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(patient._id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No Patients Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="footer-pagination">
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