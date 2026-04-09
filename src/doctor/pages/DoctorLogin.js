// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "../css/AdminLogin.css";

// export default function DoctorLogin() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleBlur = (e) => {
//   const { name, value } = e.target;
//   let newErrors = { ...errors };

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (name === "email") {
//     if (!value) {
//       newErrors.email = "Email is required";
//     } else if (!emailRegex.test(value)) {
//       newErrors.email = "Enter valid email (example: abc@gmail.com)";
//     } else {
//       delete newErrors.email;
//     }
//   }

//   if (name === "password") {

//     if (!value) {
//       newErrors.password = "Password is required";
//     } else if (value.length < 6) {
//     newErrors.password = "Password must be at least 6 characters";
//   } else {
//       delete newErrors.password;
//     }
//   }

//   setErrors(newErrors);
// };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};


//   // Stop if errors exist
//   if (Object.keys(newErrors).length > 0) return;


//   // if (Object.keys(newErrors).length === 0) {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/doctor/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//           }),
//         }
//       );

//       const data = await response.json();

//    if (response.ok) {
//   alert("Login Successful");

//   console.log("LOGIN RESPONSE:", data);

//   const doctor = data.doctor || data.data?.doctor;

//   // 🔥 HANDLE ALL CASES
//   const token =
//     data.token ||
//     data.accessToken ||
//     data.data?.token ||
//     data.data?.accessToken;

//   if (!token) {
//     console.error("❌ TOKEN NOT FOUND IN RESPONSE");
//     alert("Login failed: Token not received");
//     return;
//   }

//   // ✅ SAVE TOKEN
//   localStorage.setItem("token", token);

//   // (optional)
//   localStorage.setItem("doctor", JSON.stringify(doctor));

//   console.log("✅ TOKEN SAVED:", token);

//   setFormData({ email: "", password: "" });
//   setErrors({});

//   if (doctor?.isProfileComplete) {
//     navigate("/DoctorDashboard");
//   } else {
//     navigate("/DoctorProfile");
//   }
// } else {
//         // Handle status-specific errors
//         const msg = data.message || data.msg || "";
//         if (msg.toLowerCase().includes("pending") || msg.toLowerCase().includes("not approved")) {
//           setErrors({ status: "Your account is not approved yet. Please wait for admin approval." });
//         } else if (msg.toLowerCase().includes("reject")) {
//           setErrors({ status: "Your registration was rejected. Please contact admin for details." });
//         } else {
//           setErrors({ ...errors, password: msg || "Invalid email or password." });
//         }
//       }

//     } catch (error) {
//       console.error(error);
//       alert("Server Error");
//     }
//   };

//   return (
//     <div className="doctor-login-container">
//       <div className="admin-login-card">
//         <h2>Doctor's Login</h2>

//         <form onSubmit={handleSubmit}>
//           {errors.status && (
//             <div style={{
//               background: errors.status.includes("not approved") ? "#fefce8" : "#fef2f2",
//               border: `1px solid ${errors.status.includes("not approved") ? "#fde68a" : "#fecaca"}`,
//               color: errors.status.includes("not approved") ? "#92400e" : "#dc2626",
//               borderRadius: 8,
//               padding: "10px 14px",
//               fontSize: 13,
//               fontWeight: 600,
//               marginBottom: 14,
//               lineHeight: 1.5,
//             }}>
//               {errors.status.includes("not approved") ? "⏳" : "❌"} {errors.status}
//             </div>
//           )}
//           <div className="admin-input-group">
//             {/* <label>Email</label> */}
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               required
//             />
//             {errors.email && <p className="error">{errors.email}</p>}
//           </div>

//            <div className="admin-input-group">

//           {/* wrapper ONLY for input + icon */}
//           <div className="password-wrapper">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               required
//             />

//             <span
//               className="eye-icon-1"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>

//           {/* error OUTSIDE wrapper */}
//           {errors.password && <p className="error">{errors.password}</p>}

//         </div>

//             <div className="d-flex justify-content-between">
//                           <small className="admin-text-rmbr">
//                             <input type="checkbox" className="ckb"/> Remember me
//                           </small>
//                           <small className="admin-text-primary">
//                               <Link to="/DoctorForgotPassword" className="admin-text-fpwd">
//                                   Forgot Password?
//                               </Link>
            
//                           </small>
//                         </div>

//           <button type="submit" className="admin-login-btn">
//             Login
//           </button>

//            <small className="admin-txtregister">
//               Don’t have account? 
//                {/* <span className="text-primary"> Register</span>  */}
//               <Link to="/DoctorRegister" className="admin-text-primary">
//                 Register
//               </Link>
//             </small>

//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";
// Replace this with your actual doctor image path
import doctorImage from "../images/doclogin.png"; 

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

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Enter valid email (example: abc@gmail.com)";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6) error = "Password must be at least 6 characters";
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailErr = validateField("email", formData.email);
    const passErr = validateField("password", formData.password);
    
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Login Successful");
          const doctor = data.doctor || data.data?.doctor;
          const token = data.token || data.accessToken || data.data?.token || data.data?.accessToken;
          
          localStorage.setItem("token", token);
          localStorage.setItem("doctor", JSON.stringify(doctor));

          if (doctor?.isProfileComplete) navigate("/DoctorDashboard");
          else navigate("/DoctorProfile");
        } else {
          const msg = data.message || data.msg || "";
          if (msg.toLowerCase().includes("pending") || msg.toLowerCase().includes("not approved")) {
            setErrors({ status: "Your account is not approved yet." });
          } else {
            setErrors({ ...errors, password: msg || "Invalid email or password." });
          }
        }
      } catch (error) {
        alert("Server Error");
      }
    }
  };

  return (
    <div className="dr-login-page-wrapper">
      <div className="dr-main-title-box">
        <h1>DOC <span>TOR</span></h1>
        <p className="dr-head-subtext">LOGIN</p>
      </div>

      <div className="dr-login-split-card">
        {/* LEFT SIDE - FORM */}
        <div className="dr-form-container">
          <h2 className="dr-login-title">Login</h2>
          
          {errors.status && <div className="dr-status-alert">{errors.status}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`dr-input-field ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <span className="dr-error-msg">{errors.email}</span>}

            <div className="dr-password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`dr-input-field ${errors.password ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="dr-toggle-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <span className="dr-error-msg">{errors.password}</span>}

            <div className="dr-utility-row">
              <small>
                <input type="checkbox" className="dr-checkbox-style" /> Remember me
              </small>
              <Link to="/DoctorForgotPassword" className="dr-link-teal">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="dr-submit-btn">Login</button>

            <div style={{ textAlign: "center" }}>
              <small style={{ color: "#666" }}>
                Don’t have account? 
                <Link to="/DoctorRegister" className="dr-link-teal" style={{ marginLeft: "5px", fontWeight: "600" }}>
                   Register
                </Link>
              </small>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="dr-image-container">
          <img src={doctorImage} alt="Doctor Login Illustration" />
        </div>
      </div>
    </div>
  );
}