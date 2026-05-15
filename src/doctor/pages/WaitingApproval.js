import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/WaitingApproval.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const WaitingApproval = () => {
  const [doctor, setDoctor] = useState(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus]     = useState("Pending");
const navigate = useNavigate();

  // useEffect(() => {
  //   const stored = sessionStorage.getItem("pendingDoctor");
  //   if (stored) setDoctor(JSON.parse(stored));
  // }, []);
useEffect(() => {
  const fetchDoctorData = async () => {
    try {
      const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
      if (!storedDoctor) return;

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      const data = await res.json();

      // ✅ FIX HERE
      const doctorsArray = data.doctors;

      const currentDoctor = doctorsArray.find(
        (doc) =>
          doc._id === storedDoctor._id ||
          doc.email === storedDoctor.email
      );

      // if (currentDoctor) {
      //   setDoctor({
      //     name: currentDoctor.fullName,
      //     email: currentDoctor.email,
      //     specialization: currentDoctor.specialization,
      //   });

      //   setStatus(currentDoctor.status);

      //   // update latest data
      //   localStorage.setItem("doctor", JSON.stringify(currentDoctor));
      // }
      if (currentDoctor) {
  const status = currentDoctor.status?.toLowerCase();

  setDoctor({
    name: currentDoctor.fullName,
    email: currentDoctor.email,
    specialization: currentDoctor.specialization,
  });

  setStatus(status);

  // ✅ update latest data
  localStorage.setItem("doctor", JSON.stringify(currentDoctor));

  // 🚀 REDIRECTION
  if (status === "approved") {
    navigate("/DoctorProfile");   // ✅ changed
  } else if (status === "rejected") {
    navigate("/DoctorRejected");  // ✅ same
  }
}

    } catch (err) {
      console.error(err);
    }
  };

  fetchDoctorData();
}, []);
const handleRefresh = async () => {
  const toastId = toast.loading("Checking approval status...");
  setChecking(true);

  try {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      toast.update(toastId, {
        render: "Failed to fetch data",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    const currentDoctor = data.doctors.find(
      (doc) =>
        doc._id === storedDoctor._id ||
        doc.email === storedDoctor.email
    );

    if (!currentDoctor) {
      toast.update(toastId, {
        render: "Doctor not found",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    const newStatus = currentDoctor.status?.toLowerCase();

    setStatus(newStatus);
    localStorage.setItem("doctor", JSON.stringify(currentDoctor));

    // ✅ STATUS HANDLING
    if (newStatus === "pending") {
      toast.update(toastId, {
        render: "Still under review ⏳",
        type: "info",
        isLoading: false,
        autoClose: 3000,
      });
    }

    else if (newStatus === "approved") {
      toast.update(toastId, {
        render: "Account approved 🎉 Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => navigate("/DoctorProfile"), 2000);
    }

    else if (newStatus === "rejected") {
      toast.update(toastId, {
        render: "Account rejected ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => navigate("/DoctorRejected"), 2000);
    }

  } catch (err) {
    console.error(err);

    toast.update(toastId, {
      render: "Server error. Try again.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }

  setChecking(false);
};

//   const handleRefresh = async () => {
//   const toastId = toast.loading("Checking approval status...");
//   setChecking(true);

//   try {
//     const storedDoctor = JSON.parse(localStorage.getItem("doctor"));

//     const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/all`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const data = await res.json();

//     if (res.ok) {
//       const currentDoctor = data.find(
//         (doc) =>
//           doc._id === storedDoctor._id || 
//           doc.email === storedDoctor.email
//       );

//       // if (currentDoctor) {
//       //   setStatus(currentDoctor.status);

//       //   // 🚀 AUTO REDIRECT WHEN APPROVED
//       //   if (currentDoctor.status === "approved") {
//       //     window.location.href = "/DoctorDashboard";
//       //   }

//       //   localStorage.setItem("doctor", JSON.stringify(currentDoctor));
//       // }
//       if (currentDoctor) {
//         if (status === "pending") {
//   toast.update(toastId, {
//     render: "Still under review ⏳",
//     type: "info",
//     isLoading: false,
//     autoClose: 3000,
//   });
// }
//   const status = currentDoctor.status?.toLowerCase();

//   setStatus(status);

//   localStorage.setItem("doctor", JSON.stringify(currentDoctor));

//   // 🚀 REDIRECT
//   if (status === "approved") {
//     toast.update(toastId, {
//   render: "Account approved 🎉 Redirecting...",
//   type: "success",
//   isLoading: false,
//   autoClose: 2000,
// });

// setTimeout(() => navigate("/DoctorProfile"), 2000);
//     navigate("/DoctorProfile");
//   } else if (status === "rejected") {
//     toast.update(toastId, {
//   render: "Account rejected ❌",
//   type: "error",
//   isLoading: false,
//   autoClose: 3000,
// });

// setTimeout(() => navigate("/DoctorRejected"), 2000);
//     navigate("/DoctorRejected");
//   }
// }
//     }
//   } catch (err) {
//     console.error(err);
//       toast.error("Failed to check status. Try again.");

//   }

//   setChecking(false);
// };

  return (
    <div className="dwait-page">
      <div className="dwait-card">

        {/* Top colored band */}
        <div className="dwait-band">
          <div className="dwait-band-icon">⏳</div>
          <h2 className="dwait-band-title">Account Under Review</h2>
          <p className="dwait-band-subtitle">
            Your registration has been submitted successfully
          </p>
        </div>

        <div className="dwait-body">

          {/* Status badge */}
          <div className="dwait-badge-row">
            <span className={`dwait-badge dwait-badge--${status}`}>
              ● {status}
            </span>
          </div>

          {/* Doctor info */}
          {doctor && (
            <div className="dwait-info-box">
              <div className="dwait-info-list">
                <div className="dwait-info-row">
                  <span className="dwait-info-label">Name</span>
                  <span className="dwait-info-value dwait-info-value--strong">{doctor.name}</span>
                </div>
                <div className="dwait-info-row">
                  <span className="dwait-info-label">Email</span>
                  <span className="dwait-info-value">{doctor.email}</span>
                </div>
                <div className="dwait-info-row">
                  <span className="dwait-info-label">Specialization</span>
                  <span className="dwait-info-value">{doctor.specialization}</span>
                </div>
              </div>
            </div>
          )}

          {/* Info message */}
          <div className="dwait-notice">
            <strong>What happens next?</strong><br />
            Our admin team will review your registration and uploaded documents.
            You will be able to login once your account is approved.
            This usually takes <strong>1–2 business days</strong>.
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="dwait-refresh-btn"
          >
            {checking ? "Checking status..." : "🔄 Refresh Status"}
          </button>

          <p className="dwait-login-text">
            Already approved? <Link to="/DoctorLogin" className="dwait-login-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;
