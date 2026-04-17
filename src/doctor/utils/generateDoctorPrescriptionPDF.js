import { jsPDF } from "jspdf";

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants (A4 in mm)
// ─────────────────────────────────────────────────────────────────────────────
const W  = 210;
const H  = 297;
const ML = 14;
const MR = 196;
const CW = MR - ML; // 182 mm

// Colour palette — black/white print-friendly with teal accents
const TEAL       = [10, 130, 130];
const TEAL_LIGHT = [232, 246, 246];
const TEAL_MID   = [180, 225, 225];
const DARK       = [30,  30,  30];
const MID        = [90,  90,  90];
const LIGHT      = [200, 200, 200];
const WHITE      = [255, 255, 255];
const AMBER_BG   = [255, 253, 240];
const AMBER_BD   = [230, 210, 140];

const SLOTS = ["Morning", "Afternoon", "Night"];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const safe = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "" ? String(v).trim() : "—";

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return "—"; }
};

const shortId = (id = "") =>
  id ? `RX-${String(id).slice(-8).toUpperCase()}` : "RX-XXXXXXXX";

// ─────────────────────────────────────────────────────────────────────────────
// Drawing primitives
// ─────────────────────────────────────────────────────────────────────────────

/** Add new page + border if remaining space < needed */
function guard(pdf, y, needed = 12) {
  if (y + needed > H - 24) {
    pdf.addPage();
    pageBorder(pdf);
    return 20;
  }
  return y;
}

/** Outer page border */
function pageBorder(pdf) {
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.4);
  pdf.rect(8, 8, W - 16, H - 16);
}

/** Section heading — bold teal label + underline */
function section(pdf, label, y) {
  y = guard(pdf, y, 14);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...TEAL);
  pdf.text(label.toUpperCase(), ML, y);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.3);
  pdf.line(ML, y + 2, MR, y + 2);
  pdf.setTextColor(...DARK);
  return y + 8;
}

