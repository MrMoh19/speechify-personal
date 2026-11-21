"""Render rows.json into the weekly docx, using template.docx (the 9 Oct update as
Mohammed sent it) for every bit of formatting. Usage: python3 render.py "<out>.docx"
"""
import json, re, sys, zipfile
from datetime import datetime, timedelta
from xml.sax.saxutils import escape

HERE = sys.path[0]
data = json.load(open(f"{HERE}/rows.json", encoding="utf8"))

SECTIONS = [  # heading text in the template -> (rows key, row -> cells)
    ("Active manuscripts", "active", lambda i, r: [i, r["ms"], r["stage"], r["journal"], r["next"], r.get("due", "")]),
    ("Teaching and Mentorship", "teaching", lambda i, r: [i, r["name"], r["update"], r["next"]]),
    ("Projects", "projects", lambda i, r: [i, r["name"], r["update"], r["next"]]),
    ("Training", "training", lambda i, r: [i, r["name"], r["status"], r["next"]]),
    ("On hold", "on_hold", lambda i, r: [i, r["ms"], r["stage"], r["journal"], r["next"]]),
]

def week_label(friday_str):
    f = datetime.strptime(friday_str, "%d %B %Y")
    m = f - timedelta(days=4)
    return f"Week of {m.day} {m:%B} – {f.day} {f:%B}, {f.year}"

def text_of(xml):
    return "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", xml))

def set_text(p_xml, text):
    """Replace a paragraph's runs with one run carrying the first run's formatting."""
    rpr = re.search(r"<w:r[ >].*?(<w:rPr>.*?</w:rPr>)", p_xml, re.S)
    rpr = rpr.group(1) if rpr else ""
    run = f'<w:r>{rpr}<w:t xml:space="preserve">{escape(str(text))}</w:t></w:r>'
    head = re.match(r"<w:p[^>]*>(?:<w:pPr>.*?</w:pPr>)?", p_xml, re.S).group(0)
    return head + run + "</w:p>"

def fill_cell(tc_xml, text):
    tcpr = re.search(r"<w:tcPr>.*?</w:tcPr>", tc_xml, re.S)
    p = re.search(r"<w:p[ >].*?</w:p>", tc_xml, re.S).group(0)
    return "<w:tc>" + (tcpr.group(0) if tcpr else "") + set_text(p, text) + "</w:tc>"

def strip_ids(xml):
    return re.sub(r' w14:(?:paraId|textId)="[^"]*"', "", xml)

def fill_table(tbl, rows):
    trs = re.findall(r"<w:tr[ >].*?</w:tr>", tbl, re.S)
    header, tmpl = trs[0], strip_ids(trs[1])
    tr_open = re.match(r"<w:tr[^>]*>(?:<w:trPr>.*?</w:trPr>)?", tmpl, re.S).group(0)
    tcs = re.findall(r"<w:tc>.*?</w:tc>", tmpl, re.S)
    body = "".join(tr_open + "".join(fill_cell(tcs[j], c) for j, c in enumerate(cells)) + "</w:tr>" for cells in rows)
    start = tbl.index(trs[0])
    return tbl[:start] + header + body + "</w:tbl>"

def main(out):
    zin = zipfile.ZipFile(f"{HERE}/template.docx")
    doc = zin.read("word/document.xml").decode("utf8")
    first_p = re.search(r"<w:body><w:p[ >].*?</w:p>", doc, re.S).group(0)
    doc = doc.replace(first_p, "<w:body>" + set_text(first_p[len("<w:body>"):], "Weekly Updates — " + week_label(data["title_date"])), 1)
    for heading, key, cells in SECTIONS:
        hp = next(m for m in re.finditer(r"<w:p[ >].*?</w:p>", doc, re.S) if text_of(m.group(0)).strip() == heading)
        tbl = re.compile(r"<w:tbl>.*?</w:tbl>", re.S).search(doc, hp.end())
        rows = [cells(str(i + 1), r) for i, r in enumerate(data[key])]
        doc = doc[:tbl.start()] + fill_table(tbl.group(0), rows) + doc[tbl.end():]
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            zout.writestr(item, doc.encode("utf8") if item.filename == "word/document.xml" else zin.read(item.filename))
    print("written", out)

if __name__ == "__main__":
    main(sys.argv[1])
