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
};
