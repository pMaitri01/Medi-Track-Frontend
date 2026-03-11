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
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  //   // First Name & Last Name (only alphabets)
  // if (name === "fname" || name === "lname") {
  //   if (/^[A-Za-z]*$/.test(value)) {
  //     setFormData({ ...formData, [name]: value });
  //   }
  //   return;
  // }
  // };
  const handleChange = (e) => {
  const { name, value } = e.target; // ✅ VERY IMPORTANT

  // ✅ First Name & Last Name (only alphabets)
  if (name === "fname" || name === "lname") {
    if (/^[A-Za-z]*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    return;
  }

  // ✅ Mobile (only digits, max 10)
  if (name === "mobile") {
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFormData((prev) => ({ ...prev, mobile: value }));
    }
    return;
  }
  // Mobile Number 
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
  // ✅ Normal fields
  setFormData((prev) => ({ ...prev, [name]: value }));
};
     const navigate = useNavigate();

//handle subit function
  const handleSubmit = async (e) => {
    
  e.preventDefault();
   let newErrors = {};

   const { name, value } = e.target;
   setFormData((prev) => ({ ...prev, [name]: value }));

  // name 
   if (name === "fname" || name === "lname") {
    if (!/^[A-Za-z]*$/.test(value)) {
      newErrors[name] = "Only alphabets allowed";
    } else {
      delete newErrors[name];
    }
  }

  // email
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  
  //   if (!emailRegex.test(formData.email)) {
  //   newErrors.email = "Enter valid email (example: abc@gmail.com)";
  // }
  if (name === "email") {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      newErrors.email = "Enter valid email (example: abc@gmail.com)";
    } else {
      delete newErrors.email;
    }
  }
// pwd
  // const passRegex =
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  // if (!passRegex.test(formData.password)) {
  //   newErrors.password =
  //     "Password must contain uppercase, lowercase, number & special character";
  // }
  if (name === "password"){
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passRegex.test(value)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number & special character";
    } else {
      delete newErrors.password;
    }
  }

  // Confirm password match
  // if (formData.password !== formData.confirmPassword) {
  //   newErrors.confirmPassword = "Passwords do not match";
  // }
  if (name === "confirmPassword") {
    if (value !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    } else {
      delete newErrors.confirmPassword;
    }
  }

  setErrors(newErrors);
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
    {errors.password && <p className="error">{errors.password}</p>}
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
    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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