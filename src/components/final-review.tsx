import Link from "next/link";
import type { ComponentType } from "react";
import {
  BookMarked,
  Calendar,
  ClipboardList,
  FileText,
  Lightbulb,
  ListChecks,
  Mic,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  EssayExamGuide,
  LectureSupplement,
  ReviewSubsection,
  SubjectFinalReview,
} from "@/lib/final-review/types";

type FinalReviewProps = SubjectFinalReview & {
  subjectTitle: string;
};

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
      <Icon className="size-4 text-primary" aria-hidden />
      {children}
    </h3>
  );
}

function SubsectionBlock({ section }: { section: ReviewSubsection }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <h4 className="font-medium text-foreground">{section.title}</h4>
      {section.paragraphs?.map((p) => (
        <p key={p} className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {section.numberedItems && section.numberedItems.length > 0 && (
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
          {section.numberedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )}
      {section.scenarios && section.scenarios.length > 0 && (
        <div className="mt-3 space-y-2">
          {section.scenarios.map((s) => (
            <div
              key={`${s.situation}-${s.article ?? ""}`}
              className="rounded-md border border-primary/15 bg-background p-3 text-sm"
            >
              <p className="font-medium text-foreground">예: {s.situation}</p>
              {s.article && (
                <p className="mt-1 text-xs text-primary">{s.article}</p>
              )}
              {s.conclusion && (
                <p className="mt-1 text-muted-foreground">→ {s.conclusion}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {section.compareTable && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                {section.compareTable.headers.map((h) => (
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.compareTable.rows.map((row) => (
                <tr key={row.join("-")} className="border-b border-border/60 last:border-0">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.note && (
        <p className="mt-3 rounded-md bg-primary/10 px-3 py-2 text-xs text-primary">
          {section.note}
        </p>
      )}
    </div>
  );
}

function ReviewSetSection({
  set,
}: {
  set: SubjectFinalReview["sets"][number];
}) {
  const hasSubsections = set.subsections && set.subsections.length > 0;
  const hasPeople = set.people.length > 0;
  const eventsLabel = hasPeople ? "사건 · 연도" : "조문 · 유형";

  return (
    <section id={set.slug} className="scroll-mt-20">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg">{set.title}</CardTitle>
          <CardDescription>{set.description}</CardDescription>
          {set.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {set.keywords.map((kw) => (
                <Badge key={kw} variant="secondary">
                  {kw}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          {hasSubsections ? (
            <div className="flex flex-col gap-3">
              {set.subsections!.map((sub) => (
                <SubsectionBlock key={sub.title} section={sub} />
              ))}
            </div>
          ) : (
            <>
              {set.concepts.length > 0 && (
                <div>
                  <SectionLabel icon={Lightbulb}>핵심 개념</SectionLabel>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {set.concepts.map((c) => (
                      <li key={c.name} className="rounded-lg border bg-muted/30 p-3">
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {c.keywords.join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasPeople && (
                <>
                  <Separator />
                  <div>
                    <SectionLabel icon={User}>인물</SectionLabel>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full min-w-[480px] text-left text-sm">
                        <thead>
                          <tr className="border-b text-xs text-muted-foreground">
                            <th className="pb-2 pr-4 font-medium">이름</th>
                            <th className="pb-2 pr-4 font-medium">역할</th>
                            <th className="pb-2 pr-4 font-medium whitespace-nowrap">
                              연도
                            </th>
                            <th className="pb-2 font-medium">키워드</th>
                          </tr>
                        </thead>
                        <tbody>
                          {set.people.map((p) => (
                            <tr
                              key={p.name}
                              className="border-b border-border/60 last:border-0"
                            >
                              <td className="py-2.5 pr-4 font-medium whitespace-nowrap">
                                {p.name}
                              </td>
                              <td className="py-2.5 pr-4 text-muted-foreground">
                                {p.role}
                              </td>
                              <td className="py-2.5 pr-4 whitespace-nowrap text-primary">
                                {p.years ?? "—"}
                              </td>
                              <td className="py-2.5 text-xs text-muted-foreground">
                                {p.keywords.join(" · ")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {set.events.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <SectionLabel icon={Calendar}>{eventsLabel}</SectionLabel>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {set.events.map((e) => (
                        <li
                          key={`${e.name}-${e.year}`}
                          className="flex gap-3 rounded-lg border p-3"
                        >
                          <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {e.year}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium leading-snug">{e.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {e.keywords.join(" · ")}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}

          {set.takeaways.length > 0 && (
            <>
              {!hasSubsections && <Separator />}
              <div className="rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
                <p className="text-sm font-semibold">한 줄 정리</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {set.takeaways.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {set.quizSlug && (
            <div className="flex justify-end">
              <Link
                href={`/sets/${set.quizSlug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                이 세트 문제 풀기 →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function EssayExamGuideSection({ guide }: { guide: EssayExamGuide }) {
  return (
    <section id="essay-exam-guide" className="scroll-mt-20" aria-labelledby="essay-exam-guide-heading">
      <h2 id="essay-exam-guide-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <FileText className="size-5 text-primary" aria-hidden />
        서술형 문제 유형 안내
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">{guide.summary}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {guide.types.map((t) => (
          <Card key={t.id}>
            <CardHeader className="border-b pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={t.id === "list" ? "default" : "secondary"}>
                  {t.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{t.points}</span>
              </div>
              <CardDescription className="mt-2 text-sm text-foreground">
                {t.description}
              </CardDescription>
            </CardHeader>
            {t.tips && t.tips.length > 0 && (
              <CardContent className="pt-3">
                <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                  {t.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guide.likelyTopics.map((topic) => (
          <Card
            key={topic.label}
            className={topic.priority === "high" ? "ring-2 ring-primary/20" : undefined}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">{topic.label}</CardTitle>
                {topic.priority === "high" && <Badge>출제 유력</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {topic.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function EssayMockSection({
  essayMocks,
}: {
  essayMocks: NonNullable<SubjectFinalReview["essayMocks"]>;
}) {
  return (
    <section aria-labelledby="essay-mock-heading">
      <h2 id="essay-mock-heading" className="mb-4 text-lg font-semibold">
        모의 서술형 (2문항)
      </h2>
      <div className="grid gap-4">
        {essayMocks.map((q) => (
          <Card key={q.id}>
            <CardHeader className="border-b pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={q.type === "list" ? "default" : "secondary"}>
                  {q.type === "list" ? "요건 나열" : "사례 적용"}
                </Badge>
                <CardTitle className="text-base">{q.label}</CardTitle>
              </div>
              <CardDescription className="mt-2 text-sm text-foreground">
                {q.prompt}
              </CardDescription>
              {q.tip && (
                <p className="text-xs text-muted-foreground">{q.tip}</p>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
                  모범 답안 보기
                </summary>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
                  {q.modelAnswer}
                </pre>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function LectureSupplementSection({
  supplement,
}: {
  supplement: LectureSupplement;
}) {
  return (
    <section id="lecture-supplement" className="scroll-mt-20" aria-labelledby="lecture-supplement-heading">
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Mic className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="lecture-supplement-heading" className="text-lg font-semibold tracking-tight">
              수업 보완 정리
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {supplement.intro}
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="수업 보완 목차" className="mb-6 rounded-xl border border-amber-500/20 p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium">
          <Mic className="size-4 text-amber-600 dark:text-amber-400" aria-hidden />
          수업 보완 목차
        </p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {supplement.groups.map((group, i) => (
            <li key={group.slug}>
              <a
                href={`#${group.slug}`}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <span className="text-muted-foreground">{i + 1}.</span> {group.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex flex-col gap-8">
        {supplement.groups.map((group) => (
          <section key={group.slug} id={group.slug} className="scroll-mt-20">
            <Card className="border-amber-500/20">
              <CardHeader className="border-b border-amber-500/10">
                <CardTitle className="text-lg">{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-4">
                {group.subsections.map((sub) => (
                  <SubsectionBlock key={sub.title} section={sub} />
                ))}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </section>
  );
}

export function FinalReview({
  subjectTitle,
  intro,
  sets,
  requirementLists,
  scenarios,
  essayMocks,
  essayExamGuide,
  lectureSupplement,
}: FinalReviewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookMarked className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">기말 정리</h1>
            <p className="mt-1 text-muted-foreground">{subjectTitle}</p>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{intro}</p>
          </div>
        </div>
      </div>

      <nav aria-label="목차" className="rounded-xl border p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium">
          <ClipboardList className="size-4" aria-hidden />
          목차
        </p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {sets.map((set, i) => (
            <li key={set.slug}>
              <a
                href={`#${set.slug}`}
                className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <span className="text-muted-foreground">{i + 1}.</span> {set.title}
              </a>
            </li>
          ))}
          {lectureSupplement && lectureSupplement.groups.length > 0 && (
            <li className="sm:col-span-2">
              <a
                href="#lecture-supplement"
                className="flex items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-sm transition-colors hover:bg-amber-500/10"
              >
                <Mic className="size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                수업 보완 정리 (별도)
              </a>
            </li>
          )}
          {essayExamGuide && (
            <li className="sm:col-span-2">
              <a
                href="#essay-exam-guide"
                className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm transition-colors hover:bg-primary/10"
              >
                <FileText className="size-4 shrink-0 text-primary" aria-hidden />
                서술형 문제 유형 안내
              </a>
            </li>
          )}
        </ol>
      </nav>

      <div className="flex flex-col gap-10">
        {sets.map((set) => (
          <ReviewSetSection key={set.slug} set={set} />
        ))}
      </div>

      {lectureSupplement && lectureSupplement.groups.length > 0 && (
        <>
          <Separator />
          <LectureSupplementSection supplement={lectureSupplement} />
        </>
      )}

      {essayExamGuide && <EssayExamGuideSection guide={essayExamGuide} />}

      {requirementLists && requirementLists.length > 0 && (
        <section aria-labelledby="req-heading">
          <h2 id="req-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ListChecks className="size-5 text-primary" aria-hidden />
            요건 나열형 암기 (출제 유력)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {requirementLists.map((list) => (
              <Card
                key={list.id}
                className={
                  list.priority === "high"
                    ? "ring-2 ring-primary/20"
                    : undefined
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{list.title}</CardTitle>
                    {list.priority === "high" && (
                      <Badge>출제 유력</Badge>
                    )}
                  </div>
                  {list.note && (
                    <CardDescription className="text-xs">{list.note}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed">
                    {list.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {essayMocks && essayMocks.length > 0 && (
        <EssayMockSection essayMocks={essayMocks} />
      )}

      {scenarios && scenarios.length > 0 && (
        <section aria-labelledby="scenario-heading">
          <h2 id="scenario-heading" className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FileText className="size-5 text-primary" aria-hidden />
            사례형 대비 (자료 예시)
          </h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">주제</th>
                  <th className="px-4 py-3 font-medium">사실관계</th>
                  <th className="px-4 py-3 font-medium">조문·권리</th>
                  <th className="px-4 py-3 font-medium">결론</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {s.topic}
                    </td>
                    <td className="px-4 py-3">{s.situation}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-primary">
                      {s.article ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.conclusion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
