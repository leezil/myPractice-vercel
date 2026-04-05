import { readFile } from "fs/promises";
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
