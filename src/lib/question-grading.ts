import type { StoredQuestion } from "@/lib/types/problem";

/** 저장소 문항의 정답 인덱스 목록 (복수·단일 모두 지원) */
export function getCorrectIndices(q: StoredQuestion): number[] {
  if (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) {
    return [...q.correctIndices].sort((a, b) => a - b);
  }
  if (typeof q.correctIndex === "number") {
    return [q.correctIndex];
  }
  return [];
}

export function gradeChoiceIndices(
  q: StoredQuestion,
  picked: number[],
): boolean {
  const correct = getCorrectIndices(q);
  const sortedPicked = [...picked].sort((a, b) => a - b);
  if (sortedPicked.length !== correct.length) return false;
  return sortedPicked.every((v, i) => v === correct[i]);
}
