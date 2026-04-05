import { readFile } from "fs/promises";
import path from "path";
import type { ProblemSetSummary, StoredProblemSet } from "@/lib/types/problem";

const SEED_DIR = path.join(process.cwd(), "content", "r2-seed");

function parseIndex(raw: string): ProblemSetSummary[] {
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) return [];
  return data.filter(
    (row): row is ProblemSetSummary =>
      typeof row === "object" &&
      row !== null &&
      typeof (row as ProblemSetSummary).slug === "string" &&
      typeof (row as ProblemSetSummary).title === "string" &&
      typeof (row as ProblemSetSummary).subject === "string" &&
      typeof (row as ProblemSetSummary).questionCount === "number",
  );
}

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
    return parseIndex(raw);
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
