import { jsPDF } from "jspdf";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const W   = 210;   // A4 width  (mm)
const H   = 297;   // A4 height (mm)
const ML  = 14;    // margin left
const MR  = 196;   // margin right
const CW  = MR - ML;  // content width = 182

// Brand colours (RGB)
const TEAL       = [10, 130, 130];
const TEAL_LIGHT = [232, 246, 246];
const TEAL_MID   = [180, 225, 225];
const GRAY_DARK  = [50,  50,  50];
const GRAY_MID   = [100, 100, 100];
const GRAY_LIGHT = [200, 200, 200];
const WHITE      = [255, 255, 255];
const AMBER_BG   = [255, 253, 240];
const AMBER_BD   = [230, 210, 140];

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

const shortId = (id = "") => `RX-${String(id).slice(-8).toUpperCase()}`;

const slotName  = (t) => (typeof t === "string" ? t : t?.timeOfDay || t?.slot || "");
const intakeLbl = (t) => {
  if (typeof t === "string") return "";
  const r = t?.intake || "";
  return r ? ` (${r.replace(/_/g, " ")})` : "";
};

const SLOTS = ["Morning", "Afternoon", "Night"];

// ─────────────────────────────────────────────────────────────────────────────
// Drawing primitives
// ─────────────────────────────────────────────────────────────────────────────

/** Guard: add new page if remaining space < needed */
function guard(pdf, y, needed = 12) {
  if (y + needed > H - 22) {   // 22 mm footer reserve
    pdf.addPage();
    drawPageBorder(pdf);
    return 18;
  }
  return y;
}

/** Thin horizontal rule */
function rule(pdf, y, r = GRAY_LIGHT, lw = 0.25) {
  pdf.setDrawColor(...r);
  pdf.setLineWidth(lw);
  pdf.line(ML, y, MR, y);
  return y + 3;
}

/** Bold teal section heading with underline */
function heading(pdf, label, y) {
  y = guard(pdf, y, 14);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...TEAL);
  pdf.text(label.toUpperCase(), ML, y);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.35);
  pdf.line(ML, y + 1.8, MR, y + 1.8);
  pdf.setTextColor(...GRAY_DARK);
  return y + 7;
}

/** Key–value row inside an info box */
function kvRow(pdf, key, value, x, y, keyW = 28) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...GRAY_MID);
  pdf.text(key, x, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...GRAY_DARK);
  const lines = pdf.splitTextToSize(value, 82 - keyW);
  pdf.text(lines, x + keyW, y);
  return y + lines.length * 5 + 1;
}

/** Subtle page border */
function drawPageBorder(pdf) {
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.4);
  pdf.rect(8, 8, W - 16, H - 16);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main generator
