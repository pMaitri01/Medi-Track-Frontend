import React, { useState } from "react";
// import "./DoctorRegister.css";
import "../css/AdminRegister.css";


export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    qualification: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name required";
    if (!formData.gender) newErrors.gender = "Gender required";
    if (!formData.dob) newErrors.dob = "DOB required";
    if (!formData.mobile) newErrors.mobile = "Mobile required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.username) newErrors.username = "Username required";
    if (!formData.password) newErrors.password = "Password required";
    if (formData.password.length < 6)
      newErrors.password = "Min 6 characters required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.specialization)
      newErrors.specialization = "Specialization required";
    if (!formData.qualification)
      newErrors.qualification = "Qualification required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Doctor Registered Successfully ✅");
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <h2 className="admin-title">Doctor Registration</h2>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <p className="admin-section-title">Basic Information</p>
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />

          <div className="admin-row">
            <select name="gender" onChange={handleChange} className="gen">
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input type="date" name="dob" onChange={handleChange} />

          </div>

          {/* Professional */}
           <p className="admin-section-title">Professional Details</p>
          <div className="admin-row">
            <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} />
            <input type="text" name="qualification" placeholder="Qualification" onChange={handleChange} />
          </div>

          {/* Contact */}
          <p className="admin-section-title">Contact Details</p>
          <div className="admin-row">
            <input type="text" name="mobile" placeholder="Mobile Number" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
          </div>

          <textarea name="address" placeholder="Full Address" onChange={handleChange} class></textarea>

          {/* Login */}
          <p className="admin-section-title">Login Credentials</p>
          <input type="text" name="username" placeholder="Username / Email" onChange={handleChange} />

          <div className="admin-row">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          </div>

          <button type="submit" className="admin-register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}