import "../css/PrescriptionPDF.css";

const SLOTS = ["Morning", "Afternoon", "Night"];
const SLOT_ICON = { Morning: "🌅", Afternoon: "🌇", Night: "🌙" };

// Normalise a timing entry — backend sends either a plain string or
// an object like { timeOfDay: "Morning", intake: "after_food" }
const slotName = (t) => (typeof t === "string" ? t : t?.timeOfDay || t?.slot || "");
const intakeLabel = (t) => {
  if (typeof t === "string") return "";
  const raw = t?.intake || "";
  return raw ? ` (${raw.replace(/_/g, " ")})` : "";
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

// Unique short ID from mongo _id
const shortId = (id = "") => `RX-${String(id).slice(-8).toUpperCase()}`;

export default function PrescriptionPDF({ rx, pdfRef }) {
  if (!rx) return null;

  const doctor  = rx.doctor  || {};
  const patient = rx.patient || {};

  const patientName =
    [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "—";

  const notes = (rx.notes || "")
    .split(/\.\s+/)
    .map((n) => n.replace(/\.$/, "").trim())
    .filter(Boolean);

  return (
    <div className="pdf-wrapper" ref={pdfRef}>

      {/* ── Watermark ── */}
      <div className="pdf-watermark">MediTrack</div>

      {/* ── Header ── */}
      <div className="pdf-header">
        <p className="pdf-clinic-name">MediTrack</p>
        <p className="pdf-clinic-sub">Digital Healthcare Prescription System</p>
        <hr className="pdf-divider" />
      </div>

      {/* ── Doctor + Patient info ── */}
      <div className="pdf-info-row">

        {/* Doctor */}
        <div className="pdf-info-col">
          <p className="pdf-info-col-title">Doctor Details</p>
          <p className="pdf-info-line">
            <b>Name</b> Dr. {doctor.fullName || "—"}
          </p>
          <p className="pdf-info-line">
            <b>Specialization</b> {doctor.specialization || "—"}
          </p>
          <p className="pdf-info-line">
            <b>Qualification</b> {doctor.qualification || "MBBS"}
          </p>
        </div>

        {/* Patient */}
        <div className="pdf-info-col">
          <p className="pdf-info-col-title">Patient Details</p>
          <p className="pdf-info-line">
            <b>Patient Name</b> {patientName}
          </p>
          <p className="pdf-info-line">
            <b>Prescription ID</b> {shortId(rx._id)}
          </p>
          <p className="pdf-info-line">
            <b>Date</b> {formatDate(rx.createdAt)}
          </p>
        </div>

      </div>

      {/* ── Diagnosis ── */}
      <div className="pdf-diagnosis-block">
        <p className="pdf-section-title">Diagnosis</p>
        <p className="pdf-diagnosis-text">{rx.diagnosis || "—"}</p>
      </div>

      <hr className="pdf-divider--light" />

      {/* ── Medicines table ── */}
      <p className="pdf-table-title">Prescribed Medicines</p>
      <table className="pdf-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Timing</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {(rx.medicines || []).map((m, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{m.name}</td>
              <td>{m.dosage}</td>
              <td>
                {(m.timing || [])
                  .map((t) => `${slotName(t)}${intakeLabel(t)}`)
                  .join(", ") || "—"}
              </td>
              <td>{m.duration || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="pdf-divider--light" />

      {/* ── Medicine schedule ── */}
      <p className="pdf-table-title">Medicine Schedule</p>
      <div className="pdf-schedule-grid">
        {SLOTS.map((slot) => {
          const items = (rx.medicines || []).filter((m) =>
            (m.timing || []).some((t) => slotName(t) === slot)
          );
          return (
            <div key={slot} className="pdf-schedule-slot">
              <div className="pdf-schedule-slot-header">
                {SLOT_ICON[slot]} {slot}
              </div>
              <div className="pdf-schedule-slot-body">
                {items.length === 0 ? (
                  <span className="pdf-schedule-empty">None</span>
                ) : (
                  items.map((m, i) => {
                    const timingObj = (m.timing || []).find(
                      (t) => slotName(t) === slot
                    );
                    return (
                      <p key={i} className="pdf-schedule-item">
                        &#8226; {m.name} · {m.dosage}
                        {intakeLabel(timingObj)}
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <hr className="pdf-divider--light" />

      {/* ── Doctor notes ── */}
      {notes.length > 0 && (
        <>
          <p className="pdf-table-title">Doctor Notes</p>
          <div className="pdf-notes-block">
            {notes.map((note, i) => (
              <p key={i} className="pdf-note-item">&#8226; {note}</p>
            ))}
          </div>
        </>
      )}

      {/* ── Footer ── */}
      <div className="pdf-footer">
        <p className="pdf-footer-disclaimer">
          This is a computer-generated prescription and does not require a signature.
        </p>
        <p className="pdf-footer-brand">Generated by MediTrack · Digital Healthcare System</p>
      </div>

    </div>
  );
}
