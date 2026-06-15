#!/usr/bin/env python3
"""강의 PDF 텍스트에서 7지선다 JSON 문제 세트 생성."""
from __future__ import annotations

import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_DIR = ROOT / ".tmp-pdf-text"
OUT_DIR = ROOT / "content" / "r2-seed" / "sets"

SUBJECT = "역사 속 리더십의 빛과 그림자"

SETS = [
    {
        "slug": "history-0428-crisis-leadership",
        "title": "0428 조직 내 위기관리와 리더십",
        "description": "위기관리 정의, 링컨·처칠·케네디·이순신 사례 (기말 범위)",
        "text_file": "0428 조직 내 위기관리와 리더십.txt",
    },
    {
        "slug": "history-0512-wartime-degaulle-hitler",
        "title": "0512 전시 리더십 - 드골과 히틀러",
        "description": "전시 리더십 유형, 드골·히틀러·비시 정부 (기말 범위)",
        "text_file": "0512 전시 리더십 - 드골과 히틀러.txt",
    },
    {
        "slug": "history-0519-women-leadership",
        "title": "0519 여성 리더십 - 클레오파트라와 엘리자베스 1세",
        "description": "여성 리더십, 클레오파트라·엘리자베스 1세 (기말 범위)",
        "text_file": "0519 여성 리더십의 역사 - 클레오파트라와 엘리자베스 1세.txt",
    },
    {
        "slug": "history-0526-ethics-gandhi-lincoln",
        "title": "0526 리더십과 윤리 - 간디와 링컨",
        "description": "윤리적 리더십, 간디·링컨 (기말 범위)",
        "text_file": "0526  리더십과 윤리 -간디와 링컨.txt",
    },
    {
        "slug": "history-0602-shadow-stalin-mao",
        "title": "0602 리더십의 그림자 - 스탈린과 마오쩌둥",
        "description": "그림자 리더십, 스탈린·마오쩌둥 (기말 범위)",
        "text_file": "0602 리더십의 그림자 - 스탈린과 마오쩌둥.txt",
    },
    {
        "slug": "history-0609-modern-leadership",
        "title": "0609 역사에서 배우는 현대 리더십의 조건",
        "description": "리더십 유형 정리, 현대 리더십 조건 (기말 범위)",
        "text_file": "0609 역사에서 배우는 현대 리더십의 조건.txt",
    },
]

BULLET_CHARS = "•·"
GOAL_MARKERS = ("수업 목표", "강의 목표", "강의목표", "학습 목표")
PAGE_HEADER_RE = re.compile(
    r"^\d+\s+.+(위기관리|전시 리더십|여성|리더십|그림자|현대 리더십).+조청현"
    r"|^\d+\s+리더십"
    r"|^\d{4}\s*(April|May|June)"
    r"|^2026\s"
    r"|조청현\s*$"
    r"|^\d+\s*$"
)


def strip_bullet(s: str) -> str:
    s = s.strip()
    while s and s[0] in BULLET_CHARS:
        s = s[1:].strip()
    if s.startswith("- "):
        s = s[2:].strip()
    return re.sub(r"\s+", " ", s)


def is_page_noise(line: str) -> bool:
    s = strip_bullet(line)
    if not s:
        return True
    if PAGE_HEADER_RE.search(s):
        return True
    if re.fullmatch(r"[\d\s\.\-|]+", s):
        return True
    return False


def skip_goals(lines: list[str]) -> list[str]:
    out: list[str] = []
    skipping = False
    for line in lines:
        raw = line.strip()
        if any(m in raw for m in GOAL_MARKERS):
            skipping = True
            continue
        if skipping:
            if re.match(r"^[A-Z]\.\s", raw):
                skipping = False
                out.append(line)
            continue
        out.append(line)
    return out


def should_continue(prev: str, nxt: str) -> bool:
    if not prev or not nxt:
        return False
    if re.match(r"^[A-Z]\.\s", nxt) or re.match(r"^[0-9]+[\.\)]\s", nxt):
        return False
    if prev.endswith((":", "：", ".", "!", "?", "…", ")", "」", "』", '"', "'")):
        return False
    if re.match(r"^[①②③④⑤⑥⑦⑧⑨⑩]", nxt):
        return False
    # PDF 페이지 경계에서 끊긴 문장 (예: '심' + '각한')
    if len(prev) <= 3 and prev[-1].isalnum():
        return True
    if prev[-1].isalnum() and nxt[0].isalnum():
        return True
    if prev.endswith(("을", "를", "이", "가", "은", "는", "의", "에", "와", "과", "로", "심", "하", "지", "고")):
        return True
    return False


def is_section_heading_only(s: str) -> bool:
    if re.match(r"^[A-Z]\.\s", s) and len(s) < 60:
        return True
    if re.match(r"^[0-9]+[\.\)]\s", s) and len(s) < 55 and ":" not in s:
        if not re.search(r"[을를이다함]", s):
            return True
    return False


def merge_text(prev: str, nxt: str) -> str:
    """페이지 줄바꿈 병합: 단어 중간(심+각한)은 붙이고, 그 외는 공백."""
    if len(prev) <= 4 and prev[-1].isalnum() and not prev.endswith(
        ("다", "음", "함", "임", "요", "죠", "됨", "있음", "없음")
    ):
        return prev + nxt
    if prev[-1].isalnum() and nxt[0].isalnum():
        if re.search(r"[다음함임요죠됨)\]\"']$", prev):
            return prev + " " + nxt
        if len(prev) <= 5:
            return prev + nxt
        return prev + " " + nxt
    return prev + " " + nxt


