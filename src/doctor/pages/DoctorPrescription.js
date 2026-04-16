import { useState, useEffect } from "react";
import DoctorNavbar from "../components/DoctorNavbar";
import DoctorHeader from "../components/DoctorHeader";
import "../css/DoctorPrescription.css";
import { generateDoctorPrescriptionPDF } from "../utils/generateDoctorPrescriptionPDF";

const BLANK_MEDICINE = () => ({ id: "", name: "", dosage: "", timing: [], foodPref: {}, duration: "", status: "Active" });
const BLANK_FORM = () => ({
  id: "",
  patientId: "", patientName: "", date: new Date().toISOString().split("T")[0],
  diagnosis: "", notes: "", medicines: [BLANK_MEDICINE()],
});

const TIMINGS = ["Morning", "Afternoon", "Night"];
const TIMING_ICON = { Morning: "🌅", Afternoon: "🌇", Night: "🌙" };
const FOOD_OPTS = ["Before Food", "After Food"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ── MedStatusToggle ──────────────────────────────────────────────────────────
function MedStatusToggle({ med, index, onChange, prescriptionId }) {
  const [busy, setBusy] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === med.status) return;

    if (!prescriptionId) return;

    onChange(index, { field: "status", val: newStatus });

    setBusy(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/prescription/${prescriptionId}/medicine/${med.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onChange(index, { field: "status", val: newStatus });
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const isActive = (med.status || "Active") === "Active";

  return (
    <div className="dpresc-med-status-wrap">
      <select
        className={`dpresc-med-status-sel${isActive ? " dpresc-med-status--active" : " dpresc-med-status--done"}`}
        value={med.status || "Active"}
        onChange={handleChange}
        disabled={busy || !prescriptionId}
        title="Medicine status"
      >
        <option value="Active">🟢 Active</option>
        <option value="Completed">⚪ Completed</option>
      </select>
    </div>
  );
}

// ── MedicineRow ──────────────────────────────────────────────────────────────
function MedicineRow({ med, index, onChange, onRemove, canRemove, prescriptionId }) {

  function handleTimingClick(slot) {
    const active = med.timing.includes(slot);
    const nextTiming = active
      ? med.timing.filter((t) => t !== slot)
      : [...med.timing, slot];
    const nextFoodPref = { ...med.foodPref };
    if (active) {
      delete nextFoodPref[slot];
    } else {
      nextFoodPref[slot] = "After Food";
    }
    onChange(index, { timing: nextTiming, foodPref: nextFoodPref });
  }

  function handleFoodClick(slot, opt) {
    onChange(index, { foodPref: { ...med.foodPref, [slot]: opt } });
  }

  const activeSlotsInOrder = TIMINGS.filter((s) => med.timing.includes(s));

  return (
    <div className="dpresc-med-entry">
      <div className="dpresc-med-inputs">
        <div className="dpresc-med-index">{index + 1}</div>

        <input
          className="dpresc-input"
          placeholder="Medicine name"
          value={med.name}
          onChange={(e) => onChange(index, { field: "name", val: e.target.value })}
        />

        <input
          className="dpresc-input"
          placeholder="Dosage (e.g. 500mg)"
          value={med.dosage}
          onChange={(e) => onChange(index, { field: "dosage", val: e.target.value })}
        />

        <div className="dpresc-timing-checks">
          {TIMINGS.map((slot) => {
            const isOn = med.timing.includes(slot);
            return (
              <div
                key={slot}
                role="button"
                tabIndex={0}
                className={`dpresc-timing-chip${isOn ? " dpresc-timing-chip--on" : ""}`}
                onClick={() => handleTimingClick(slot)}
                onKeyDown={(e) => e.key === "Enter" && handleTimingClick(slot)}
              >
                {TIMING_ICON[slot]} {slot}
              </div>
            );
          })}
        </div>

        <input
          className="dpresc-input"
          placeholder="Duration (e.g. 7 days)"
          value={med.duration}
          onChange={(e) => onChange(index, { field: "duration", val: e.target.value })}
        />

        <MedStatusToggle med={med} index={index} onChange={onChange} prescriptionId={prescriptionId} />

        {canRemove
          ? <button className="dpresc-med-remove" onClick={() => onRemove(index)} title="Remove">✕</button>
          : <span />
        }
      </div>

      {activeSlotsInOrder.length > 0 && (
        <div className="dpresc-food-panel">
          <span className="dpresc-food-panel-label">🍽️ Food Preference</span>
          <div className="dpresc-food-rows">
            {activeSlotsInOrder.map((slot) => (
              <div key={slot} className="dpresc-food-row">
                <span className="dpresc-food-slot-label">
                  {TIMING_ICON[slot]} {slot}
                </span>
                <div className="dpresc-food-toggle">
                  {FOOD_OPTS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`dpresc-food-btn${med.foodPref[slot] === opt ? " dpresc-food-btn--on" : ""}`}
                      onClick={() => handleFoodClick(slot, opt)}
                    >
                      {opt === "Before Food" ? "⬆️" : "⬇️"} {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PrescriptionForm ─────────────────────────────────────────────────────────
function PrescriptionForm({ form, setForm, onSave, onCancel, isEdit, patients }) {
  const updateMed = (i, fields) => {
    const meds = form.medicines.map((m, idx) => {
      if (idx !== i) return m;
      if (typeof fields === "object" && !("field" in fields)) return { ...m, ...fields };
      return { ...m, [fields.field]: fields.val };
    });
    setForm({ ...form, medicines: meds });
  };
  const addMed    = () => setForm({ ...form, medicines: [...form.medicines, BLANK_MEDICINE()] });
  const removeMed = (i) => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) });

  const handlePatient = (e) => {
    const p = (patients || []).find((p) => p.id === e.target.value);
    setForm({ ...form, patientId: p?.id || "", patientName: p?.name || "" });
  };

  return (
    <div className="dpresc-form-card">
      <div className="dpresc-form-header">
        <h3>{isEdit ? "✏️ Edit Prescription" : "🧾 New Prescription"}</h3>
        <button className="dpresc-appt-btn" title="Create from appointment">
          📋 From Appointment
        </button>
      </div>

      <div className="dpresc-form-grid">
        <div className="dpresc-field-group">
          <label>Patient</label>
          <select className="dpresc-input" value={form.patientId} onChange={handlePatient}>
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="dpresc-field-group">
          <label>Date</label>
          <input
            type="date"
            className="dpresc-input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="dpresc-field-group dpresc-field-group--full">
          <label>Diagnosis</label>
          <input
            className="dpresc-input"
            placeholder="e.g. Hypertension"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          />
        </div>
      </div>

      <div className="dpresc-section-label">
        💊 Medicines
        <span className="dpresc-med-count">{form.medicines.length} added</span>
      </div>

      <div className="dpresc-med-table-head">
        <span>#</span>
        <span>Medicine Name</span>
        <span>Dosage</span>
        <span>Timing</span>
        <span>Duration</span>
        <span>Status</span>
        <span></span>
      </div>

      <div className="dpresc-med-list">
        {form.medicines.map((med, i) => (
          <MedicineRow
            key={i}
            med={med}
            index={i}
            onChange={updateMed}
            onRemove={removeMed}
            canRemove={form.medicines.length > 1}
            prescriptionId={form.id}
          />
        ))}
      </div>

      <button className="dpresc-add-med-btn" onClick={addMed}>➕ Add Medicine</button>

      <div className="dpresc-field-group" style={{ marginTop: "16px" }}>
        <label>Doctor Notes (optional)</label>
        <textarea
          className="dpresc-input dpresc-textarea"
          placeholder="e.g. Drink plenty of water. Avoid cold food."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="dpresc-form-actions">
        <button className="dpresc-btn dpresc-btn--save" onClick={onSave}>
          💾 {isEdit ? "Update Prescription" : "Save Prescription"}
        </button>
        <button className="dpresc-btn dpresc-btn--cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({ rx, onClose }) {
  if (!rx) return null;
  return (
    <div className="dpresc-overlay" onClick={onClose}>
      <div className="dpresc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dpresc-modal-header">
          <h3>📄 Prescription Details</h3>
          <button className="dpresc-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="dpresc-modal-meta">
          <div className="dpresc-modal-meta-item"><span>Patient</span><strong>{rx.patientName}</strong></div>
          <div className="dpresc-modal-meta-item"><span>Date</span><strong>{formatDate(rx.date)}</strong></div>
          <div className="dpresc-modal-meta-item"><span>Diagnosis</span><strong>{rx.diagnosis}</strong></div>
          <div className="dpresc-modal-meta-item">
            <span>Status</span>
            <span className={`dpresc-badge ${rx.status === "Active" ? "dpresc-badge--active" : "dpresc-badge--done"}`}>
              {rx.status}
            </span>
          </div>
        </div>

        <div className="dpresc-modal-body">
          <p className="dpresc-modal-section-title">💊 Medicines</p>
          <div className="dpresc-view-table-wrap">
            <table className="dpresc-view-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Timing & Food</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rx.medicines.map((m, i) => (
                  <tr key={i}>
                    <td>{m.name}</td>
                    <td>{m.dosage}</td>
                    <td>
                      <div className="dpresc-modal-timing-list">
                        {(m.timing || []).map((t, ti) => (
                          <span key={ti} className="dpresc-modal-timing-tag">
                            {TIMING_ICON[t]} {t}
                            {m.foodPref?.[t] && (
                              <span className="dpresc-modal-food-tag">
                                🍽️ {m.foodPref[t]}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{m.duration}</td>
                    <td>
                      <span className={`dpresc-badge ${(m.status || "Active") === "Active" ? "dpresc-badge--active" : "dpresc-badge--done"}`}>
                        {(m.status || "Active") === "Active" ? "🟢" : "⚪"} {m.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rx.notes && (
            <>
              <p className="dpresc-modal-section-title" style={{ marginTop: "16px" }}>📝 Doctor Notes</p>
              <div className="dpresc-notes-box">{rx.notes}</div>
            </>
          )}
        </div>

        <div className="dpresc-modal-footer">
          <button
            className="dpresc-btn dpresc-btn--download"
            onClick={() => generateDoctorPrescriptionPDF(rx)}
          >
            ⬇ Download PDF
          </button>
          <button className="dpresc-btn dpresc-btn--cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DoctorPrescription() {
  const [open, setOpen]               = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(BLANK_FORM());
  const [viewRx, setViewRx]           = useState(null);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [patients, setPatients]       = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointment/doctor`,
          { credentials: "include" }
        );
        const data = await res.json();
        const map = new Map();
        const unique = [];
        (Array.isArray(data) ? data : []).forEach((appt) => {
          if (appt.status !== "completed") return;
          if (appt.patient && !map.has(appt.patient._id)) {
            map.set(appt.patient._id, true);
            unique.push({
              id:   appt.patient._id,
              name: `${appt.patient.firstName} ${appt.patient.lastName}`.trim(),
            });
          }
        });
        setPatients(unique);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/prescription/doctor`,
        { credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const formatted = result.data.map((rx) => ({
        id:          rx._id,
        patientId:   rx.patient?._id,
        patientName: `${rx.patient?.firstName || ""} ${rx.patient?.lastName || ""}`.trim(),
        date:        rx.createdAt.split("T")[0],
        diagnosis:   rx.diagnosis,
        medicines:   (rx.medicines || []).map((m) => {
          const timingArray = [];
          const foodPrefObj = {};
          (m.timing || []).forEach((t) => {
            timingArray.push(t.timeOfDay);
            foodPrefObj[t.timeOfDay] = t.intake === "before_food" ? "Before Food" : "After Food";
          });
          return {
            id:       m._id || "",
            name:     m.name,
            dosage:   m.dosage,
            duration: m.duration,
            status:   m.status || "Active",
            timing:   timingArray,
            foodPref: foodPrefObj,
          };
        }),
        status: rx.status || "Active",
        notes:  rx.notes || "",
      }));

      setPrescriptions(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch prescriptions:", err);
    }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  const handleSave = async () => {
    if (!form.patientId || !form.diagnosis || form.medicines.some((m) => !m.name)) {
      alert("Please fill all required fields");
      return;
    }
    const isEdit = !!form.id;
    const url    = isEdit
      ? `${process.env.REACT_APP_API_URL}/api/prescription/${form.id}`
      : `${process.env.REACT_APP_API_URL}/api/prescription/createPres`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const formattedMedicines = form.medicines.map((m) => ({
        _id:      m.id,
        name:     m.name,
        dosage:   m.dosage,
        duration: m.duration,
        status:   m.status || "Active",
        timing:   m.timing.map((t) => ({
          timeOfDay: t,
          intake: m.foodPref[t] === "Before Food" ? "before_food" : "after_food",
        })),
      }));

      const res = await fetch(url, {
        method,
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patient:   form.patientId,
          diagnosis: form.diagnosis,
          medicines: formattedMedicines,
          notes:     form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(isEdit ? "✅ Prescription updated successfully" : "✅ Prescription saved successfully");
      setForm(BLANK_FORM());
      setShowForm(false);
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save prescription");
    }
  };

  const handleEdit = (rx) => {
    setForm({
      id:          rx.id,
      patientId:   rx.patientId,
      patientName: rx.patientName,
      date:        rx.date,
      diagnosis:   rx.diagnosis,
      medicines:   rx.medicines,
      notes:       rx.notes,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/prescription/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete prescription");
      }
      setPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Completed" : "Active";
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/prescription/${id}/status`,
        {
          method:      "PUT",
          headers:     { "Content-Type": "application/json" },
          credentials: "include",
          body:        JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(BLANK_FORM());
  };

  const filtered = prescriptions.filter((rx) => {
    const q = search.toLowerCase();
    const matchSearch = !q || rx.patientName.toLowerCase().includes(q) || rx.diagnosis.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || rx.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <DoctorNavbar open={open} setOpen={setOpen} />
      <DoctorHeader open={open} />

      <div
        className="dpresc-page"
        style={{ marginLeft: open ? "250px" : "100px", transition: "0.3s" }}
      >
        <div className="dpresc-page-header">
          <div className="dpresc-header-left">
            <span className="dpresc-page-icon">💊</span>
            <h2>Prescription Management</h2>
          </div>
          {!showForm && (
            <button className="dpresc-btn dpresc-btn--save" onClick={() => setShowForm(true)}>
              ➕ New Prescription
            </button>
          )}
        </div>

        {showForm && (
          <PrescriptionForm
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onCancel={handleCancel}
            isEdit={!!form.id}
            patients={patients}
          />
        )}

        <div className="dpresc-filter-bar">
          <input
            className="dpresc-search"
            type="text"
            placeholder="Search by patient or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="dpresc-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="dpresc-list">
          {filtered.length === 0 ? (
            <p className="dpresc-empty">No prescriptions found.</p>
          ) : (
            filtered.map((rx) => (
              <div key={rx.id} className="dpresc-rx-card">
                <div className="dpresc-rx-card-left">
                  <div className="dpresc-rx-avatar">
                    {rx.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="dpresc-rx-info">
                    <h4>{rx.patientName}</h4>
                    <p className="dpresc-rx-diagnosis">🩺 {rx.diagnosis}</p>
                    <p className="dpresc-rx-meta">
                      📅 {formatDate(rx.date)} &nbsp;·&nbsp;
                      💊 {rx.medicines.length} medicine{rx.medicines.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="dpresc-rx-card-right">
                  <span className={`dpresc-badge ${rx.status === "Active" ? "dpresc-badge--active" : "dpresc-badge--done"}`}>
                    {rx.status}
                  </span>
                  <div className="dpresc-rx-actions">
                    <button className="dpresc-icon-btn dpresc-icon-btn--view"   onClick={() => setViewRx(rx)}                    title="View">👁</button>
                    <button className="dpresc-icon-btn dpresc-icon-btn--edit"   onClick={() => handleEdit(rx)}                   title="Edit">✏️</button>
                    <button className="dpresc-icon-btn dpresc-icon-btn--toggle" onClick={() => handleToggleStatus(rx.id, rx.status)} title="Toggle status">
                      {rx.status === "Active" ? "✅" : "🔄"}
                    </button>
                    <button className="dpresc-icon-btn dpresc-icon-btn--delete" onClick={() => handleDelete(rx.id)}              title="Delete">🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ViewModal rx={viewRx} onClose={() => setViewRx(null)} />
    </>
  );
}
