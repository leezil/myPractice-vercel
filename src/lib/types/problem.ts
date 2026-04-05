/** R2 `index.json` 항목: 문제 세트 목록 */
export type ProblemSetSummary = {
  slug: string;
  title: string;
  subject: string;
  description?: string;
  questionCount: number;
};

/** R2 `sets/{slug}.json` 원본 (서버에서만 완전한 형태로 사용) */
export type StoredQuestion = {
  id: string;
  stem: string;
  choices: string[];
  /** 0-based index */
  correctIndex: number;
  explanation?: string;
};

export type StoredProblemSet = {
  slug: string;
  title: string;
  subject: string;
  description?: string;
  questions: StoredQuestion[];
};

/** 클라이언트에 내려주는 문제 (정답 인덱스 제외) */
export type PublicQuestion = {
  id: string;
  stem: string;
  choices: string[];
};

export type PublicProblemSet = {
  slug: string;
  title: string;
  subject: string;
  description?: string;
  questions: PublicQuestion[];
};
