#!/usr/bin/env python3
"""강의 PDF 텍스트에서 7지선다 JSON 문제 세트 생성 (맥락·완결 문장 중심)."""
from __future__ import annotations

import json
import random
import re
from dataclasses import dataclass
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
HEADING_MAJOR_RE = re.compile(r"^[A-Z]\.\s")
HEADING_SECTION_RE = re.compile(r"^\d+\.\s")
HEADING_SUBSECTION_RE = re.compile(r"^\d+\)\s")
HEADING_ITEM_RE = re.compile(r"^[①②③④⑤⑥⑦⑧⑨⑩]")
HEADING_STEP_RE = re.compile(r"^\d+단계:")
LABEL_ONLY_RE = re.compile(
    r"^(핵심 요소|배경 설명|결과|위기 상황|위기관리 리더십|전략적 결단)\s*:?\s*$"
)
FRAGMENT_END_RE = re.compile(r"[:：]\s*$")


@dataclass
class ContentItem:
    text: str
    major: str = ""
    section: str = ""
    unit: str = ""
    topic_label: str = ""
    group_id: str = ""
    choice_text: str = ""


def fix_broken_korean(s: str) -> str:
    """PDF 줄바꿈으로 끊긴 음절만 복구 (일반 띄어쓰기는 유지)."""
    s = re.sub(
        r"([가-힣]{2,})\s+([을를이가은는의에와과로만])(?=\s|[\.,\)!?\"']|$)",
        r"\1\2",
        s,
    )
    s = re.sub(r"([가-힣])\s+(겠)(?=다)", r"\1\2", s)
    s = re.sub(r"옥타비아누\s+스", "옥타비아누스", s)
    s = re.sub(r"클\s+레오파트라", "클레오파트라", s)
    s = re.sub(r"지\s+지를", "지지를", s)
    s = re.sub(r"탈퇴\s+를", "탈퇴를", s)
    s = re.sub(r"방관하지\s+않겠다", "방관하지 않겠다", s)
    s = re.sub(r"정상화\s+하는", "정상화하는", s)
    return s


