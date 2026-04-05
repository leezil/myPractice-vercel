/** 문제 JSON의 `subject`는 과목 제목과 같아야 하며, 공백(전각 포함) 차이는 무시됩니다. */
export type CourseSubject = {
  slug: string;
  title: string;
};

export const COURSE_SUBJECTS: CourseSubject[] = [
  { slug: "history-leadership", title: "역사 속 리더십의 빛과 그림자" },
  { slug: "modern-law", title: "현대인의 생활법률" },
  { slug: "sw-design-patterns", title: "sw설계원칙과디자인패턴" },
  { slug: "smart-iot", title: "스마트 IOT 관리" },
  { slug: "ai-basics", title: "인공지능 기초" },
  { slug: "ai-digital", title: "AI 디지털전환" },
];

export function getSubjectBySlug(slug: string): CourseSubject | undefined {
  return COURSE_SUBJECTS.find((s) => s.slug === slug);
}
