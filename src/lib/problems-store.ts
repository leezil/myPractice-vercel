import { readLocalSeedIndex, readLocalSeedSet } from "@/lib/local-seed";
import { parseProblemIndex } from "@/lib/problem-index";
import { INDEX_KEY, getObjectText, isR2Configured, setObjectKey } from "@/lib/r2";
import type {
  ProblemSetSummary,
  PublicProblemSet,
  StoredProblemSet,
  StoredQuestion,
} from "@/lib/types/problem";

/** R2가 설정되어 있으면 `r2`, 아니면 저장소 `content/r2-seed/` */
export type ProblemDataSource = "r2" | "local";

export function getProblemDataSource(): ProblemDataSource {
  return isR2Configured() ? "r2" : "local";
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

function toPublicQuestion(q: StoredQuestion) {
  return {
    id: q.id,
    ...(q.passage !== undefined && q.passage !== "" ? { passage: q.passage } : {}),
    stem: q.stem,
    choices: q.choices,
  };
}

export async function listProblemSetSummaries(): Promise<ProblemSetSummary[]> {
  if (isR2Configured()) {
    const raw = await getObjectText(INDEX_KEY);
    if (!raw) return [];
    return parseProblemIndex(raw);
  }
  return readLocalSeedIndex();
}

export async function getStoredProblemSet(
  slug: string,
): Promise<StoredProblemSet | null> {
  if (isR2Configured()) {
    const raw = await getObjectText(setObjectKey(slug));
    if (!raw) return null;
    return parseSet(raw);
  }
  return readLocalSeedSet(slug);
}

export function toPublicSet(stored: StoredProblemSet): PublicProblemSet {
  return {
    slug: stored.slug,
    title: stored.title,
    subject: stored.subject,
    description: stored.description,
    ...(stored.passage !== undefined && stored.passage !== ""
      ? { passage: stored.passage }
      : {}),
    questions: stored.questions.map(toPublicQuestion),
  };
}
