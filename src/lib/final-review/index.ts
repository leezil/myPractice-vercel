import type { ReviewSet } from "./types";
import { HISTORY_LEADERSHIP_FINAL_REVIEW } from "./history-leadership";

const REVIEW_BY_SUBJECT: Record<string, ReviewSet[]> = {
  "history-leadership": HISTORY_LEADERSHIP_FINAL_REVIEW,
};

export function getFinalReviewSets(subjectSlug: string): ReviewSet[] | undefined {
  return REVIEW_BY_SUBJECT[subjectSlug];
}

export function hasFinalReview(subjectSlug: string): boolean {
  return subjectSlug in REVIEW_BY_SUBJECT;
}
