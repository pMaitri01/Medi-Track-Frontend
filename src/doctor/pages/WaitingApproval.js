import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/DoctorRegister.css";

const WaitingApproval = () => {
  const [doctor, setDoctor] = useState(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus]     = useState("Pending");

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingDoctor");
    if (stored) setDoctor(JSON.parse(stored));
  }, []);

  const handleRefresh = () => {
    setChecking(true);
    // Simulate status check — in real app call API
    setTimeout(() => {
      setChecking(false);
      setStatus("Pending"); // stays pending until admin acts
    }, 1500);
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