// ─────────────────────────────────────────────────────────────────────────────
export function generatePrescriptionPDF(rx) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let y = 18;

  const doctor  = rx.doctor  || {};
  const patient = rx.patient || {};
  const meds    = rx.medicines || [];

  // Normalise doctor name — never duplicate "Dr."
  const doctorName = (() => {
    const n = safe(doctor.fullName);
    if (n === "—") return "—";
    const lo = n.toLowerCase();
    return lo.startsWith("dr.") || lo.startsWith("dr ") ? n : `Dr. ${n}`;
  })();

  const patientName =
    [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "—";

  // ── Page border ─────────────────────────────────────────────────────────────
  drawPageBorder(pdf);

  // ── HEADER ──────────────────────────────────────────────────────────────────
  // Teal banner
  pdf.setFillColor(...TEAL);
  pdf.rect(8, 8, W - 16, 22, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...WHITE);
  pdf.text("MediTrack", W / 2, y + 4, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(210, 240, 240);
  pdf.text("Digital Healthcare Prescription System", W / 2, y + 11, { align: "center" });

  y += 26;   // below banner

  // ── DOCTOR + PATIENT COLUMNS ─────────────────────────────────────────────────
  const colW   = (CW - 6) / 2;   // ~88 mm each
  const leftX  = ML;
  const rightX = ML + colW + 6;

  // Measure content height for both boxes
  const drLines = [
    doctorName,
    safe(doctor.specialization),
    safe(doctor.qualification || "MBBS"),
  ];
  const ptLines = [
    patientName,
    shortId(rx._id),
    fmtDate(rx.createdAt),
  ];
  const boxH = Math.max(drLines.length, ptLines.length) * 6 + 16;

  // Doctor box
  pdf.setFillColor(...TEAL_LIGHT);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(leftX, y, colW, boxH, 2, 2, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...TEAL);
  pdf.text("DOCTOR DETAILS", leftX + 4, y + 6);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.2);
  pdf.line(leftX + 4, y + 7.5, leftX + colW - 4, y + 7.5);

  let dy = y + 13;
  const drLabels = ["Name", "Specialization", "Qualification"];
  drLines.forEach((val, i) => {
    dy = kvRow(pdf, drLabels[i], val, leftX + 4, dy);
  });

  // Patient box
  pdf.setFillColor(...TEAL_LIGHT);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(rightX, y, colW, boxH, 2, 2, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(...TEAL);
  pdf.text("PATIENT DETAILS", rightX + 4, y + 6);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.2);
  pdf.line(rightX + 4, y + 7.5, rightX + colW - 4, y + 7.5);

  let py = y + 13;
  const ptLabels = ["Patient", "Rx ID", "Date"];
  ptLines.forEach((val, i) => {
    py = kvRow(pdf, ptLabels[i], val, rightX + 4, py);
  });

  y += boxH + 8;

  // ── DIAGNOSIS ───────────────────────────────────────────────────────────────
  y = heading(pdf, "Diagnosis", y);

  const diagText  = safe(rx.diagnosis);
  const diagLines = pdf.splitTextToSize(diagText, CW - 8);
  const diagBoxH  = diagLines.length * 5.5 + 8;

  pdf.setFillColor(248, 252, 252);
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.25);
  pdf.roundedRect(ML, y - 3, CW, diagBoxH, 2, 2, "FD");

  // Left accent bar
  pdf.setFillColor(...TEAL);
  pdf.rect(ML, y - 3, 2, diagBoxH, "F");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(...GRAY_DARK);
  pdf.text(diagLines, ML + 6, y + 2.5);

  y += diagBoxH + 6;

  // ── MEDICINES TABLE ──────────────────────────────────────────────────────────
  y = guard(pdf, y, 24);
  y = heading(pdf, "Prescribed Medicines", y);

  // Column x-positions and widths
  //  #   | Medicine Name | Dosage | Timing          | Duration
  //  6   | 58            | 22     | 60              | 36
  const TC = {
    num:      { x: ML,       w: 6  },
    name:     { x: ML + 7,   w: 58 },
    dosage:   { x: ML + 66,  w: 22 },
    timing:   { x: ML + 89,  w: 60 },
    duration: { x: ML + 150, w: 32 },
  };
  const TH = 7;   // table header height

  // Header row
  pdf.setFillColor(...TEAL);
  pdf.rect(ML, y - 4.5, CW, TH, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...WHITE);
  pdf.text("#",         TC.num.x + 1,      y + 0.5);
  pdf.text("Medicine",  TC.name.x,         y + 0.5);
  pdf.text("Dosage",    TC.dosage.x,       y + 0.5);
  pdf.text("Timing",    TC.timing.x,       y + 0.5);
  pdf.text("Duration",  TC.duration.x,     y + 0.5);
  y += TH;

  meds.forEach((m, i) => {
    const timingStr = (m.timing || [])
      .map((t) => `${slotName(t)}${intakeLbl(t)}`)
      .join(", ") || "—";

    const nameLines   = pdf.splitTextToSize(safe(m.name),     TC.name.w - 2);
    const timingLines = pdf.splitTextToSize(timingStr,        TC.timing.w - 2);
    const rowH        = Math.max(nameLines.length, timingLines.length) * 5 + 4;

    y = guard(pdf, y, rowH + 2);

    // Alternating row fill
    pdf.setFillColor(i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255, i % 2 === 0 ? 252 : 255);
    pdf.rect(ML, y - 3.5, CW, rowH, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(...GRAY_DARK);

    pdf.text(String(i + 1),       TC.num.x + 1,  y);
    pdf.text(nameLines,           TC.name.x,     y);
    pdf.text(safe(m.dosage),      TC.dosage.x,   y);
    pdf.text(timingLines,         TC.timing.x,   y);
    pdf.text(safe(m.duration),    TC.duration.x, y);

    // Row separator
    pdf.setDrawColor(...GRAY_LIGHT);
    pdf.setLineWidth(0.15);
    pdf.line(ML, y + rowH - 3.5, MR, y + rowH - 3.5);

    y += rowH;
  });

  // Table outer border
  pdf.setDrawColor(...TEAL_MID);
  pdf.setLineWidth(0.3);
  pdf.rect(ML, y - (meds.length * 9) - TH - 4.5, CW, (meds.length * 9) + TH + 4.5);

  y += 6;

  // ── MEDICINE SCHEDULE ────────────────────────────────────────────────────────
  y = guard(pdf, y, 28);
  y = heading(pdf, "Medicine Schedule", y);

  const slotW  = (CW - 4) / 3;   // ~59.3 mm each
  const slotGap = 2;

  // Measure max slot height first
  const slotHeights = SLOTS.map((slot) => {
    const items = meds.filter((m) =>
      (m.timing || []).some((t) => slotName(t) === slot)
    );
    if (items.length === 0) return 14;
    let h = 14;
    items.forEach((m) => {
      const tObj = (m.timing || []).find((t) => slotName(t) === slot);
      const line = `${safe(m.name)} · ${safe(m.dosage)}${intakeLbl(tObj)}`;
      const wrapped = pdf.splitTextToSize(line, slotW - 8);
      h += wrapped.length * 4.5 + 2;
    });
    return h;
  });
  const maxSlotH = Math.max(...slotHeights, 20);

  SLOTS.forEach((slot, si) => {
    const sx    = ML + si * (slotW + slotGap);
    const items = meds.filter((m) =>
      (m.timing || []).some((t) => slotName(t) === slot)
    );

    // Slot card background
    pdf.setFillColor(248, 252, 252);
    pdf.setDrawColor(...TEAL_MID);
    pdf.setLineWidth(0.25);
    pdf.roundedRect(sx, y - 3, slotW, maxSlotH, 2, 2, "FD");

    // Slot header strip
    pdf.setFillColor(...TEAL_LIGHT);
    pdf.roundedRect(sx, y - 3, slotW, 9, 2, 2, "F");
    // Re-draw bottom of header as flat
    pdf.setFillColor(...TEAL_LIGHT);
    pdf.rect(sx, y + 1, slotW, 3, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...TEAL);
    const slotLabel = slot === "Morning" ? "Morning"
                    : slot === "Afternoon" ? "Afternoon"
                    : "Night";
    pdf.text(slotLabel, sx + slotW / 2, y + 2, { align: "center" });

    // Divider under header
    pdf.setDrawColor(...TEAL_MID);
    pdf.setLineWidth(0.2);
    pdf.line(sx + 2, y + 4.5, sx + slotW - 2, y + 4.5);

    let iy = y + 9;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    if (items.length === 0) {
      pdf.setTextColor(180, 180, 180);
      pdf.text("—", sx + slotW / 2, iy, { align: "center" });
    } else {
      items.forEach((m) => {
        const tObj   = (m.timing || []).find((t) => slotName(t) === slot);
        const intake = intakeLbl(tObj);
        const nameLine   = pdf.splitTextToSize(safe(m.name), slotW - 8);
        const detailLine = `${safe(m.dosage)}${intake}`;

        pdf.setTextColor(...GRAY_DARK);
        pdf.setFont("helvetica", "bold");
        pdf.text(nameLine, sx + 4, iy);
        iy += nameLine.length * 4.5;

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...GRAY_MID);
        pdf.text(detailLine, sx + 4, iy);
        iy += 5.5;
      });
    }
  });

  y += maxSlotH + 6;

  // ── DOCTOR NOTES ─────────────────────────────────────────────────────────────
  const notes = (rx.notes || "")
    .split(/\.\s+/)
    .map((n) => n.replace(/\.$/, "").trim())
    .filter(Boolean);

  if (notes.length > 0) {
    y = guard(pdf, y, 18);
    y = heading(pdf, "Doctor Notes", y);

    // Measure box height
    let totalNoteH = 6;
    const noteLineGroups = notes.map((note) => {
      const lines = pdf.splitTextToSize(`• ${note}`, CW - 10);
      totalNoteH += lines.length * 5 + 2;
      return lines;
    });

    pdf.setFillColor(...AMBER_BG);
    pdf.setDrawColor(...AMBER_BD);
    pdf.setLineWidth(0.25);
    pdf.roundedRect(ML, y - 3, CW, totalNoteH, 2, 2, "FD");

    // Left accent
    pdf.setFillColor(200, 160, 40);
    pdf.rect(ML, y - 3, 2.5, totalNoteH, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(70, 60, 20);

    noteLineGroups.forEach((lines) => {
      y = guard(pdf, y, lines.length * 5 + 2);
      pdf.text(lines, ML + 7, y + 1);
      y += lines.length * 5 + 2;
    });

    y += 6;
  }

  // ── FOOTER (every page) ───────────────────────────────────────────────────────
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);

    // Footer rule
    pdf.setDrawColor(...GRAY_LIGHT);
    pdf.setLineWidth(0.25);
    pdf.line(ML, H - 16, MR, H - 16);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "This is a computer-generated prescription and does not require a signature.",
      W / 2, H - 12, { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.5);
    pdf.setTextColor(180, 180, 180);
    pdf.text(
      `Generated by MediTrack · Digital Healthcare System   |   Page ${p} of ${totalPages}`,
      W / 2, H - 8, { align: "center" }
    );
  }

  pdf.save(`MediTrack_${shortId(rx._id)}.pdf`);
}
