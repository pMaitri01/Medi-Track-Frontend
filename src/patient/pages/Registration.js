 import React, { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Link } from "react-router-dom";

import "./Registration.css";
import registerImage from "../images/register.jpeg";

export default function Register() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
     const navigate = useNavigate();

//handle subit function
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Mobile no.

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "mobile") {
    // Allow only digits
    if (/^\d*$/.test(value)) {
      // Allow max 10 digits only
      if (value.length <= 10) {
        setFormData({ ...formData, mobile: value });
      }
    }
    return;
  }

  // email

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(formData.email)) {
    alert("Enter valid email (example: abc@gmail.com)");
    return;
  }

  setFormData({ ...formData, [name]: value });
};

// password 
if (formData.password.length < 4) {
    alert("Password must be at least 4 characters");
    return;
  }

  // ✅ Password match validation
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }


  try {
    const { confirmPassword, ...dataToSend } = formData;

    const response = await fetch("http://localhost:5000/api/patient/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // alert("Patient Registered Successfully");
      navigate("/"); // 👈 redirect to login page

    } else {
      alert(data.error || "Registration Failed");
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Server Error");
  }
};

  return (
    <div className="register-container">

      <div className="register-card">

        {/* LEFT IMAGE */}
        <div className="left-section">
          <img src={registerImage} alt="register" />
        </div>

        {/* RIGHT FORM BOX */}
        <div className="right-section">

          <div className="form-box">
            <h2>Patient Registration</h2>

            <form onSubmit={handleSubmit}>

  {/* BASIC INFO */}
  <h3 className="section-title">Basic Information</h3>

  <div className="row">
    <input type="text" name="fname" placeholder="First Name" onChange={handleChange} required />
    <input type="text" name="lname" placeholder="Last Name" onChange={handleChange} required />
  </div>

  <div className="row">
    <select name="gender" onChange={handleChange} required>
      <option value="">Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>

    <input
      type="date"
      name="dob"
      max={new Date().toISOString().split("T")[0]} // 👈 prevents future dates
      onChange={handleChange}
      required
    />

  </div>

  {/* CONTACT DETAILS */}
  <h3 className="section-title">Contact Details</h3>

  <div className="row">
    <input
      type="text"
      name="mobile"
      placeholder="Mobile Number"
      value={formData.mobile}
      onChange={handleChange}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault(); 
        }
      }}
      maxLength="10"
      required
    />
    <input 
      type="email"
      name="email"
      placeholder="Email Address"
      value={formData.email}
      onChange={handleChange}
      pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$"
      title="Enter valid email (example: abc@gmail.com)"
      required
    />
    
  </div>

  <textarea name="address" placeholder="Full Address" onChange={handleChange} required />

  {/* LOGIN CREDENTIALS */}
  <h3 className="section-title">Login Credentials</h3>

  <div className="row">
    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
  </div>

  <button type="submit">Register</button>
<div className="log">
  <small className="txtlog">
    Already have account?
    <Link to="/" className="text-primary">
      Login
    </Link>
  </small>
</div>

</form>
          </div>

        </div>
      </div>
    </div>
  );
}