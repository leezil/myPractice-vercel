import type { ProblemSetSummary } from "@/lib/types/problem";

function toQuestionCount(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** R2·로컬 공통: `index.json` 배열 파싱 (questionCount 문자열 허용) */
export function parseProblemIndex(raw: string): ProblemSetSummary[] {
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) return [];
  const out: ProblemSetSummary[] = [];
  for (const row of data) {
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
