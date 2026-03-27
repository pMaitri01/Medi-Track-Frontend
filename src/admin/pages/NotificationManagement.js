import { useState } from "react";
import "../css/NotificationManagement.css";

const dummyNotifications = [
  { id: 1, target: "All",     message: "System maintenance scheduled on 30 Mar 2026 from 2 AM to 4 AM.", time: "27 Mar 2026, 10:00 AM" },
  { id: 2, target: "Doctor",  message: "Please update your availability schedule for April 2026.",        time: "26 Mar 2026, 03:30 PM" },
  { id: 3, target: "Patient", message: "Your appointment reminder: Visit scheduled for tomorrow.",        time: "25 Mar 2026, 09:00 AM" },
  { id: 4, target: "Doctor",  message: "New patient registration guidelines have been updated.",          time: "24 Mar 2026, 11:15 AM" },
  { id: 5, target: "All",     message: "MediTrack app will be updated to v2.0 this weekend.",            time: "23 Mar 2026, 05:00 PM" },
];

const targetIcon  = { All: "📢", Doctor: "🧑‍⚕️", Patient: "🧑‍🤝‍🧑" };
const targetClass = { All: "nm-tag nm-tag-all", Doctor: "nm-tag nm-tag-doctor", Patient: "nm-tag nm-tag-patient" };

const NotificationManagement = () => {
  const [target, setTarget]   = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors]   = useState({});
  const [list, setList]       = useState(dummyNotifications);
  const [toast, setToast]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const validate = () => {
    const e = {};
    if (!target)                         e.target  = "Please select a target user type.";
    if (!message.trim())                 e.message = "Message cannot be empty.";
    else if (message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSend = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const time = new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

    // add to list
    setList(prev => [{ id: Date.now(), target, message: message.trim(), time }, ...prev]);

    // clear form
    setTarget("");
    setMessage("");
    setErrors({});

    // show toast for 3 seconds
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleDelete = (id) => setDeleteId(id);

  const confirmDelete = () => {
    setList(prev => prev.filter(n => n.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="nm-page">

      {/* ── FLOATING TOAST ── */}
      {toast && (
        <div className="nm-toast">
          <span>✅</span>
          <span>Notification Sent Successfully!</span>
        </div>
      )}

      {/* ── SEND FORM ── */}
      <div className="nm-card">
        <div className="nm-card-title">
          <span>📣</span> Send Notification
        </div>

        <div className="nm-form">
          <div className="nm-field">
            <label className="nm-label">Target Users <span className="nm-req">*</span></label>
            <select
              className={"nm-select" + (errors.target ? " nm-input-error" : "")}
              value={target}
              onChange={(e) => { setTarget(e.target.value); setErrors(p => ({ ...p, target: "" })); }}
            >
              <option value="">Select user type</option>
              <option value="All">📢 All Users</option>
              <option value="Doctor">🧑‍⚕️ Doctors Only</option>
              <option value="Patient">🧑‍🤝‍🧑 Patients Only</option>
            </select>
            {errors.target && <span className="nm-error">{errors.target}</span>}
          </div>

          <div className="nm-field">
            <label className="nm-label">Message <span className="nm-req">*</span></label>
            <textarea
              className={"nm-textarea" + (errors.message ? " nm-input-error" : "")}
              rows={4}
              placeholder="Type your notification message here..."
              value={message}
              onChange={(e) => { setMessage(e.target.value); setErrors(p => ({ ...p, message: "" })); }}
            />
            <div className="nm-char-count">{message.length} characters</div>
            {errors.message && <span className="nm-error">{errors.message}</span>}
          </div>

          <div className="nm-form-footer">
            <button className="nm-send-btn" onClick={handleSend}>
              📤 Send Notification
            </button>
          </div>
        </div>
      </div>

      {/* ── SENT LIST ── */}
      <div className="nm-card">
        <div className="nm-card-title">
          <span>📋</span> Sent Notifications
          <span className="nm-count">{list.length}</span>
        </div>

        {list.length === 0 ? (
          <div className="nm-empty">
            <span>📭</span>
            <p>No notifications sent yet.</p>
          </div>
        ) : (
          <ul className="nm-list">
            {list.map(n => (
              <li key={n.id} className="nm-item">
                <div className="nm-item-top">
                  <span className={targetClass[n.target]}>
                    {targetIcon[n.target]} {n.target}
                  </span>
                  <span className="nm-time">{n.time}</span>
                  <button className="nm-delete-btn" onClick={() => handleDelete(n.id)} title="Delete">✕</button>
                </div>
                <p className="nm-message">{n.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── DELETE CONFIRM DIALOG ── */}
      {deleteId && (
        <div className="nm-overlay">
          <div className="nm-dialog">
            <div className="nm-dialog-icon">🗑️</div>
            <h3>Delete Notification?</h3>
            <p>This notification will be permanently removed. Are you sure?</p>
            <div className="nm-dialog-actions">
              <button className="nm-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="nm-btn-confirm" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotificationManagement;
