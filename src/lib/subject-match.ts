/** 과목 카드 제목과 index.json의 subject 비교용 (전각 공백·연속 공백 정규화) */
export function normalizeSubjectLabel(s: string): string {
  return s
    .trim()
    .replace(/\u3000/g, " ")
    .replace(/\s+/g, " ");
}

/** 공백 유무·개수와 무관하게 같은 과목으로 본다 (예: `역사속` vs `역사 속`) */
export function subjectLabelsEquivalent(a: string, b: string): boolean {
  const compact = (s: string) =>
    normalizeSubjectLabel(s).replace(/\s/g, "");
  return compact(a) === compact(b);
}
