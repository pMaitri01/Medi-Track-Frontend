// import React from 'react';
// import '../css/PatientList.css';
// import '../components/DoctorHeader';
// // import '../components/DoctorNavbar';
// import DoctorHeader from '../components/DoctorHeader';

// const patients = [
//   { id: 'P001', name: 'John Doe', age: 30, gender: 'M', contact: '1234:5678', email: 'johndoe@acd.com', date: '17/04/2024', img: 'https://i.pravatar.cc/150?u=P001' },
//   { id: 'P002', name: 'Mary Smith', age: 45, gender: 'F', contact: '9677:5678', email: 'mary.smith@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P002' },
//   { id: 'P003', name: 'David Brown', age: 28, gender: 'M', contact: '9757:5678', email: 'david.brown@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P003' },
//   { id: 'P004', name: 'Sarah Johnson', age: 50, gender: 'F', contact: '6733:5678', email: 'sarah.johnson@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P004' },
//   { id: 'P005', name: 'Michael Lee', age: 35, gender: 'M', contact: '9733:5678', email: 'michael.lee@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P005' },
//   { id: 'P006', name: 'Emily Davis', age: 29, gender: 'F', contact: '9567:5678', email: 'emily.davis@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P006' },
//   { id: 'P007', name: 'James Wilson', age: 62, gender: 'M', contact: '9733:5678', email: 'james.wilson@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P007' },
//   { id: 'P008', name: 'Emma Taylor', age: 22, gender: 'F', contact: '9757:5678', email: 'emma.taylor@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P008' },
// ];

// const PatientList = () => {
//   return (
//    <>
//        <DoctorHeader/>
//   <div className="patient-list-container">
//       <div className="list-header">
//         <div className="title-section">
//           <i className="patient-icon">👥</i>
//           <h2>Patient List</h2>
//         </div>
//       </div>

//       <div className="filter-bar">
//         <div className="search-input-wrapper">
//           <input type="text" placeholder="Search by name, phone or ID" className="search-input" />
//         </div>
//         <div className="filter-options">
//           <div className="filter-options">
//             {/* Unified Filter Dropdown */}
//             <div className="select-wrapper">
//               <select 
//                 className="filter-select" 
//                 value={filterType} 
//                 onChange={(e) => setFilterType(e.target.value)}
//               >
//                 <option value="All">Filter: All</option>
//                 <option value="Date">Date</option>
//                 <option value="Age">Age</option>
//                 <option value="Gender">Gender</option>
//               </select>
//             </div>
//             <button className="export-btn filled">Export</button>

//         </div>
//       </div>

//       <div className="table-wrapper">
//         <table className="patient-table">
//           <thead>
//             <tr>
//               <th><input type="checkbox" /></th>
//               <th>Name</th>
//               <th>Age / Gender</th>
//               <th>Contact</th>
//               <th>Email</th>
//               <th>Patient ID</th>
//               <th>Registered Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient) => (
//               <tr key={patient.id}>
//                 <td><input type="checkbox" /></td>
//                 <td className="name-cell">
//                   <img src={patient.img} alt={patient.name} className="patient-avatar" />
//                   {patient.name}
//                 </td>
//                 <td>{patient.age} {patient.gender}</td>
//                 <td className="contact-cell">📞 {patient.contact}</td>
//                 <td>{patient.email}</td>
//                 <td className="id-cell">{patient.id}</td>
//                 <td>{patient.date}</td>
//                 <td className="action-cells">
//                   <button className="view-btn">👁 View</button>
//                   <button className="delete-btn">🗑 Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="footer-pagination">
//         <span>Showing 1 to 8 of 8 entries</span>
//         <div className="pagination-controls">
//           <button className="page-nav">Previous</button>
//           <button className="page-num active">1</button>
//           <button className="page-nav">Next</button>
//         </div>
//       </div>
//     </div>
//     </> 
//   );
// };
// export default PatientList;


import React, { useState } from 'react';
import '../css/PatientList.css';
import DoctorHeader from '../components/DoctorHeader';
import DoctorNavbar from '../components/DoctorNavbar';
const patientsData = [
  { id: 'P001', name: 'John Doe', age: 30, gender: 'M', contact: '1234:5678', email: 'johndoe@acd.com', date: '17/04/2024', img: 'https://i.pravatar.cc/150?u=P001' },
  { id: 'P002', name: 'Mary Smith', age: 45, gender: 'F', contact: '9677:5678', email: 'mary.smith@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P002' },
  { id: 'P003', name: 'David Brown', age: 28, gender: 'M', contact: '9757:5678', email: 'david.brown@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P003' },
  { id: 'P004', name: 'Sarah Johnson', age: 50, gender: 'F', contact: '6733:5678', email: 'sarah.johnson@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P004' },
  { id: 'P005', name: 'Michael Lee', age: 35, gender: 'M', contact: '9733:5678', email: 'michael.lee@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P005' },
  { id: 'P006', name: 'Emily Davis', age: 29, gender: 'F', contact: '9567:5678', email: 'emily.davis@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P006' },
  { id: 'P007', name: 'James Wilson', age: 62, gender: 'M', contact: '9733:5678', email: 'james.wilson@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P007' },
  { id: 'P008', name: 'Emma Taylor', age: 22, gender: 'F', contact: '9757:5678', email: 'emma.taylor@email.com', date: '18/04/2024', img: 'https://i.pravatar.cc/150?u=P008' },
];

const PatientList = () => {
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    age: 'All',
    date: '',
    status: 'All',
    gender: 'All'
  });

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <>
      <DoctorHeader />
      <DoctorNavbar open={open} setOpen={setOpen} />
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

          {/* Expandable Filter Drawer (LinkedIn Style) */}
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
                    <option value="M">Male</option>
                    <option value="F">Female</option>
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
                <th><input type="checkbox" /></th>
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
              {patientsData.map((patient) => (
                <tr key={patient.id}>
                  <td><input type="checkbox" /></td>
                  <td className="name-cell">
                    <img src={patient.img} alt={patient.name} className="patient-avatar" />
                    {patient.name}
                  </td>
                  <td>{patient.age} / {patient.gender}</td>
                  <td className="contact-cell">📞 {patient.contact}</td>
                  <td>{patient.email}</td>
                  <td className="id-cell">{patient.id}</td>
                  <td>{patient.date}</td>
                  <td className="action-cells">
                    <button className="view-btn">👁 View</button>
                    <button className="delete-btn">🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="footer-pagination">
          <span>Showing 1 to {patientsData.length} of {patientsData.length} entries</span>
          <div className="pagination-controls">
            <button className="page-nav">Previous</button>
            <button className="page-num active">1</button>
            <button className="page-nav">Next</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientList;