import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import patientImage from "../images/patient-1.jpg";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  }); 

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate Single Field
  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
      }
    }

    return error;
  };

  // Handle Blur (Field Level Validation)
  const handleBlur = (e) => {
    const { name, value } = e.target;

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };
  
  const navigate = useNavigate();
  
  // Handle Submit (Full Form Validation)
  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  const emailError = validateField("email", formData.email);
  if (emailError) newErrors.email = emailError;

  const passwordError = validateField("password", formData.password);
  if (passwordError) newErrors.password = passwordError;

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/patient/login",  
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
        navigate("/PatientHome");
      }
      else{
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  } 
};
  return (
    <div className="login-container">
      <div className="main-heading">
        <h1>
          PATI <span>ENT</span>
          <br />
          <p className="headspan">LOGIN</p>
        </h1>
      </div>

      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="left-section">
          <h2 className="login-heading">Login</h2>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <input
              type="text"
              name="email"
              className={`form-control mb-3 ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}

            {/* Password */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control mb-3 ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )}

            <div className="d-flex justify-content-between mb-3">
              <small>
                <input type="checkbox" className="ckb"/> Remember me
              </small>
              <small className="text-primary">
                  <Link to="/forgotpassword" className="text-primary">
                      Forgot Password?
                  </Link>

              </small>
            </div>

            <button type="submit" className="btn btn-info w-100 mb-2">
              Login
            </button>

            <small className="txtreg">
              Don’t have account?
              {/* <span className="text-primary"> Register</span> */}
              <Link to="/Registration" className="text-primary">
                Register
              </Link>
            </small>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <img src={patientImage} alt="Patient Login" />
        </div>
      </div>
    </div>
  );
}