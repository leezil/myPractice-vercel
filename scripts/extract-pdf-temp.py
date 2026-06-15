from pathlib import Path
from pypdf import PdfReader

pairs = [
    (r"c:\Users\tmddb\Downloads\제7주차 수업자료입니다.(중간고사 시험범위).pdf", ".tmp-pdf-text/modern-law-week7.txt"),
]
for src, dst in pairs:
    r = PdfReader(src)
    parts = []
    for i, pg in enumerate(r.pages):
        parts.append(f"--- page {i+1} ---\n{pg.extract_text() or ''}")
    Path(dst).write_text("\n\n".join(parts), encoding="utf-8")
    print(dst, len(r.pages))
