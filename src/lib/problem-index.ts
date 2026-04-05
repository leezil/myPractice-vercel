import type { ProblemSetSummary } from "@/lib/types/problem";

function toQuestionCount(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function extractIndexRows(data: unknown): unknown[] | null {
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null) {
    const o = data as Record<string, unknown>;
    for (const k of ["sets", "items", "index", "problemSets"]) {
      const v = o[k];
      if (Array.isArray(v)) return v;
    }
  }
  return null;
}

/** R2·로컬 공통: `index.json` 배열(또는 `{ "sets": [...] }`) 파싱 */
export function parseProblemIndex(raw: string): ProblemSetSummary[] {
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch {
    return [];
  }
  const rows = extractIndexRows(data);
  if (!rows) return [];
  const out: ProblemSetSummary[] = [];
  for (const row of rows) {
    if (typeof row !== "object" || row === null) continue;
    const r = row as Record<string, unknown>;
    const slug = r.slug;
    const title = r.title;
    const subject = r.subject;
    const qc = toQuestionCount(r.questionCount);
    if (
      typeof slug === "string" &&
      typeof title === "string" &&
      typeof subject === "string" &&
      qc !== null
    ) {
      out.push({
        slug,
        title,
        subject,
        description: typeof r.description === "string" ? r.description : undefined,
        questionCount: qc,
      });
    }
  }
  return out;
}
