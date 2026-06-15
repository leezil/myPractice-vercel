import Link from "next/link";
import type { ComponentType } from "react";
import { BookMarked, Calendar, Lightbulb, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ReviewSet } from "@/lib/final-review/types";

type FinalReviewProps = {
  subjectTitle: string;
  sets: ReviewSet[];
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

function ReviewSetSection({ set }: { set: ReviewSet }) {
  const anchor = set.slug;

  return (
    <section id={anchor} className="scroll-mt-20">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg">{set.title}</CardTitle>
          <CardDescription>{set.description}</CardDescription>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {set.keywords.slice(0, 8).map((kw) => (
              <Badge key={kw} variant="secondary">
                {kw}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-4">
          <div>
            <SectionLabel icon={Lightbulb}>핵심 개념</SectionLabel>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {set.concepts.map((c) => (
                <li
                  key={c.name}
                  className="rounded-lg border bg-muted/30 p-3"
                >
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {c.keywords.join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <SectionLabel icon={User}>인물</SectionLabel>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">이름</th>
                    <th className="pb-2 pr-4 font-medium">역할</th>
                    <th className="pb-2 pr-4 font-medium whitespace-nowrap">연도</th>
                    <th className="pb-2 font-medium">키워드</th>
                  </tr>
                </thead>
                <tbody>
                  {set.people.map((p) => (
                    <tr key={p.name} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{p.name}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{p.role}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap text-primary">{p.years ?? "—"}</td>
                      <td className="py-2.5 text-xs text-muted-foreground">
                        {p.keywords.join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div>
            <SectionLabel icon={Calendar}>사건 · 연도</SectionLabel>
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

          <Separator />

          <div>
            <SectionLabel icon={Tag}>암기 키워드</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {set.keywords.map((kw) => (
                <Badge key={kw} variant="outline">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
            <p className="text-sm font-semibold">한 줄 정리</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {set.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/sets/${set.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              이 세트 문제 풀기 →
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function FinalReview({ subjectTitle, sets }: FinalReviewProps) {
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
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              6개 강의 범위를 키워드·인물·사건·연도 중심으로 정리했습니다. 문제 풀이 전
              빠르게 훑어보세요.
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="강의 목차" className="rounded-xl border p-4">
        <p className="mb-3 text-sm font-medium">목차</p>
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
        </ol>
      </nav>

      <div className="flex flex-col gap-10">
        {sets.map((set) => (
          <ReviewSetSection key={set.slug} set={set} />
        ))}
      </div>
    </div>
  );
}
