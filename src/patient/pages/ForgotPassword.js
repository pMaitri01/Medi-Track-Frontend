// import React, { useState } from "react";
// import forgotImage from "../images/forgotpwd.png";
// import "./ForgotPassword.css";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!email) {
//       alert("Please enter your registered email");
//       return;
//     }

//     alert("OTP sent to " + email);
//   };

//   return (
//     <div className="forgot-container">
//       <div className="forgot-box">
//         <div className="forgot-left">
//           <img src={forgotImage} alt="Forgot Password" />
//         </div>

//         <div className="forgot-right">
//           <div className="forgot-card">
//             <h3>Enter your email to receive OTP</h3>
//             {/* <p>Forgot Password</p> */}

//             <form onSubmit={handleSubmit}>
//               <input
//                 type="email"
//                 placeholder="Enter Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <button type="submit">Send OTP</button>
//             </form>

//             {/* <a href="/login" className="back-link">
//               Back to Login
//             </a> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import forgotImage from "../images/forgotpwd.png";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Empty validation
    if (!email) {
      setError("Email Is Required");
      return;
    }

    // Format validation
    if (!validateEmail(email)) {
      setError("Please Enter A Valid Email Address");
      return;
    }

    // If valid
    setError("");
    navigate("/otp");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <div className="forgot-left">
          <img src={forgotImage} alt="Forgot Password" />
        </div>

        <div className="forgot-right">
          <div className="forgot-card">
            <h3>Enter your email to receive OTP</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // clear error while typing
                }}
                className={error ? "input-error" : ""}
              />

              {error && <p className="error-text">{error}</p>}
            
              <button type="submit">
                Send OTP
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