/** Key–value line: bold gray key + normal value */
function kv(pdf, key, value, x, y, keyW = 26) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...MID);
  pdf.text(key, x, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...DARK);
  const lines = pdf.splitTextToSize(value, 80 - keyW);
  pdf.text(lines, x + keyW, y);
  return y + lines.length * 5 + 1.5;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function generateDoctorPrescriptionPDF(rx) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let y = 18;

  // ── Resolve doctor from localStorage (set at login) ──────────────────────
  let storedDoctor = {};
  try {
    storedDoctor = JSON.parse(localStorage.getItem("doctor") || "{}");
  } catch { /* ignore */ }

  const doctorRaw  = rx.doctor || storedDoctor;
  const rawName    = safe(doctorRaw.fullName || doctorRaw.name);
  const doctorName = rawName === "—" ? "—"
    : rawName.toLowerCase().startsWith("dr") ? rawName : `Dr. ${rawName}`;
  const specialization = safe(doctorRaw.specialization);
  const qualification  = safe(doctorRaw.qualification || "MBBS");

  const patientName = safe(rx.patientName);
  const meds        = rx.medicines || [];

  // ── Page border ─────────────────────────────────────────────────────────────
  pageBorder(pdf);

  // ── HEADER BANNER ───────────────────────────────────────────────────────────
  pdf.setFillColor(...TEAL);
  pdf.rect(8, 8, W - 16, 24, "F");

  // Clinic name
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...WHITE);
  pdf.text("MediTrack", W / 2, y + 5, { align: "center" });

  // Subtitle
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(210, 240, 240);
  pdf.text("Digital Healthcare Prescription System", W / 2, y + 12, { align: "center" });

  // Doctor name in header (right-aligned)
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`${doctorName}  ·  ${specialization}  ·  ${qualification}`, MR, y + 19, { align: "right" });

  y += 30;

  // ── DOCTOR + PATIENT INFO (two columns) ─────────────────────────────────────
  const colW  = (CW - 6) / 2;
  const leftX = ML;
  const rightX = ML + colW + 6;
  const boxH  = 34;

  // Doctor box
  pdf.setFillColor(...TEAL_LIGHT);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.25);
  pdf.roundedRect(leftX, y, colW, boxH, 2, 2, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(...TEAL);
  pdf.text("DOCTOR DETAILS", leftX + 4, y + 6);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.15);
  pdf.line(leftX + 4, y + 7.5, leftX + colW - 4, y + 7.5);

  let dy = y + 13;
  dy = kv(pdf, "Name",           doctorName,      leftX + 4, dy);
  dy = kv(pdf, "Specialization", specialization,  leftX + 4, dy);
  dy = kv(pdf, "Qualification",  qualification,   leftX + 4, dy);

  // Patient box
  pdf.setFillColor(...TEAL_LIGHT);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.25);
  pdf.roundedRect(rightX, y, colW, boxH, 2, 2, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(...TEAL);
  pdf.text("PATIENT DETAILS", rightX + 4, y + 6);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.15);
  pdf.line(rightX + 4, y + 7.5, rightX + colW - 4, y + 7.5);

  let py = y + 13;
  py = kv(pdf, "Patient", patientName,          rightX + 4, py);
  py = kv(pdf, "Rx ID",   shortId(rx.id),       rightX + 4, py);
  py = kv(pdf, "Date",    fmtDate(rx.date),      rightX + 4, py);

  y += boxH + 8;

  // ── DIAGNOSIS ───────────────────────────────────────────────────────────────
  y = section(pdf, "Diagnosis", y);

  const diagLines = pdf.splitTextToSize(safe(rx.diagnosis), CW - 8);
  const diagBoxH  = diagLines.length * 5.5 + 8;

  pdf.setFillColor(248, 252, 252);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(ML, y - 3, CW, diagBoxH, 2, 2, "FD");
  pdf.setFillColor(...TEAL);
  pdf.rect(ML, y - 3, 2.5, diagBoxH, "F");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(...DARK);
  pdf.text(diagLines, ML + 6, y + 2.5);

  y += diagBoxH + 7;

  // ── MEDICINES TABLE ──────────────────────────────────────────────────────────
  y = guard(pdf, y, 24);
  y = section(pdf, "Prescribed Medicines", y);

  // Column layout: # | Medicine | Dosage | Timing & Food | Duration
  const TC = {
    num:      { x: ML,       w: 6  },
    name:     { x: ML + 7,   w: 52 },
    dosage:   { x: ML + 60,  w: 22 },
    timing:   { x: ML + 83,  w: 72 },
    duration: { x: ML + 156, w: 26 },
  };
  const TH = 7;

  // Header row
  pdf.setFillColor(...TEAL);
  pdf.rect(ML, y - 4.5, CW, TH, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...WHITE);
  pdf.text("#",              TC.num.x + 1,  y + 0.5);
  pdf.text("Medicine",       TC.name.x,     y + 0.5);
  pdf.text("Dosage",         TC.dosage.x,   y + 0.5);
  pdf.text("Timing & Food",  TC.timing.x,   y + 0.5);
  pdf.text("Duration",       TC.duration.x, y + 0.5);
  y += TH;

  meds.forEach((m, i) => {
    // Build timing+food string: "Morning (After Food), Night (Before Food)"
    const timingStr = (m.timing || [])
      .map((t) => {
        const food = m.foodPref?.[t];
        return food ? `${t} (${food})` : t;
      })
      .join(", ") || "—";

    const nameLines   = pdf.splitTextToSize(safe(m.name),  TC.name.w - 2);
    const timingLines = pdf.splitTextToSize(timingStr,     TC.timing.w - 2);
    const rowH        = Math.max(nameLines.length, timingLines.length) * 5 + 4;

    y = guard(pdf, y, rowH + 2);

    // Alternating row
    pdf.setFillColor(i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255, i % 2 === 0 ? 252 : 255);
    pdf.rect(ML, y - 3.5, CW, rowH, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...DARK);
    pdf.text(String(i + 1),    TC.num.x + 1,  y);
    pdf.text(nameLines,        TC.name.x,     y);
    pdf.text(safe(m.dosage),   TC.dosage.x,   y);
    pdf.text(timingLines,      TC.timing.x,   y);
    pdf.text(safe(m.duration), TC.duration.x, y);

    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.15);
    pdf.line(ML, y + rowH - 3.5, MR, y + rowH - 3.5);

    y += rowH;
  });

  // Table outer border
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.25);
  const tableTop = y - meds.reduce((acc, m) => {
    const tStr = (m.timing || []).map((t) => m.foodPref?.[t] ? `${t} (${m.foodPref[t]})` : t).join(", ");
    const nL = pdf.splitTextToSize(safe(m.name), TC.name.w - 2).length;
    const tL = pdf.splitTextToSize(tStr, TC.timing.w - 2).length;
    return acc + Math.max(nL, tL) * 5 + 4;
  }, TH + 4.5);
  pdf.rect(ML, tableTop, CW, y - tableTop);

  y += 6;

  // ── MEDICINE SCHEDULE ────────────────────────────────────────────────────────
  y = guard(pdf, y, 28);
  y = section(pdf, "Medicine Schedule", y);

  const slotW = (CW - 4) / 3;

  // Pre-measure slot heights
  const slotH = SLOTS.map((slot) => {
    const items = meds.filter((m) => (m.timing || []).includes(slot));
    if (!items.length) return 18;
    let h = 16;
    items.forEach((m) => {
      const food = m.foodPref?.[slot] || "";
      const line = `${safe(m.name)} · ${safe(m.dosage)}${food ? ` (${food})` : ""}`;
      h += pdf.splitTextToSize(line, slotW - 8).length * 4.5 + 3;
    });
    return h;
  });
  const maxSlotH = Math.max(...slotH, 22);

  SLOTS.forEach((slot, si) => {
    const sx    = ML + si * (slotW + 2);
    const items = meds.filter((m) => (m.timing || []).includes(slot));

    // Card
    pdf.setFillColor(248, 252, 252);
    pdf.setDrawColor(...TEAL_MID);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(sx, y - 3, slotW, maxSlotH, 2, 2, "FD");

    // Header strip
    pdf.setFillColor(...TEAL_LIGHT);
    pdf.roundedRect(sx, y - 3, slotW, 9, 2, 2, "F");
    pdf.rect(sx, y + 1, slotW, 3, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(...TEAL);
    pdf.text(slot, sx + slotW / 2, y + 2.5, { align: "center" });

    pdf.setDrawColor(...TEAL_MID);
    pdf.setLineWidth(0.15);
    pdf.line(sx + 2, y + 5, sx + slotW - 2, y + 5);

    let iy = y + 10;
    if (!items.length) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text("—", sx + slotW / 2, iy, { align: "center" });
    } else {
      items.forEach((m) => {
        const food  = m.foodPref?.[slot] || "";
        const nLine = pdf.splitTextToSize(safe(m.name), slotW - 8);
        const dLine = `${safe(m.dosage)}${food ? ` · ${food}` : ""}`;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...DARK);
        pdf.text(nLine, sx + 4, iy);
        iy += nLine.length * 4.5;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(...MID);
        pdf.text(dLine, sx + 4, iy);
        iy += 5.5;
      });
    }
  });

  y += maxSlotH + 7;

  // ── DOCTOR NOTES ─────────────────────────────────────────────────────────────
  const notes = (rx.notes || "")
    .split(/\.\s+/)
    .map((n) => n.replace(/\.$/, "").trim())
    .filter(Boolean);

  if (notes.length > 0) {
    y = guard(pdf, y, 18);
    y = section(pdf, "Doctor Notes", y);

    let totalH = 6;
    const noteGroups = notes.map((note) => {
      const lines = pdf.splitTextToSize(`• ${note}`, CW - 10);
      totalH += lines.length * 5 + 2;
      return lines;
    });

    pdf.setFillColor(...AMBER_BG);
    pdf.setDrawColor(...AMBER_BD);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(ML, y - 3, CW, totalH, 2, 2, "FD");
    pdf.setFillColor(200, 160, 40);
    pdf.rect(ML, y - 3, 2.5, totalH, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(70, 60, 20);
    noteGroups.forEach((lines) => {
      y = guard(pdf, y, lines.length * 5 + 2);
      pdf.text(lines, ML + 7, y + 1);
      y += lines.length * 5 + 2;
    });
    y += 5;
  }

  // ── SIGNATURE SECTION ────────────────────────────────────────────────────────
  y = guard(pdf, y, 28);
  y += 6;

  const sigX = MR - 60;
  pdf.setDrawColor(...DARK);
  pdf.setLineWidth(0.3);
  pdf.line(sigX, y, MR, y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...MID);
  pdf.text("Doctor's Signature", sigX + (MR - sigX) / 2, y + 5, { align: "center" });
  pdf.text(doctorName, sigX + (MR - sigX) / 2, y + 10, { align: "center" });

  // ── FOOTER (all pages) ───────────────────────────────────────────────────────
  const total = pdf.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(...LIGHT);
    pdf.setLineWidth(0.2);
    pdf.line(ML, H - 16, MR, H - 16);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(6.5);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "This is a computer-generated prescription and does not require a signature.",
      W / 2, H - 12, { align: "center" }
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(180, 180, 180);
    pdf.text(
      `MediTrack · Digital Healthcare System   |   Page ${p} of ${total}`,
      W / 2, H - 8, { align: "center" }
    );
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  const filename = `${patientName.replace(/\s+/g, "_")}_prescription.pdf`;
  pdf.save(filename);
}
