#!/usr/bin/env python3
"""인공지능 기초 — 4지선다 단일 정답 (기말 강의자료 6주)."""
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "content" / "r2-seed" / "sets"
SUBJECT = "인공지능 기초"
SCRIPTS = ROOT / "scripts"


def load_module(name: str, filename: str):
    path = SCRIPTS / filename
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


def q(item: dict) -> dict:
    wrong = item["wrong"]
    if len(wrong) < 3:
        raise ValueError(f"Need 3 wrong choices: {item['stem'][:40]}")
    return {
        "stem": item["stem"],
        "choices": [item["correct"], wrong[0], wrong[1], wrong[2]],
        "correctIndex": 0,
        "explanation": item["explanation"],
    }


def with_ids(questions: list[dict]) -> list[dict]:
    return [{**item, "id": f"q{i + 1}"} for i, item in enumerate(questions)]


def build_set(slug: str, title: str, description: str, raw: list[dict]) -> dict:
    return {
        "slug": slug,
        "title": title,
        "description": description,
        "questions": with_ids([q(item) for item in raw]),
    }


def main() -> None:
    w79 = load_module("ai_w79", "ai_basics_questions_w7_w9.py")
    w1012 = load_module("ai_w1012", "ai_basics_questions_w10_w12.py")

    sets_meta = [
        build_set(
            "ai-week07-data-science",
            "07 — 인공지능과 데이터 과학",
            "데이터·정보, 데이터 과학, 상관·EHT, 분석 6단계",
            w79.WEEK07_QUESTIONS,
        ),
        build_set(
            "ai-week08-ml",
            "08 — 스스로 학습하는 머신러닝",
            "ML 정의, 회귀·분류, k-NN·SVM·k-means·DBSCAN",
            w79.WEEK08_QUESTIONS,
        ),
        build_set(
            "ai-week09-ann",
            "09 — 인공 신경망 기술",
            "퍼셉트론, XOR, MLP, 역전파, MNIST",
            w79.WEEK09_QUESTIONS,
        ),
        build_set(
            "ai-week10-dl",
            "10 — 딥러닝의 세계로",
            "MNIST·ImageNet, ILSVRC, CNN, YOLO",
            w1012.WEEK10_QUESTIONS,
        ),
        build_set(
            "ai-week11-llm",
            "11 — LLM과 생성형 AI",
            "RNN·Transformer, GPT, GAN·Diffusion, XAI",
            w1012.WEEK11_QUESTIONS,
        ),
        build_set(
            "ai-week12-rl",
            "12 — 강화학습",
            "AlphaGo, RL·MDP, 자율주행, end-to-end",
            w1012.WEEK12_QUESTIONS,
        ),
    ]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    new_entries: list[dict] = []
    ai_slugs = {s["slug"] for s in sets_meta}

    for meta in sets_meta:
        data = {
            "slug": meta["slug"],
            "title": meta["title"],
            "subject": SUBJECT,
            "description": meta["description"],
            "questions": meta["questions"],
        }
        out_path = OUT_DIR / f"{meta['slug']}.json"
        out_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        new_entries.append(
            {
                "slug": meta["slug"],
                "title": meta["title"],
                "subject": SUBJECT,
                "description": meta["description"],
                "questionCount": len(meta["questions"]),
            }
        )
        print(f"{meta['slug']}: {len(meta['questions'])} questions")

    index_path = ROOT / "content" / "r2-seed" / "index.json"
    existing = []
    if index_path.exists():
        existing = json.loads(index_path.read_text(encoding="utf-8"))
    merged = [e for e in existing if e["slug"] not in ai_slugs]
    merged.extend(new_entries)
    merged.sort(key=lambda x: x["slug"])
    index_path.write_text(
        json.dumps(merged, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    total = sum(e["questionCount"] for e in new_entries)
    print(f"ai-basics total: {total} questions, index.json: {len(merged)} sets")


if __name__ == "__main__":
    main()
