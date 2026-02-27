import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/AdminLogin.css";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  if (Object.keys(newErrors).length === 0) {
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
              required
            />
          </div>

          <div className="admin-input-group">
            {/* <label>Password</label> */}
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
           {/* <p className="admin-forgot">Forgot Password?</p> */}
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
              <Link to="./demo" className="admin-text-primary">
                Register
              </Link>
            </small>

        </form>
      </div>
    </div>
  );
}