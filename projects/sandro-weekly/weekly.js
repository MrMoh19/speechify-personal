const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, BorderStyle, ShadingType,
} = require("docx");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "rows.json"), "utf8"));

const INK = "1A1A1A";
const PAGE = { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

const h = (text) =>
  new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Calibri", color: INK })] });

function cell(width, text, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    shading: opts.shade ? { type: ShadingType.CLEAR, fill: "EFEFED" } : undefined,
    children: [new Paragraph({ spacing: { after: 0, line: 250 },
      children: [new TextRun({ text, size: 19, font: "Calibri", color: INK, bold: !!opts.bold })] })],
  });
}

function table(colWidths, rows) {
  return new Table({
    columnWidths: colWidths,
    width: { size: colWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" },
    },
    rows: rows.map((r, ri) =>
      new TableRow({ children: r.map((c, i) => cell(colWidths[i], c, ri === 0 ? { bold: true, shade: true } : {})) })),
  });
}

const W6 = [420, 3000, 1500, 1550, 2500, 1110];
const W5 = [420, 3300, 1650, 1750, 2960];
const W4 = [420, 2100, 4200, 3360];
const W3T = [420, 3600, 3200, 2860];

const children = [
  new Paragraph({ spacing: { after: 200 },
    children: [new TextRun({ text: "Meeting Agenda with Dean Galea — " + data.title_date, bold: true, size: 28, font: "Calibri", color: INK })] }),

  h("Active manuscripts"),
  table(W6, [["#", "Manuscript", "Stage", "Target journal", "Next step", "Due"],
    ...data.active.map((r, i) => [String(i + 1), r.ms, r.stage, r.journal, r.next, r.due || ""])]),

  h("On hold"),
  table(W5, [["#", "Manuscript", "Stage", "Target journal", "Next step"],
    ...data.on_hold.map((r, i) => [String(i + 1), r.ms, r.stage, r.journal, r.next])]),

  h("Projects"),
  table(W4, [["#", "Project", "Updates", "Next step"],
    ...data.projects.map((r, i) => [String(i + 1), r.name, r.update, r.next])]),

  h("Training"),
  table(W3T, [["#", "Training", "Status", "Next step"],
    ...data.training.map((r, i) => [String(i + 1), r.name, r.status, r.next])]),
];

const doc = new Document({ sections: [{ properties: { page: PAGE }, children }] });
const outName = process.argv[2] || "Weekly updates_16_Sep_26.docx";
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, outName), buf);
  console.log("written", outName, buf.length);
});