def extract_statements(text: str) -> list[dict]:
    lines = skip_goals(text.splitlines())
    parts: list[str] = []
    buf = ""
    for line in lines:
        if is_page_noise(line):
            continue
        raw = line.strip()
        if not raw:
            if buf:
                parts.append(buf)
                buf = ""
            continue
        s = strip_bullet(raw)
        if not s:
            continue
        starts_bullet = (
            raw[0] in BULLET_CHARS
            or bool(re.match(r"^[0-9]+[\.\)]", raw))
            or bool(re.match(r"^[①②③④⑤⑥⑦⑧⑨⑩]", raw))
            or bool(re.match(r"^[A-Z]\.\s", raw))
        )
        if starts_bullet and buf:
            parts.append(buf)
            buf = s
        elif buf and should_continue(buf, s):
            buf = merge_text(buf, s)
        else:
            if buf:
                parts.append(buf)
            buf = s
    if buf:
        parts.append(buf)

    statements: list[dict] = []
    section = ""
    for s in parts:
        s = re.sub(r"\s+", " ", s).strip()
        s = s.replace("심 각한", "심각한")
        if re.match(r"^\d+\s+리더십", s):
            continue
        if len(s) < 6:
            continue
        if re.match(r"^[A-Z]\.\s", s) and len(s) < 80:
            section = s
        kind = "heading" if is_section_heading_only(s) else "content"
        statements.append({"text": s, "section": section, "kind": kind})
    return statements


def split_into_3_4(n: int) -> list[int]:
    """n개 항목을 3 또는 4개 묶음으로만 분할 (모든 내용 포함)."""
    if n <= 0:
        return []
    if n < 3:
        return [n]
    for n4 in range(n // 4, -1, -1):
        rem = n - 4 * n4
        if rem == 0:
            return [4] * n4
        if rem % 3 == 0:
            return [4] * n4 + [3] * (rem // 3)
    for n3 in range(n // 3, -1, -1):
        rem = n - 3 * n3
        if rem == 0:
            return [3] * n3
        if rem % 4 == 0:
            return [3] * n3 + [4] * (rem // 4)
    return [3] * (n // 3) + ([n % 3] if n % 3 else [])


def pick_distractors_multi(
    correct_set: set[str],
    pool: list[str],
    rng: random.Random,
    n: int,
) -> list[str]:
    candidates = [p for p in pool if p not in correct_set and len(p) >= 8]
    rng.shuffle(candidates)
    chosen: list[str] = []
    for c in candidates:
        if len(chosen) >= n:
            break
        if any(c[:12] == x[:12] for x in correct_set):
            continue
        chosen.append(c)
    idx = 0
    while len(chosen) < n and idx < len(candidates):
        if candidates[idx] not in chosen:
            chosen.append(candidates[idx])
        idx += 1
    return chosen[:n]


def build_question_from_batch(
    q_idx: int,
    batch: list[dict],
    pool: list[str],
    rng: random.Random,
) -> dict:
    n_correct = len(batch)
    correct_texts = [b["text"] for b in batch]
    correct_set = set(correct_texts)
    section = ""
    for b in batch:
        if b.get("section"):
            section = b["section"]
            break

    n_wrong = 7 - n_correct
    wrong = pick_distractors_multi(correct_set, pool, rng, n_wrong)
    choices = correct_texts + wrong
    rng.shuffle(choices)
    correct_indices = sorted(choices.index(t) for t in correct_texts)

    if section:
        stem = f"「{section}」 관련하여 강의 자료의 내용과 일치하는 설명을 모두 고르시오."
    else:
        stem = "다음 중 강의 자료의 내용과 일치하는 설명을 모두 고르시오."

    explanation = "정답(강의 자료):\n" + "\n".join(
        f"· {t}" for t in correct_texts
    )

    q: dict = {
        "id": f"q{q_idx + 1}",
        "stem": stem,
        "choices": choices,
        "correctIndices": correct_indices,
        "explanation": explanation,
    }
    if section:
        q["passage"] = section
    return q


def generate_set(meta: dict, rng: random.Random) -> dict:
    text = (TEXT_DIR / meta["text_file"]).read_text(encoding="utf-8")
    statements = extract_statements(text)
    if not statements:
        raise RuntimeError(f"No statements: {meta['text_file']}")
    pool = [s["text"] for s in statements]
    sizes = split_into_3_4(len(statements))
    questions: list[dict] = []
    i = 0
    for qi, size in enumerate(sizes):
        batch = statements[i : i + size]
        i += size
        questions.append(build_question_from_batch(qi, batch, pool, rng))
    return {
        "slug": meta["slug"],
        "title": meta["title"],
        "subject": SUBJECT,
        "description": meta["description"],
        "questions": questions,
    }


def main() -> None:
    rng = random.Random(42)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index_entries = []
    for meta in SETS:
        data = generate_set(meta, rng)
        out_path = OUT_DIR / f"{meta['slug']}.json"
        out_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        index_entries.append(
            {
                "slug": data["slug"],
                "title": data["title"],
                "subject": data["subject"],
                "description": data["description"],
                "questionCount": len(data["questions"]),
            }
        )
        print(f"{meta['slug']}: {len(data['questions'])} questions")
    index_path = ROOT / "content" / "r2-seed" / "index.json"
    index_path.write_text(
        json.dumps(index_entries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"index.json: {len(index_entries)} sets")


if __name__ == "__main__":
    main()
