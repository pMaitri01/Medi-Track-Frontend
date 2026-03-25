import React, { useState,useEffect } from 'react';
import '../css/PatientList.css';
import DoctorHeader from '../components/DoctorHeader';
import DoctorNavbar from '../components/DoctorNavbar';
import axios from "axios";

const PatientList = () => {
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({
    age: 'All',
    date: '',
    status: 'All',
    gender: 'All'
  });
  useEffect(() => {
  fetchPatients();
}, []);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  // Dynamic style for the content area to move with Sidebar
  const contentStyle = {
    marginLeft: open ? "250px" : "100px",
    transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
    width: `calc(100% - ${open ? "250px" : "100px"})`,
    minHeight: "100vh",
    backgroundColor: "#f4f2ee"
  };

  
// Filteration 
const filteredPatients = patients.filter((p) => {
  // 🔍 Search filter
  const matchesSearch =
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm) ||
    p._id.includes(searchTerm);

  //  Age filter
  let matchesAge = true;
  if (filters.age === "0-18") matchesAge = p.age <= 18;
  else if (filters.age === "19-45") matchesAge = p.age >= 19 && p.age <= 45;
  else if (filters.age === "45+") matchesAge = p.age > 45;

  //  Gender filter
  let matchesGender = true;
  if (filters.gender !== "All") {
    matchesGender = p.gender === filters.gender;
  }

  // Date filter
  let matchesDate = true;
  if (filters.date) {
    const patientDate = new Date(p.createdAt).toISOString().split("T")[0];
    matchesDate = patientDate === filters.date;
  }

  return matchesSearch && matchesAge && matchesGender && matchesDate;
});

  // API for Fetcing Patient Data
  const fetchPatients = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/patient/"); // adjust URLhttp://localhost:5000/api/patient/count
    setPatients(res.data);
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
};

// API For Deleting Patient
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this patient?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/patient/${id}`);

    // remove from UI instantly
    setPatients((prev) => prev.filter((p) => p._id !== id));

    alert("Patient deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
  }
};
  return (
    <>
      {/* Sidebar gets the state */}
      <DoctorNavbar open={open} setOpen={setOpen} />

      {/* Main Content Wrapper */}
      <div style={contentStyle}>
        {/* Pass open to Header if Header is position:fixed */}
        <DoctorHeader open={open} />

        <div className="patient-list-container">
          {/* Header Section */}
          <div className="list-header">
            <div className="title-section">
              <i className="patient-icon">👥</i>
              <h2>Patient List</h2>
            </div>
          </div>

          {/* Main Filter and Search Bar */}
          <div className="filter-bar-container">
            <div className="filter-bar">
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Search by name, phone or ID" 
                  className="search-input" 
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <button 
                  className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`} 
                  onClick={toggleFilter}
                >
                  Filter {isFilterOpen ? '▲' : '▼'}
                </button>
                <button className="export-btn filled">Export</button>
              </div>
            </div>

            {/* Expandable Filter Drawer */}
            {isFilterOpen && (
              <div className="filter-drawer">
                <div className="filter-grid">
                  <div className="filter-group" id="fage">
                    <label>Age</label>
                    <select value={filters.age} onChange={(e) => setFilters({...filters, age: e.target.value})}>
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
                      onChange={(e) => setFilters({...filters, date: e.target.value})} 
                    />
                  </div>

                  <div className="filter-group">
                    <label>Appointment Status</label>
                    <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                      <option value="All">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Gender</label>
                    <select value={filters.gender} onChange={(e) => setFilters({...filters, gender: e.target.value})}>
                      <option value="All">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                
                <div className="filter-footer">
                  <button className="apply-filter-btn">Apply Filter</button>
                  <button 
                    className="reset-filter-btn" 
                    onClick={() => setFilters({age:'All', date:'', status:'All', gender:'All'})}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Section */}
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
              {/* <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id}>
                  
                  <td className="name-cell">
                    {patient.name}
                  </td>

                  <td>{patient.age} / {patient.gender}</td>

                  <td className="contact-cell">📞 {patient.phone}</td>

                  <td>{patient.email}</td>

                  <td className="id-cell">{patient._id}</td>

                  <td>{new Date(patient.createdAt).toLocaleDateString()}</td>

                  <td className="action-cells">
                    <button className="view-btn">👁</button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(patient._id)}
                    >  🗑
                    </button>
                  </td>
                </tr>
                ))}
              </tbody> */}
              <tbody>
  {filteredPatients.length > 0 ? (
    filteredPatients.map((patient) => (
      <tr key={patient._id}>
        <td className="name-cell">{patient.name}</td>

        <td>{patient.age} / {patient.gender}</td>

        <td className="contact-cell">📞 {patient.phone}</td>

        <td>{patient.email}</td>

        <td className="id-cell">{patient._id}</td>

        <td>{new Date(patient.createdAt).toLocaleDateString()}</td>

        <td className="action-cells">
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
          
          {/* Pagination Section */}
          <div className="footer-pagination">
            <span>Showing 1 to {filteredPatients.length} of {patients.length} entries</span>
            <div className="pagination-controls">
              <button className="page-nav">Previous</button>
              <button className="page-num active">1</button>
              <button className="page-nav">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientList;