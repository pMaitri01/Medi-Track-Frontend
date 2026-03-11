 import React, { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
     const navigate = useNavigate();
const handleChange = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };

  // First Name / Last Name
  if (name === "fname" || name === "lname") {
    if (!/^[A-Za-z]*$/.test(value)) {
      newErrors[name] = "Only alphabets allowed";
    } else {
      delete newErrors[name];
    }
  }
// email
if (name === "email") {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // If user already had error, remove it when valid
  if (errors.email) {
    if (emailRegex.test(value)) {
      delete newErrors.email;
    }
  }
}
  // Password
  if (name === "password") {
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passRegex.test(value)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number & special character";
    } else {
      delete newErrors.password;
    }
  }

  // Confirm Password
  if (name === "confirmPassword") {
    if (value !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    } else {
      delete newErrors.confirmPassword;
    }
  }

  setErrors(newErrors);

  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};
//handle blur function

const handleBlur = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };

  if (name === "email") {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      newErrors.email = "Enter valid email (example: abc@gmail.com)";
    } else {
      delete newErrors.email;
    }
  }

  setErrors(newErrors);
};
//handle subit function
  const handleSubmit = async (e) => {
    
  e.preventDefault();
   let newErrors = {};

   // First Name
  if (!/^[A-Za-z]+$/.test(formData.fname)) {
    newErrors.fname = "Only alphabets allowed";
  }

  // Last Name
  if (!/^[A-Za-z]+$/.test(formData.lname)) {
    newErrors.lname = "Only alphabets allowed";
  }

  // Email
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(formData.email)) {
    newErrors.email = "Enter valid email";
  }

  // Password
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  if (!passRegex.test(formData.password)) {
    newErrors.password =
      "Password must contain uppercase, lowercase, number & special character";
  }

  // Confirm Password
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  // ❌ Stop form submission if errors exist
  if (Object.keys(newErrors).length > 0) {
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
        setErrors({ server: data.error || "Registration Failed" });
        // alert(data.error || "Registration Failed");
    }

  } catch (error) {
    console.error("Error:", error);
    setErrors({ server: "Server Error" });
    // alert("Server Error");
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
    <input type="text" name="fname" placeholder="First Name" onChange={handleChange} onKeyPress={(e) => {
    if (!/[A-Za-z ]/.test(e.key)) {
      e.preventDefault(); // ❌ blocks numbers & symbols
    }
  }}required />
    <input type="text" name="lname" placeholder="Last Name" onChange={handleChange} onKeyPress={(e) => {
    if (!/[A-Za-z ]/.test(e.key)) {
      e.preventDefault(); // ❌ blocks numbers & symbols
    }
  }}required />
  </div>

  <div className="row">
    <select name="gender" onChange={handleChange} required>
      <option value="">Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
    <input
      type="text"
      name="dob"
      placeholder="DOB"
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => {
        if (!e.target.value) e.target.type = "text";
      }}
      max={new Date().toISOString().split("T")[0]}
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
      onBlur={handleBlur}
      title="Enter valid email (example: abc@gmail.com)"
      required
    />
    {errors.email && <p className="error">{errors.email}</p>}
  </div>

  <textarea name="address" placeholder="Full Address" onChange={handleChange} required />

  {/* LOGIN CREDENTIALS */}
  <h3 className="section-title">Login Credentials</h3>

  <div className="row">
    <div className="password-field-1" id="pwd">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <span
        className="eye-icon"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
    <div className="password-field-1" id="pwd">
      <input
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleChange}
        required
      />

      <span
        className="eye-icon"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      >
        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
    {/* <div className="errormsg"> */}
      {errors.password && <p className="error">{errors.password}</p>}
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
    {/* </div> */}
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