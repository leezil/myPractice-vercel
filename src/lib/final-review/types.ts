export type ReviewConcept = {
  name: string;
  keywords: string[];
};

export type ReviewPerson = {
  name: string;
  role: string;
  years?: string;
  keywords: string[];
};

export type ReviewEvent = {
  name: string;
  year: string;
  keywords: string[];
};

export type ReviewSet = {
  slug: string;
  title: string;
  description: string;
  concepts: ReviewConcept[];
  people: ReviewPerson[];
  events: ReviewEvent[];
  keywords: string[];
  takeaways: string[];
  /** 연결된 객관식 세트가 있을 때만 표시 */
  quizSlug?: string;
  /** 14주차 자료 순서대로 정리 (modern-law 등) */
  subsections?: ReviewSubsection[];
};

/** 자료 목차 순서의 소단원 */
export type ReviewSubsection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  numberedItems?: string[];
  scenarios?: {
    situation: string;
    article?: string;
    conclusion: string;
  }[];
  compareTable?: {
    headers: string[];
    rows: string[][];
  };
  note?: string;
};

/** 중간고사형 — 번호 매겨 외울 요건 목록 */
export type RequirementList = {
  id: string;
  title: string;
  priority: "high" | "medium";
  items: string[];
  note?: string;
};

/** 사례형 서술 — 자료 예시 그대로 */
export type ReviewScenario = {
  id: string;
  topic: string;
  situation: string;
  conclusion: string;
  article?: string;
};

/** 모의 서술형 2문항 */
export type EssayMockQuestion = {
  id: string;
  type: "list" | "scenario";
  label: string;
  prompt: string;
  modelAnswer: string;
  tip?: string;
};

export type SubjectFinalReview = {
  intro: string;
  sets: ReviewSet[];
  requirementLists?: RequirementList[];
  scenarios?: ReviewScenario[];
  essayMocks?: EssayMockQuestion[];
};
