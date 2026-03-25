import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
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
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!value) {
      newErrors.password = "Password is required";
    } else if (value.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
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
        `${process.env.REACT_APP_API_URL}/api/Doctor/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login Successful");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: ""
        });

        setErrors({});
        navigate("/DoctorDashboard");   // redirect page

      }
      else{
        setErrors({
            ...errors,
            password: data.message || "password Incorrect"
        });      
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
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

            <div className="d-flex justify-content-between">
                          <small className="admin-text-rmbr">
                            <input type="checkbox" className="ckb"/> Remember me
                          </small>
                          <small className="admin-text-primary">
                              <Link to="/forgotpassword" className="admin-text-fpwd">
                                  Forgot Password?
                              </Link>
            
                          </small>
                        </div>

          <button type="submit" className="admin-login-btn">
            Login
          </button>

           <small className="admin-txtregister">
              Don’t have account? 
               {/* <span className="text-primary"> Register</span>  */}
              <Link to="/DoctorSignUp" className="admin-text-primary">
                Register
              </Link>
            </small>

        </form>
      </div>
    </div>
  );
}