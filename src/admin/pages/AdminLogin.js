import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBlur = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name === "email") {
    if (!value) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(value)) {
      newErrors.email = "Enter valid email (example: abc@gmail.com)";
    } else {
      delete newErrors.email;
    }
  }

  if (name === "password") {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!value) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(value)) {
      newErrors.password =
        "Password must be strong (Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special char)";
    } else {
      delete newErrors.password;
    }
  }

  setErrors(newErrors);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};


  // Stop if errors exist
  if (Object.keys(newErrors).length > 0) return;


  // if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/Doctor/login",  
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("doc", JSON.stringify(data.doc));
      }
      else{
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  // } 
  };

  return (
    <div className="doctor-login-container">
      <div className="admin-login-card">
        <h2>Doctor's Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            {/* <label>Email</label> */}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

           <div className="admin-input-group">

          {/* wrapper ONLY for input + icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />

            <span
              className="eye-icon-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* error OUTSIDE wrapper */}
          {errors.password && <p className="error">{errors.password}</p>}

        </div>
          <small className="admin-text-primary">
                  <Link to="./demo" className="admin-text-primary">
                      Forgot Password?
                  </Link>

          </small>
          <button type="submit" className="admin-login-btn">
            Login
          </button>

           <small className="admin-txtregister">
              Don’t have account? 
               {/* <span className="text-primary"> Register</span>  */}
              <Link to="/AdminSignUp" className="admin-text-primary">
                Register
              </Link>
            </small>

        </form>
      </div>
    </div>
  );
}