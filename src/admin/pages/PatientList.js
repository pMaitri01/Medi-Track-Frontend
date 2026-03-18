import React from 'react';
import '../css/PatientList.css';
import '../components/DoctorHeader';
// import '../components/DoctorNavbar';
import DoctorHeader from '../components/DoctorHeader';

const patients = [
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
  return (
   <>
       <DoctorHeader/>
  <div className="patient-list-container">
      <div className="list-header">
        <div className="title-section">
          <i className="patient-icon">👥</i>
          <h2>Patient List</h2>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrapper">
          <input type="text" placeholder="Search by name, phone or ID" className="search-input" />
        </div>
        <div className="filter-options">
          <button className="filter-btn">Filter</button>
          <button className="filter-btn">All</button>
          <button className="filter-btn">Any Age</button>
          <button className="export-btn filled">Export</button>
        </div>
      </div>

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
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td><input type="checkbox" /></td>
                <td className="name-cell">
                  <img src={patient.img} alt={patient.name} className="patient-avatar" />
                  {patient.name}
                </td>
                <td>{patient.age} {patient.gender}</td>
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

      <div className="footer-pagination">
        <span>Showing 1 to 8 of 8 entries</span>
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