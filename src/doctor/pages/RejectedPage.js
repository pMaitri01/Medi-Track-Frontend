import { useNavigate, useLocation } from "react-router-dom";
import "../css/DoctorStatus.css";

const RejectedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const reason = location.state?.reason || "Your application did not meet our current requirements.";
  const doctor = location.state?.doctor || null;

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");
    navigate("/DoctorLogin");
  };

  return (
    <div className="ds-page">
      <div className="ds-card">

        {/* Top band */}
        <div className="ds-band ds-band--rejected">
          <div className="ds-band-icon">❌</div>
          <h1>Application Rejected</h1>
          <p>Unfortunately your registration was not approved.</p>
        </div>

        <div className="ds-body">

          {/* Status badge */}
          <div className="ds-badge-row">
            <span className="ds-badge ds-badge--rejected">● Rejected</span>
          </div>

          {/* Doctor info */}
          {doctor && (
            <div className="ds-info-box">
              {doctor.name && (
                <div className="ds-info-row">
                  <span className="ds-info-label">Name</span>
                  <span className="ds-info-value">{doctor.name}</span>
                </div>
              )}
              {doctor.email && (
                <div className="ds-info-row">
                  <span className="ds-info-label">Email</span>
                  <span className="ds-info-value">{doctor.email}</span>
                </div>
              )}
            </div>
          )}

          {/* Rejection reason — prominently displayed */}
          <div className="ds-reason-box">
            <p className="ds-reason-label">📋 Reason for Rejection</p>
            <p className="ds-reason-text">{reason}</p>
          </div>

          {/* Actions */}
          <div className="ds-btn-group">
            <button
              className="ds-btn ds-btn--primary"
              onClick={() => navigate("/DoctorRegister")}
            >
              🔁 Register Again
            </button>
            {/* <button className="ds-btn ds-btn--secondary" onClick={handleLogout}>
              🚪 Logout
            </button> */}
          </div>

          {/* <p className="ds-footer-link">
            Need help? <a href="mailto:support@meditrack.com">Contact support</a>
          </p> */}

        </div>
      </div>
    </div>
  );
};

export default RejectedPage;
