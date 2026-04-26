import { readLocalSeedIndex, readLocalSeedSet, readLocalSeedSlugs } from "@/lib/local-seed";
import { parseProblemIndex } from "@/lib/problem-index";
import {
  INDEX_KEY_CANDIDATES,
  getObjectTextFirst,
  isR2Configured,
  listSetSlugsFromR2,
  setObjectKeyCandidates,
} from "@/lib/r2";
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
    const raw = await getObjectTextFirst(INDEX_KEY_CANDIDATES);
    const fromIndex = raw ? parseProblemIndex(raw) : [];

    // index.json이 없거나 일부만 있어도 sets/*.json 메타와 병합
    const slugs = await listSetSlugsFromR2();
    const sets = await Promise.all(slugs.map((slug) => getStoredProblemSet(slug)));
    const fromSets: ProblemSetSummary[] = sets
      .filter((set): set is StoredProblemSet => set !== null)
      .map((set) => ({
        slug: set.slug,
        title: set.title,
        subject: set.subject,
        description: set.description,
        questionCount: set.questions.length,
      }));

    const merged = new Map<string, ProblemSetSummary>();
    for (const row of fromSets) merged.set(row.slug, row);
    for (const row of fromIndex) merged.set(row.slug, row);
    return [...merged.values()];
  }
  const localIndex = await readLocalSeedIndex();
  const slugs = await readLocalSeedSlugs();
  const sets = await Promise.all(slugs.map((slug) => readLocalSeedSet(slug)));
  const fromSets: ProblemSetSummary[] = sets
    .filter((set): set is StoredProblemSet => set !== null)
    .map((set) => ({
      slug: set.slug,
      title: set.title,
      subject: set.subject,
      description: set.description,
      questionCount: set.questions.length,
    }));

  const merged = new Map<string, ProblemSetSummary>();
  for (const row of fromSets) merged.set(row.slug, row);
  for (const row of localIndex) merged.set(row.slug, row);
  return [...merged.values()];
}

export async function getStoredProblemSet(
  slug: string,
): Promise<StoredProblemSet | null> {
  if (isR2Configured()) {
    const keys = setObjectKeyCandidates(slug);
    const raw =
      keys.length > 0 ? await getObjectTextFirst(keys) : null;
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
