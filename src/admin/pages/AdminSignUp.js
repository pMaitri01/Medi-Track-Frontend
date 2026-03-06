import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminSignUp.css";

export default function DoctorSignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  //handleChange REQUIRED
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleBlur = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };

  //Full Name
  if (name === "fullName") {
    if (!value) {
      newErrors.fullName = "Full Name required";
    } else if (!/^[A-Za-z ]+$/.test(value)) {
      newErrors.fullName = "Only alphabets allowed";
    } else {
      delete newErrors.fullName;
    }
  }

  // Email
  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      newErrors.email = "Email required";
    } else if (!emailRegex.test(value)) {
      newErrors.email = "Enter valid email (eg: abc@gmail.com)";
    } else {
      delete newErrors.email;
    }
  }

  // Password
  if (name === "password") {
    const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!value) {
      newErrors.password = "Password required";
    } 
    else if (!strongPassword.test(value)) {
      newErrors.password =
        " Password Must be Strong (Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special char)";
    } 
    else {
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
};
  //No validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      alert("Please fix errors first");
      return;
    }
    else{
      alert("Doctor successfully register")
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/doctor/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      alert("Doctor Registered Successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <h2 className="admin-title">Doctor SignUp</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[A-Za-z ]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onBlur={handleBlur}
            required
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}

          {/* <div className="admin-row"> */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          {/* </div> */}

          <div className="admin-row">

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="input-group">
             <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button type="submit" className="admin-register-btn">
            Register
          </button>
        </form>

        <div className="log">
          <small className="txtlog">
            Already have account?
            <Link to="/AdminLogin" className="text-primary">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}