import { readdir, readFile } from "fs/promises";
import path from "path";
import { parseProblemIndex } from "@/lib/problem-index";
import type { ProblemSetSummary, StoredProblemSet } from "@/lib/types/problem";

const SEED_DIR = path.join(process.cwd(), "content", "r2-seed");

function parseSet(raw: string): StoredProblemSet | null {
  try {
    const data = JSON.parse(raw) as StoredProblemSet;
    if (
      !data ||
      typeof data.slug !== "string" ||
      typeof data.title !== "string" ||
      typeof data.subject !== "string" ||
      !Array.isArray(data.questions)
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function readLocalSeedIndex(): Promise<ProblemSetSummary[]> {
  try {
    const raw = await readFile(path.join(SEED_DIR, "index.json"), "utf-8");
    return parseProblemIndex(raw);
  } catch {
    return [];
  }
}

export async function readLocalSeedSet(slug: string): Promise<StoredProblemSet | null> {
  const safe = slug.replace(/[/\\]/g, "");
  if (!safe) return null;
  try {
    const raw = await readFile(path.join(SEED_DIR, "sets", `${safe}.json`), "utf-8");
    return parseSet(raw);
  } catch {
    return null;
  }
}

/** 로컬 시드의 sets/*.json 파일명으로 슬러그 목록 생성 */
export async function readLocalSeedSlugs(): Promise<string[]> {
  try {
    const dir = path.join(SEED_DIR, "sets");
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".json"))
      .map((e) => e.name.slice(0, -".json".length))
      .filter((slug) => slug.length > 0)
      .sort();
  } catch {
    return [];
  }
}
