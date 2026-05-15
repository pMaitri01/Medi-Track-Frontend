import { useNavigate, useLocation } from "react-router-dom";
import "../css/RejectedPage.css";
import { toast } from "react-toastify";

const RejectedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const reason = location.state?.reason || "Your application did not meet our current requirements.";
  const doctor = location.state?.doctor || null;

 const handleLogout = () => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to logout?</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => {
              sessionStorage.clear();
              localStorage.removeItem("token");
              localStorage.removeItem("doctor");
              closeToast();
              toast.success("Logged out successfully");
              navigate("/DoctorLogin");
            }}
            style={{
              padding: "6px 12px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>

          <button
            onClick={() => {
              closeToast();
              toast.info("Logout cancelled");
            }}
            style={{
              padding: "6px 12px",
              background: "#e5e7eb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
};

  return (
    <div className="drej-page">
      <div className="drej-card">

        {/* Top band */}
        <div className="drej-band drej-band--rejected">
          <div className="drej-band-icon">❌</div>
          <h1>Application Rejected</h1>
          <p>Unfortunately your registration was not approved.</p>
        </div>

        <div className="drej-body">

          {/* Status badge */}
          <div className="drej-badge-row">
            <span className="drej-badge drej-badge--rejected">● Rejected</span>
          </div>

          {/* Doctor info */}
          {doctor && (
            <div className="drej-info-box">
              {doctor.name && (
                <div className="drej-info-row">
                  <span className="drej-info-label">Name</span>
                  <span className="drej-info-value">{doctor.name}</span>
                </div>
              )}
              {doctor.email && (
                <div className="drej-info-row">
                  <span className="drej-info-label">Email</span>
                  <span className="drej-info-value">{doctor.email}</span>
                </div>
              )}
            </div>
          )}

          {/* Rejection reason — prominently displayed */}
          <div className="drej-reason-box">
            <p className="drej-reason-label">📋 Reason for Rejection</p>
            <p className="drej-reason-text">{reason}</p>
          </div>

          {/* Actions */}
          <div className="drej-btn-group">
            <button
              className="drej-btn drej-btn--primary"
              onClick={() => navigate("/DoctorRegister")}
            >
              🔁 Register Again
            </button>
            {/* <button className="drej-btn drej-btn--secondary" onClick={handleLogout}>
              🚪 Logout
            </button> */}
          </div>

          {/* <p className="drej-footer-link">
            Need help? <a href="mailto:support@meditrack.com">Contact support</a>
          </p> */}

        </div>
      </div>
    </div>
  );
};

export default RejectedPage;
