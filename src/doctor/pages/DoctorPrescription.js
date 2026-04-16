import { useState, useEffect } from "react";
import DoctorNavbar from "../components/DoctorNavbar";
import DoctorHeader from "../components/DoctorHeader";
import "../css/DoctorPrescription.css";
import { generateDoctorPrescriptionPDF } from "../utils/generateDoctorPrescriptionPDF";

// ── Dummy Data ───────────────────────────────────────────────────────────────




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

// ── MedStatusToggle — immediate API call on change ───────────────────────────
function MedStatusToggle({ med, index, onChange, prescriptionId  }) {
  const [busy, setBusy] = useState(false);

  // const handleChange = async (e) => {
  //   const newStatus = e.target.value;
  //   if (newStatus === med.status) return;

  //   if (!med.id) {
  //     // New medicine (not yet saved) — update local state only
  //     onChange(index, { field: "status", val: newStatus });
  //     return;
  //   }

  //   setBusy(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}/api/prescription/${prescriptionId}/medicine/${med.id}`,        {
  //         method:      "PUT",
  //         headers:     { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body:        JSON.stringify({ status: newStatus }),
  //       }
  //     );
  //     if (!res.ok) {
  //       const data = await res.json().catch(() => ({}));
  //       throw new Error(data.message || "Failed to update medicine status");
  //     }
  //     onChange(index, { field: "status", val: newStatus });
  //   } catch (err) {
  //     console.error(err);
  //     alert(`❌ ${err.message}`);
  //   } finally {
  //     setBusy(false);
  //   }
  // };
const handleChange = async (e) => {
  const newStatus = e.target.value;

  if (newStatus === med.status) return;

  // ❗ IMPORTANT FIX
  if (!prescriptionId) {
    alert("⚠️ Save prescription first before updating medicine status");
    return;
  }

  if (!med.id) {
    onChange(index, { field: "status", val: newStatus });
    return;
  }
  console.log("Prescription ID:", prescriptionId);
console.log("Medicine ID:", med.id);
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

    // ✅ Update UI
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
    <div className="dp-med-status-wrap">
      <select
        className={`dp-med-status-sel${isActive ? " dp-med-status--active" : " dp-med-status--done"}`}
        value={med.status || "Active"}
        onChange={handleChange}
        disabled={busy}
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

  // Toggle a timing slot on/off; auto-set "After Food" as default when turning on
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
    // Single onChange call — both fields update in one setForm, no stale closure
    onChange(index, { timing: nextTiming, foodPref: nextFoodPref });
  }

  function handleFoodClick(slot, opt) {
    onChange(index, { foodPref: { ...med.foodPref, [slot]: opt } });
  }

  // Only show food rows for slots that are currently selected, in TIMINGS order
  const activeSlotsInOrder = TIMINGS.filter((s) => med.timing.includes(s));



  return (
    <div className="dp-med-entry">

      {/* ── Input row ─────────────────────────────────────────────────── */}
      <div className="dp-med-inputs">

        <div className="dp-med-index">{index + 1}</div>

        <input
          className="dp-input"
          placeholder="Medicine name"
          value={med.name}
          onChange={(e) => onChange(index, { field: "name", val: e.target.value })}
        />

        <input
          className="dp-input"
          placeholder="Dosage (e.g. 500mg)"
          value={med.dosage}
          onChange={(e) => onChange(index, { field: "dosage", val: e.target.value })}
        />

        {/* Timing chips — plain divs with onClick, no hidden inputs */}
        <div className="dp-timing-checks">
          {TIMINGS.map((slot) => {
            const isOn = med.timing.includes(slot);
            return (
              <div
                key={slot}
                role="button"
                tabIndex={0}
                className={`dp-timing-chip${isOn ? " dp-timing-chip--on" : ""}`}
                onClick={() => handleTimingClick(slot)}
                onKeyDown={(e) => e.key === "Enter" && handleTimingClick(slot)}
              >
                {TIMING_ICON[slot]} {slot}
              </div>
            );
          })}
        </div>

        <input
          className="dp-input"
          placeholder="Duration (e.g. 7 days)"
          value={med.duration}
          onChange={(e) => onChange(index, { field: "duration", val: e.target.value })}
        />

        {/* Medicine status toggle — calls API immediately when changed */}
        <MedStatusToggle med={med} index={index} onChange={onChange} prescriptionId={prescriptionId} />

        {canRemove
          ? <button className="dp-med-remove" onClick={() => onRemove(index)} title="Remove">✕</button>
          : <span />
        }
      </div>

      {/* ── Food preference panel — appears only when ≥1 timing selected ── */}
      {activeSlotsInOrder.length > 0 && (
        <div className="dp-food-panel">
          <span className="dp-food-panel-label">🍽️ Food Preference</span>
          <div className="dp-food-rows">
            {activeSlotsInOrder.map((slot) => (
              <div key={slot} className="dp-food-row">
                <span className="dp-food-slot-label">
                  {TIMING_ICON[slot]} {slot}
                </span>
                <div className="dp-food-toggle">
                  {FOOD_OPTS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`dp-food-btn${med.foodPref[slot] === opt ? " dp-food-btn--on" : ""}`}
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
// patients is received as a prop from DoctorPrescription — no local state or fetch here
function PrescriptionForm({ form, setForm, onSave, onCancel, isEdit, patients }) {
  const updateMed = (i, fields) => {
    // fields is either { field, val } for a single update
    // or a plain object { timing, foodPref } for a multi-field update
    const meds = form.medicines.map((m, idx) => {
      if (idx !== i) return m;
      // Multi-field update (object passed directly)
      if (typeof fields === "object" && !("field" in fields)) {
        return { ...m, ...fields };
      }
      // Single-field update { field, val }
      return { ...m, [fields.field]: fields.val };
    });
    setForm({ ...form, medicines: meds });
  };
  const addMed = () => setForm({ ...form, medicines: [...form.medicines, BLANK_MEDICINE()] });
  const removeMed = (i) => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) });

  const handlePatient = (e) => {
    const p = (patients || []).find((p) => p.id === e.target.value);
    setForm({ ...form, patientId: p?.id || "", patientName: p?.name || "" });
  };
  return (
    <div className="dp-form-card">
      <div className="dp-form-header">
        <h3>{isEdit ? "✏️ Edit Prescription" : "🧾 New Prescription"}</h3>
        <button className="dp-appt-btn" title="Create from appointment">
          📋 From Appointment
        </button>
      </div>

      {/* Basic fields */}
      <div className="dp-form-grid">
        <div className="dp-field-group">
          <label>Patient</label>
          <select className="dp-input" value={form.patientId} onChange={handlePatient}>
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="dp-field-group">
          <label>Date</label>
          <input
            type="date" className="dp-input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="dp-field-group dp-field-group--full">
          <label>Diagnosis</label>
          <input
            className="dp-input" placeholder="e.g. Hypertension"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          />
        </div>
      </div>

      {/* Medicines */}
      <div className="dp-section-label">
        💊 Medicines
        <span className="dp-med-count">{form.medicines.length} added</span>
      </div>

      <div className="dp-med-table-head">
        <span>#</span>
        <span>Medicine Name</span>
        <span>Dosage</span>
        <span>Timing</span>
        <span>Duration</span>
        <span>Status</span>
        <span></span>
      </div>

      <div className="dp-med-list">
        {form.medicines.map((med, i) => (
          <MedicineRow
            key={i} med={med} index={i}
            onChange={updateMed}
            onRemove={removeMed}
            canRemove={form.medicines.length > 1}
            prescriptionId={form.id} 
          />
        ))}
      </div>

      <button className="dp-add-med-btn" onClick={addMed}>➕ Add Medicine</button>

      {/* Notes */}
      <div className="dp-field-group" style={{ marginTop: "16px" }}>
        <label>Doctor Notes (optional)</label>
        <textarea
          className="dp-input dp-textarea"
          placeholder="e.g. Drink plenty of water. Avoid cold food."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="dp-form-actions">
        <button className="dp-btn dp-btn--save" onClick={onSave}>
          💾 {isEdit ? "Update Prescription" : "Save Prescription"}
        </button>
        <button className="dp-btn dp-btn--cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── View Modal ───────────────────────────────────────────────────────────────
function ViewModal({ rx, onClose }) {
  if (!rx) return null;
  return (
    <div className="dp-overlay" onClick={onClose}>
      <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dp-modal-header">
          <h3>📄 Prescription Details</h3>
          <button className="dp-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="dp-modal-meta">
          <div className="dp-modal-meta-item"><span>Patient</span><strong>{rx.patientName}</strong></div>
          <div className="dp-modal-meta-item"><span>Date</span><strong>{formatDate(rx.date)}</strong></div>
          <div className="dp-modal-meta-item"><span>Diagnosis</span><strong>{rx.diagnosis}</strong></div>
          <div className="dp-modal-meta-item">
            <span>Status</span>
            <span className={`dp-badge ${rx.status === "Active" ? "dp-badge--active" : "dp-badge--done"}`}>
              {rx.status}
            </span>
          </div>
        </div>

        <div className="dp-modal-body">
          <p className="dp-modal-section-title">💊 Medicines</p>
          <div className="dp-view-table-wrap">
            <table className="dp-view-table">
              <thead>
                <tr><th>Medicine</th><th>Dosage</th><th>Timing & Food</th><th>Duration</th></tr>
              </thead>
              <tbody>
                {rx.medicines.map((m, i) => (
                  <tr key={i}>
                    <td>{m.name}</td>
                    <td>{m.dosage}</td>
                    <td>
                      <div className="dp-modal-timing-list">
                        {(m.timing || []).map((t, i) => (
                          <span key={i} className="dp-modal-timing-tag">
                            {TIMING_ICON[t]} {t}
                            {m.foodPref?.[t] && (
                              <span className="dp-modal-food-tag">
                                🍽️ {m.foodPref[t]}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rx.notes && (
            <>
              <p className="dp-modal-section-title" style={{ marginTop: "16px" }}>📝 Doctor Notes</p>
              <div className="dp-notes-box">{rx.notes}</div>
            </>
          )}
        </div>

        <div className="dp-modal-footer">
          <button
            className="dp-btn dp-btn--download"
            onClick={() => generateDoctorPrescriptionPDF(rx)}
          >
            ⬇ Download PDF
          </button>
          <button className="dp-btn dp-btn--cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DoctorPrescription() {
  const [open, setOpen] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(BLANK_FORM());
  const [viewRx, setViewRx]       = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [patients, setPatients] = useState([]);

  // Fetch patients from appointments on mount
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
          if (appt.patient && !map.has(appt.patient._id)) {
            map.set(appt.patient._id, true);
            unique.push({
              id: appt.patient._id,
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

      // Convert backend data → frontend format
      const formatted = result.data.map((rx) => ({
        id: rx._id,
        patientId: rx.patient?._id,
        patientName: `${rx.patient?.firstName || ""} ${rx.patient?.lastName || ""}`.trim(),
date: rx.createdAt.split("T")[0],        diagnosis: rx.diagnosis,
        medicines: (rx.medicines || []).map((m) => {
          const timingArray = [];
          const foodPrefObj = {};

          (m.timing || []).forEach((t) => {
            timingArray.push(t.timeOfDay);

            foodPrefObj[t.timeOfDay] =
              t.intake === "before_food" ? "Before Food" : "After Food";
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
        }), status: rx.status || "Active",
        notes: rx.notes || "",
      }));

      setPrescriptions(formatted);

    } catch (err) {
      console.error("❌ Failed to fetch prescriptions:", err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // ── Save / Update — uses form.id to decide create vs update ──────────────
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
        name:     m.name,
        dosage:   m.dosage,
        duration: m.duration,
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

  // Populate form with id so handleSave knows to PUT
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

  const handleToggleStatus = (id) => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        rx.id === id ? { ...rx, status: rx.status === "Active" ? "Completed" : "Active" } : rx
      )
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(BLANK_FORM());
  };

  // ── Filter ──
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
        className="dp-page"
        style={{ marginLeft: open ? "250px" : "100px", transition: "0.3s" }}
      >
        {/* Page heading */}
        {/* Page heading */}
        <div className="dp-page-header">
          <div className="dp-header-left">
            <span className="dp-page-icon">💊</span>
            <h2>Prescription Management</h2>
          </div>

          {!showForm && (
            <button className="dp-btn dp-btn--save" onClick={() => setShowForm(true)}>
              ➕ New Prescription
            </button>
          )}
        </div>

        {/* Form */}
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

        {/* Search + filter */}
        <div className="dp-filter-bar">
          <input
            className="dp-search"
            type="text"
            placeholder="Search by patient or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="dp-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>

        {/* List */}
        <div className="dp-list">
          {filtered.length === 0 ? (
            <p className="dp-empty">No prescriptions found.</p>
          ) : (
            filtered.map((rx) => (
              <div key={rx.id} className="dp-rx-card">
                <div className="dp-rx-card-left">
                  <div className="dp-rx-avatar">
                    {rx.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="dp-rx-info">
                    <h4>{rx.patientName}</h4>
                    <p className="dp-rx-diagnosis">🩺 {rx.diagnosis}</p>
                    <p className="dp-rx-meta">
                      📅 {formatDate(rx.date)} &nbsp;·&nbsp;
                      💊 {rx.medicines.length} medicine{rx.medicines.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="dp-rx-card-right">
                  <span className={`dp-badge ${rx.status === "Active" ? "dp-badge--active" : "dp-badge--done"}`}>
                    {rx.status}
                  </span>
                  <div className="dp-rx-actions">
                    <button className="dp-icon-btn dp-icon-btn--view" onClick={() => setViewRx(rx)} title="View">👁</button>
                    <button className="dp-icon-btn dp-icon-btn--edit" onClick={() => handleEdit(rx)} title="Edit">✏️</button>
                    <button className="dp-icon-btn dp-icon-btn--toggle" onClick={() => handleToggleStatus(rx.id)} title="Toggle status">
                      {rx.status === "Active" ? "✅" : "🔄"}
                    </button>
                    <button className="dp-icon-btn dp-icon-btn--delete" onClick={() => handleDelete(rx.id)} title="Delete">🗑</button>
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