def normalize_text(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    s = s.replace("심 각한", "심각한")
    fixes = (
        (r"효과\s+적인", "효과적인"),
        (r"빠르\s+게", "빠르게"),
        (r"적극\s+적으로", "적극적으로"),
        (r"지\s+속", "지속"),
        (r"했지\s+만", "했지만"),
        (r"파직\s+하고", "파직하고"),
        (r"약\s+점", "약점"),
        (r"감\s+정", "감정"),
        (r"인\s+플레이션", "인플레이션"),
        (r"하\s+이퍼인플레이션", "하이퍼인플레이션"),
        (r"구성원\s+들이", "구성원들이"),
        (r"결속\s+력", "결속력"),
        (r"중요성\s+을", "중요성을"),
        (r"상황\s+을", "상황을"),
        (r"휴전\s+을", "휴전을"),
        (r"위\s+해", "위해"),
        (r"전\s+략", "전략"),
        (r"외\s+교관", "외교관"),
        (r"지\s+식", "지식"),
        (r"전략\s+을", "전략을"),
        (r"협상\s+의", "협상의"),
    )
    for pat, rep in fixes:
        s = re.sub(pat, rep, s)
    s = fix_broken_korean(s)
    return s


def strip_bullet(s: str) -> str:
    s = s.strip()
    while s and s[0] in BULLET_CHARS:
        s = s[1:].strip()
    if s.startswith("- "):
        s = s[2:].strip()
    return normalize_text(s)


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
    if HEADING_MAJOR_RE.match(nxt) or HEADING_SECTION_RE.match(nxt):
        return False
    if HEADING_SUBSECTION_RE.match(nxt) or HEADING_ITEM_RE.match(nxt):
        return False
    if re.match(r"^[0-9]+[\.\)]\s", nxt):
        return False
    if prev.endswith((":", "：", ".", "!", "?", "…", ")", "」", "』", '"', "'")):
        return False
    if re.match(r"^[①②③④⑤⑥⑦⑧⑨⑩]", nxt):
        return False
    if len(prev) <= 3 and prev[-1].isalnum():
        return True
    if prev[-1].isalnum() and nxt[0].isalnum():
        return True
    if prev.endswith(("을", "를", "이", "가", "은", "는", "의", "에", "와", "과", "로", "심", "하", "지", "고")):
        return True
    return False


def merge_text(prev: str, nxt: str) -> str:
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


def clean_label(s: str) -> str:
    s = re.sub(r"^[①②③④⑤⑥⑦⑧⑨⑩]\s*", "", s)
    s = re.sub(r"^\d+\)\s*", "", s)
    s = re.sub(r"^\d+\.\s*", "", s)
    s = re.sub(r"^[A-Z]\.\s*", "", s)
    s = re.sub(r"[:：]\s*$", "", s)
    return normalize_text(s)


def heading_level(s: str) -> str | None:
    if HEADING_MAJOR_RE.match(s):
        return "major"
    if HEADING_SECTION_RE.match(s):
        return "section"
    if HEADING_SUBSECTION_RE.match(s):
        return "subsection"
    if HEADING_ITEM_RE.match(s):
        return "item"
    if HEADING_STEP_RE.match(s):
        return "step"
    return None


def is_substantive(text: str) -> bool:
    if len(text) < 18:
        return False
    if LABEL_ONLY_RE.match(text):
        return False
    if FRAGMENT_END_RE.search(text) and len(text) < 30:
        return False
    if heading_level(text):
        return False
    if re.match(r"^\d+단계:", text) and len(text) < 35:
        return False
    # 표·비교표가 한 줄로 뭉개진 경우
    if len(text) > 100 and sum(1 for k in ("중앙 집중", "분권적", "의사결정 방식", "권한 분배") if k in text) >= 2:
        return False
    # 문장이 끊긴 채로 끝나는 경우
    if text.endswith((",", "으며", "하고", "하여", "위해", "통해", "독일과", "루르", "제공.")):
        return False
    if re.search(r"(이다|임|함|있음|없음|됨|한다|했다|하였다|것이다|보여|강조|수행|제시|설정|유지|달성|겪음|발발|실시|추진|확보|회복|대응|강화|약화|영향|기여|초래|견인|유도|표명|선언|임명|격파|봉쇄|탈퇴|폐지|통합|지원|저지|완화|증가|감소|필요|중요|필수)", text):
        return True
    return len(text) >= 35 and text.rstrip().endswith((".", "!", "?", "”", "\""))


def topic_from_context(major: str, section: str, unit: str) -> str:
    for candidate in (unit, section, major):
        c = clean_label(candidate)
        if c and len(c) >= 4:
            return c
    return "강의 내용"


def passage_context(major: str, section: str, unit: str) -> str:
    major_c = clean_label(major)
    section_c = clean_label(section)
    unit_c = clean_label(unit)
    parts = [p for p in (major_c, section_c, unit_c) if p]
    if len(parts) >= 2:
        return f"강의 범위: {' › '.join(parts)}"
    if parts:
        return f"강의 범위: {parts[0]}"
    return ""


def format_choice_text(text: str, _topic: str = "") -> str:
    """선지는 본문만 표시. 주제·맥락은 발문(passage/stem)에서 제공."""
    return normalize_text(text)


def build_stem(topic: str, major: str) -> str:
    topic = clean_label(topic)
    major_c = clean_label(major)
    if any(k in topic for k in ("링컨", "처칠", "케네디", "이순신", "드골", "히틀러", "클레오파트라", "엘리자베스", "간디", "스탈린", "마오")):
        return (
            f"강의 자료에서 다룬 「{topic}」에 관해 "
            f"내용과 일치하는 설명을 모두 고르시오."
        )
    if major_c and major_c != topic:
        return (
            f"「{major_c}」 중 「{topic}」으로 정리된 내용과 "
            f"일치하는 설명을 모두 고르시오."
        )
    return f"강의 자료의 「{topic}」 내용과 일치하는 설명을 모두 고르시오."


def build_explanation(topic: str, correct_texts: list[str]) -> str:
    topic = clean_label(topic)
    lines = [f"이 문항은 강의의 「{topic}」 단원에서 다룬 핵심 내용을 확인합니다.", ""]
    lines.append(f"정답 {len(correct_texts)}개:")
    for i, t in enumerate(correct_texts, 1):
        lines.append(f"{i}. {t}")
    return "\n".join(lines)


def extract_content_items(text: str) -> list[ContentItem]:
    lines = skip_goals(text.splitlines())
    major = section = unit = ""
    item_heading = ""
    group_buf: list[str] = []
    items: list[ContentItem] = []

    def flush_group() -> None:
        nonlocal group_buf
        if not group_buf:
            return
        topic = topic_from_context(major, section, unit or item_heading)
        gid = f"{major}|{section}|{unit}|{item_heading}"
        for raw in group_buf:
            if not is_substantive(raw):
                continue
            choice = format_choice_text(raw, topic)
            items.append(
                ContentItem(
                    text=raw,
                    major=major,
                    section=section,
                    unit=unit or item_heading,
                    topic_label=topic,
                    group_id=gid,
                    choice_text=choice,
                )
            )
        group_buf = []

    buf = ""
    for line in lines:
        if is_page_noise(line):
            continue
        raw = line.strip()
        if not raw:
            if buf:
                group_buf.append(strip_bullet(buf))
                buf = ""
            continue

        s = strip_bullet(raw)
        if not s:
            continue

        lvl = heading_level(s)
        if lvl:
            if buf:
                group_buf.append(strip_bullet(buf))
                buf = ""
            flush_group()
            if lvl == "major":
                major, section, unit, item_heading = s, "", "", ""
            elif lvl == "section":
                section, unit, item_heading = s, "", ""
            elif lvl == "subsection":
                unit, item_heading = s, ""
            elif lvl in ("item", "step"):
                item_heading = s
            continue

        starts_bullet = raw[0] in BULLET_CHARS or bool(re.match(r"^[①②③④⑤⑥⑦⑧⑨⑩]", raw))
        if starts_bullet and buf:
            group_buf.append(strip_bullet(buf))
            buf = s
        elif buf and should_continue(buf, s):
            buf = merge_text(buf, s)
        else:
            if buf:
                group_buf.append(strip_bullet(buf))
            buf = s

    if buf:
        group_buf.append(strip_bullet(buf))
    flush_group()
    return items


def split_into_3_4(n: int) -> list[int]:
    if n <= 0:
        return []
    if n <= 4:
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


def group_items(items: list[ContentItem]) -> list[list[ContentItem]]:
    """소단원(unit)별로 묶고, 3개 미만이면 같은 section 안에서만 합친다."""
    by_key: dict[str, list[ContentItem]] = {}
    order: list[str] = []
    for it in items:
        key = f"{it.section}|{it.unit}"
        if key not in by_key:
            by_key[key] = []
            order.append(key)
        by_key[key].append(it)

    section_pending: dict[str, list[ContentItem]] = {}
    final_groups: list[list[ContentItem]] = []

    def section_key(grp: list[ContentItem]) -> str:
        return grp[0].section if grp else ""

    for key in order:
        grp = by_key[key]
        if len(grp) >= 3:
            final_groups.append(grp)
            continue
        sec = section_key(grp)
        section_pending.setdefault(sec, []).extend(grp)

    for sec, grp in section_pending.items():
        if len(grp) < 3:
            if final_groups and final_groups[-1][0].section == sec:
                final_groups[-1].extend(grp)
            elif grp:
                final_groups.append(grp)
            continue
        topic = clean_label(sec)
        for it in grp:
            if not it.topic_label or it.topic_label == clean_label(it.unit):
                it.topic_label = topic
                it.choice_text = format_choice_text(it.text, topic)
        final_groups.append(grp)

    return [g for g in final_groups if len(g) >= 3]


def pick_distractors_multi(
    correct_set: set[str],
    pool: list[ContentItem],
    rng: random.Random,
    n: int,
    topic: str,
) -> list[str]:
    topic_clean = clean_label(topic)
    candidates = [
        p.choice_text
        for p in pool
        if p.choice_text not in correct_set and is_substantive(p.text)
    ]
    rng.shuffle(candidates)

    def score(c: str) -> int:
        item = next((p for p in pool if p.choice_text == c), None)
        s = 0
        if item and clean_label(item.topic_label) != topic_clean:
            s += 3
        if item and item.major:
            s += 1
        return s

    candidates.sort(key=score, reverse=True)
    chosen: list[str] = []
    for c in candidates:
        if len(chosen) >= n:
            break
        if any(c[:16] == x[:16] for x in correct_set):
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
    batch: list[ContentItem],
    pool: list[ContentItem],
    rng: random.Random,
) -> dict:
    n_correct = len(batch)
    correct_texts = [b.choice_text for b in batch]
    correct_set = set(correct_texts)
    sample = batch[0]
    topic = sample.topic_label
    major = sample.major

    n_wrong = 7 - n_correct
    wrong = pick_distractors_multi(correct_set, pool, rng, n_wrong, topic)
    choices = correct_texts + wrong
    rng.shuffle(choices)
    correct_indices = sorted(choices.index(t) for t in correct_texts)

    stem = build_stem(topic, major)
    explanation = build_explanation(topic, correct_texts)
    passage = passage_context(sample.major, sample.section, sample.unit)

    q: dict = {
        "id": f"q{q_idx + 1}",
        "stem": stem,
        "choices": choices,
        "correctIndices": correct_indices,
        "explanation": explanation,
    }
    if passage:
        q["passage"] = passage
    return q


def generate_set(meta: dict, rng: random.Random) -> dict:
    text = (TEXT_DIR / meta["text_file"]).read_text(encoding="utf-8")
    items = extract_content_items(text)
    if not items:
        raise RuntimeError(f"No content items: {meta['text_file']}")

    groups = group_items(items)
    questions: list[dict] = []
    qi = 0
    for grp in groups:
        sizes = split_into_3_4(len(grp))
        i = 0
        for size in sizes:
            if size < 3:
                continue
            batch = grp[i : i + size]
            i += size
            questions.append(build_question_from_batch(qi, batch, items, rng))
            qi += 1

    if not questions:
        raise RuntimeError(f"No questions built: {meta['text_file']}")

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
