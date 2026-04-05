/** 과목 카드 제목과 index.json의 subject 비교용 (앞뒤 공백·연속 공백 정규화) */
export function normalizeSubjectLabel(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}
