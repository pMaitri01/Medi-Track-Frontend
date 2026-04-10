import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/DoctorRegister.css";
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
  setChecking(true);

  try {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      const currentDoctor = data.find(
        (doc) =>
          doc._id === storedDoctor._id || 
          doc.email === storedDoctor.email
      );

      // if (currentDoctor) {
      //   setStatus(currentDoctor.status);

      //   // 🚀 AUTO REDIRECT WHEN APPROVED
      //   if (currentDoctor.status === "approved") {
      //     window.location.href = "/DoctorDashboard";
      //   }

      //   localStorage.setItem("doctor", JSON.stringify(currentDoctor));
      // }
      if (currentDoctor) {
  const status = currentDoctor.status?.toLowerCase();

  setStatus(status);

  localStorage.setItem("doctor", JSON.stringify(currentDoctor));

  // 🚀 REDIRECT
  if (status === "approved") {
    navigate("/DoctorProfile");
  } else if (status === "rejected") {
    navigate("/DoctorRejected");
  }
}
    }
  } catch (err) {
    console.error(err);
  }

  setChecking(false);
};

  return (
    <div className="dr-page" style={{ alignItems: "center" }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        width: "100%",
        maxWidth: 480,
        overflow: "hidden",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}>

        {/* Top colored band */}
        <div style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          padding: "32px 28px",
          textAlign: "center",
          color: "#fff",
        }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⏳</div>
          <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>Account Under Review</h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
            Your registration has been submitted successfully
          </p>
        </div>

        <div style={{ padding: "28px 28px 32px" }}>

          {/* Status badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 24,
          }}>
            <span style={{
              background: "#fefce8",
              color: "#ca8a04",
              border: "1px solid #fde68a",
              padding: "5px 18px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
            }}>
              ● {status}
            </span>
          </div>

          {/* Doctor info */}
          {doctor && (
            <div style={{
              background: "#f8fafc",
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 20,
              border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Name</span>
                  <span style={{ fontSize: 14, color: "#1e293b", fontWeight: 600 }}>{doctor.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Email</span>
                  <span style={{ fontSize: 14, color: "#1e293b" }}>{doctor.email}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Specialization</span>
                  <span style={{ fontSize: 14, color: "#1e293b" }}>{doctor.specialization}</span>
                </div>
              </div>
            </div>
          )}

          {/* Info message */}
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 22,
            fontSize: 13,
            color: "#1e40af",
            lineHeight: 1.6,
          }}>
            <strong>What happens next?</strong><br />
            Our admin team will review your registration and uploaded documents.
            You will be able to login once your account is approved.
            This usually takes <strong>1–2 business days</strong>.
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={checking}
            style={{
              width: "100%",
              padding: "11px",
              background: checking ? "#cbd5e1" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: checking ? "not-allowed" : "pointer",
              marginBottom: 14,
              fontFamily: "inherit",
              transition: "background 0.18s",
            }}
          >
            {checking ? "Checking status..." : "🔄 Refresh Status"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>
            Already approved? <Link to="/DoctorLogin" style={{ color: "#2563eb", fontWeight: 600 }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;
