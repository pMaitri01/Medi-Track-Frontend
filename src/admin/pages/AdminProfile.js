import { useState, useRef } from "react";
import "../css/AdminProfile.css";

const defaultAdmin = {
  name:   "Admin User",
  email:  "admin@meditrack.com",
  mobile: "9876543210",
  photo:  "",
};

const DUMMY_OLD_PASSWORD = "Admin@123";
const pwdInitial = { oldPassword: "", newPassword: "", confirmPassword: "" };

const AdminProfile = () => {
  const [admin, setAdmin]     = useState(defaultAdmin);
  const [draft, setDraft]     = useState(defaultAdmin);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors]   = useState({});
  const fileRef = useRef(null);

  const [pwd, setPwd]             = useState(pwdInitial);
  const [pwdErrors, setPwdErrors] = useState({});
  const [showPwd, setShowPwd]     = useState({ old: false, new: false, confirm: false });
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // ── Profile handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, photo: "Only image files are allowed." }));
      return;
    }
    setDraft(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
    setErrors(prev => ({ ...prev, photo: "" }));
  };

  const validateProfile = () => {
    const e = {};
    if (!draft.name.trim()) e.name = "Name is required.";
    else if (draft.name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!draft.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) e.email = "Enter a valid email address.";
    if (!draft.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(draft.mobile.trim())) e.mobile = "Mobile must be exactly 10 digits.";
    return e;
  };

  const handleSave = () => {
    const errs = validateProfile();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setAdmin(draft);
    setEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setDraft(admin);
    setEditing(false);
    setErrors({});
  };

  // ── Password handlers ──
  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwd(prev => ({ ...prev, [name]: value }));
    if (pwdErrors[name]) setPwdErrors(prev => ({ ...prev, [name]: "" }));
    setPwdSuccess(false);
  };

  const validatePassword = () => {
    const e = {};
    if (!pwd.oldPassword)
      e.oldPassword = "Old password is required.";
    else if (pwd.oldPassword !== DUMMY_OLD_PASSWORD)
      e.oldPassword = "Old password is incorrect.";

    if (!pwd.newPassword)
      e.newPassword = "New password is required.";
    else if (pwd.newPassword.length < 6)
      e.newPassword = "Password must be at least 6 characters.";
    else if (pwd.newPassword === pwd.oldPassword)
      e.newPassword = "New password must differ from old password.";

    if (!pwd.confirmPassword)
      e.confirmPassword = "Please confirm your new password.";
    else if (pwd.newPassword !== pwd.confirmPassword)
      e.confirmPassword = "Passwords do not match.";

    return e;
  };

  const handlePwdSubmit = () => {
    const errs = validatePassword();
    if (Object.keys(errs).length > 0) { setPwdErrors(errs); return; }
    setPwd(pwdInitial);
    setPwdErrors({});
    setPwdSuccess(true);
  };

  const toggleShow = (field) =>
    setShowPwd(prev => ({ ...prev, [field]: !prev[field] }));

  const initials = admin.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="ap-page">

      {/* ── PROFILE CARD ── */}
      <div className="ap-card">
        <div className="ap-avatar-section">
          <div className="ap-avatar-wrap">
            {admin.photo ? (
              <img src={admin.photo} alt="Profile" className="ap-avatar-img" />
            ) : (
              <div className="ap-avatar-initials">{initials}</div>
            )}
            {/* photo overlay — always visible on hover */}
            <div className="ap-photo-overlay" onClick={() => fileRef.current.click()}>
              📷 Change
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
          </div>
          {errors.photo && <span className="ap-error">{errors.photo}</span>}

          {/* preview banner when a new photo is selected but not yet saved */}
          {draft.photo && draft.photo !== admin.photo && (
            <div className="ap-preview-bar">
              <img src={draft.photo} alt="Preview" className="ap-preview-thumb" />
              <div className="ap-preview-info">
                <span className="ap-preview-label">Preview — not saved yet</span>
                <div className="ap-preview-actions">
                  <button className="ap-btn-sm ap-btn-sm-save"
                    onClick={() => { setAdmin(prev => ({ ...prev, photo: draft.photo })); }}>
                    Save Photo
                  </button>
                  <button className="ap-btn-sm ap-btn-sm-cancel"
                    onClick={() => setDraft(prev => ({ ...prev, photo: admin.photo }))}>
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="ap-name">{admin.name}</h2>
          <span className="ap-role">Administrator</span>

          <label className="ap-upload-btn" onClick={() => fileRef.current.click()}>
            📤 Upload Photo
          </label>
        </div>

        <hr className="ap-divider" />

        <div className="ap-fields">
          <div className="ap-field">
            <label className="ap-label">Full Name</label>
            {editing ? (
              <>
                <input className={"ap-input" + (errors.name ? " ap-input-error" : "")}
                  name="name" value={draft.name} onChange={handleChange} />
                {errors.name && <span className="ap-error">{errors.name}</span>}
              </>
            ) : <p className="ap-value">{admin.name}</p>}
          </div>

          <div className="ap-field">
            <label className="ap-label">Email Address</label>
            {editing ? (
              <>
                <input className={"ap-input" + (errors.email ? " ap-input-error" : "")}
                  name="email" type="email" value={draft.email} onChange={handleChange} />
                {errors.email && <span className="ap-error">{errors.email}</span>}
              </>
            ) : <p className="ap-value">{admin.email}</p>}
          </div>

          <div className="ap-field">
            <label className="ap-label">Mobile Number</label>
            {editing ? (
              <>
                <input className={"ap-input" + (errors.mobile ? " ap-input-error" : "")}
                  name="mobile" type="tel" value={draft.mobile} onChange={handleChange} />
                {errors.mobile && <span className="ap-error">{errors.mobile}</span>}
              </>
            ) : <p className="ap-value">{admin.mobile}</p>}
          </div>
        </div>

        <div className="ap-actions">
          {editing ? (
            <>
              <button className="ap-btn ap-btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="ap-btn ap-btn-save" onClick={handleSave}>Save Changes</button>
            </>
          ) : (
            <button className="ap-btn ap-btn-edit" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          )}
        </div>
      </div>

      {/* ── CHANGE PASSWORD CARD ── */}
      <div className="ap-card">
        <h3 className="ap-section-title">🔒 Change Password</h3>
        <p className="ap-section-sub">Use a strong password to keep your account secure.</p>

        <hr className="ap-divider" />

        {pwdSuccess && (
          <div className="ap-success-alert">✅ Password changed successfully!</div>
        )}

        <div className="ap-fields">
          <div className="ap-field">
            <label className="ap-label">Old Password</label>
            <div className="ap-pwd-wrap">
              <input
                className={"ap-input" + (pwdErrors.oldPassword ? " ap-input-error" : "")}
                name="oldPassword"
                type={showPwd.old ? "text" : "password"}
                value={pwd.oldPassword}
                onChange={handlePwdChange}
                placeholder="Enter old password"
              />
              <button className="ap-eye-btn" onClick={() => toggleShow("old")}>
                {showPwd.old ? "🙈" : "👁️"}
              </button>
            </div>
            {pwdErrors.oldPassword && <span className="ap-error">{pwdErrors.oldPassword}</span>}
          </div>

          <div className="ap-field">
            <label className="ap-label">New Password</label>
            <div className="ap-pwd-wrap">
              <input
                className={"ap-input" + (pwdErrors.newPassword ? " ap-input-error" : "")}
                name="newPassword"
                type={showPwd.new ? "text" : "password"}
                value={pwd.newPassword}
                onChange={handlePwdChange}
                placeholder="Enter new password"
              />
              <button className="ap-eye-btn" onClick={() => toggleShow("new")}>
                {showPwd.new ? "🙈" : "👁️"}
              </button>
            </div>
            {pwdErrors.newPassword && <span className="ap-error">{pwdErrors.newPassword}</span>}
          </div>

          <div className="ap-field">
            <label className="ap-label">Confirm New Password</label>
            <div className="ap-pwd-wrap">
              <input
                className={"ap-input" + (pwdErrors.confirmPassword ? " ap-input-error" : "")}
                name="confirmPassword"
                type={showPwd.confirm ? "text" : "password"}
                value={pwd.confirmPassword}
                onChange={handlePwdChange}
                placeholder="Re-enter new password"
              />
              <button className="ap-eye-btn" onClick={() => toggleShow("confirm")}>
                {showPwd.confirm ? "🙈" : "👁️"}
              </button>
            </div>
            {pwdErrors.confirmPassword && <span className="ap-error">{pwdErrors.confirmPassword}</span>}
          </div>
        </div>

        <div className="ap-actions">
          <button className="ap-btn ap-btn-save" onClick={handlePwdSubmit}>
            🔑 Update Password
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminProfile;
