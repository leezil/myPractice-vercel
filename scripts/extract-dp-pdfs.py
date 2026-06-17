from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / ".tmp-pdf-text"

PAIRS = [
    (r"c:\Users\tmddb\Desktop\과제\26-1학기\디자인패턴\기말 강의자료\1-4_요구모델링 (1).pdf", "dp-1-4-requirements.txt"),
    (r"c:\Users\tmddb\Desktop\과제\26-1학기\디자인패턴\기말 강의자료\2-4_디자인패턴이해.pdf", "dp-2-4-understanding.txt"),
    (r"c:\Users\tmddb\Desktop\과제\26-1학기\디자인패턴\기말 강의자료\스트래티지패턴-수정본.pdf", "dp-strategy.txt"),
    (r"c:\Users\tmddb\Desktop\과제\26-1학기\디자인패턴\기말 강의자료\싱글톤패턴.pdf", "dp-singleton.txt"),
    (r"c:\Users\tmddb\Desktop\과제\26-1학기\디자인패턴\기말 강의자료\스테이트.pdf", "dp-state.txt"),
    (r"c:\Users\tmddb\Desktop\과제\26-1학기\디자인패턴\기말 강의자료\커맨드패턴.pdf", "dp-command.txt"),
]

OUT.mkdir(parents=True, exist_ok=True)
for src, name in PAIRS:
    r = PdfReader(src)
    parts = []
    for i, pg in enumerate(r.pages):
        text = pg.extract_text() or ""
        parts.append(f"--- page {i+1} ---\n{text}")
    dst = OUT / name
    dst.write_text("\n\n".join(parts), encoding="utf-8")
    print(name, len(r.pages), dst.stat().st_size)
