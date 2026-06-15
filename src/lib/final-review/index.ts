import type { SubjectFinalReview } from "./types";
import { HISTORY_LEADERSHIP_FINAL_REVIEW } from "./history-leadership";
import { MODERN_LAW_FINAL_REVIEW } from "./modern-law";
import { MODERN_LAW_LECTURE_SUPPLEMENT } from "./modern-law-lecture";

const REVIEW_BY_SUBJECT: Record<string, SubjectFinalReview> = {
  "history-leadership": {
    intro:
      "6개 강의 범위를 키워드·인물·사건·연도 중심으로 정리했습니다. 문제 풀이 전 빠르게 훑어보세요.",
    sets: HISTORY_LEADERSHIP_FINAL_REVIEW.map((s) => ({
      ...s,
      quizSlug: s.slug,
    })),
  },
  "modern-law": {
    ...MODERN_LAW_FINAL_REVIEW,
    lectureSupplement: MODERN_LAW_LECTURE_SUPPLEMENT,
  },
};

export function getSubjectFinalReview(
  subjectSlug: string,
): SubjectFinalReview | undefined {
  return REVIEW_BY_SUBJECT[subjectSlug];
}

export function getFinalReviewSets(subjectSlug: string) {
  return REVIEW_BY_SUBJECT[subjectSlug]?.sets;
}

export function hasFinalReview(subjectSlug: string): boolean {
  return subjectSlug in REVIEW_BY_SUBJECT;
}

export type { SubjectFinalReview } from "./types";
