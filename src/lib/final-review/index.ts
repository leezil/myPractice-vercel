import type { SubjectFinalReview } from "./types";
import { HISTORY_LEADERSHIP_FINAL_REVIEW } from "./history-leadership";
import { MODERN_LAW_FINAL_REVIEW } from "./modern-law";
import {
  MODERN_LAW_ESSAY_EXAM_GUIDE,
  MODERN_LAW_LECTURE_SUPPLEMENT,
  MODERN_LAW_REQUIREMENT_LISTS,
} from "./modern-law-lecture";
import { SW_DESIGN_PATTERNS_FINAL_REVIEW } from "./sw-design-patterns";

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
    essayExamGuide: MODERN_LAW_ESSAY_EXAM_GUIDE,
    requirementLists: MODERN_LAW_REQUIREMENT_LISTS,
    lectureSupplement: MODERN_LAW_LECTURE_SUPPLEMENT,
  },
  "sw-design-patterns": {
    intro:
      "기말 강의자료 6주제를 키워드·역할·전이 중심으로 정리했습니다. 문제 풀이 전 빠르게 훑어보세요.",
    sets: SW_DESIGN_PATTERNS_FINAL_REVIEW.map((s) => ({
      ...s,
      quizSlug: s.slug,
    })),
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
