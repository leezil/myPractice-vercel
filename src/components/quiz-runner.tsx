"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { PublicProblemSet } from "@/lib/types/problem";

type GradeResponse = {
  score: { correct: number; total: number };
  results: Record<
    string,
    { correct: boolean; correctIndex: number; explanation?: string }
  >;
};

export function QuizRunner({ initialSet }: { initialSet: PublicProblemSet }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [graded, setGraded] = useState<GradeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const answeredCount = useMemo(
    () => initialSet.questions.filter((q) => answers[q.id] !== undefined).length,
    [answers, initialSet.questions],
  );

  async function submit() {
    if (answeredCount < initialSet.questions.length) {
      toast.warning("모든 문항에 답을 선택해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, number> = {};
      for (const q of initialSet.questions) {
        payload[q.id] = Number(answers[q.id]);
      }
      const res = await fetch(`/api/sets/${encodeURIComponent(initialSet.slug)}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) {
        toast.error("채점 요청에 실패했습니다.");
        return;
      }
      const json = (await res.json()) as GradeResponse;
      setGraded(json);
      toast.success(`채점 완료: ${json.score.correct} / ${json.score.total}`);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnswers({});
    setGraded(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{initialSet.title}</h1>
          <p className="text-sm text-muted-foreground">
            {initialSet.subject}
            {initialSet.description ? ` · ${initialSet.description}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            진행 {answeredCount}/{initialSet.questions.length}
          </Badge>
          {graded ? (
            <Badge>
              점수 {graded.score.correct}/{graded.score.total}
            </Badge>
          ) : null}
        </div>
      </div>

      <ScrollArea className="h-[min(70vh,640px)] pr-4">
        <div className="space-y-6 pb-4">
          {initialSet.questions.map((q, idx) => {
            const r = graded?.results[q.id];
            return (
              <Card key={q.id} className={r ? (r.correct ? "border-green-500/40" : "border-destructive/40") : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {idx + 1}. {q.stem}
                    </CardTitle>
                    {r ? (
                      r.correct ? (
                        <CheckCircle2 className="size-5 shrink-0 text-green-600" aria-label="정답" />
                      ) : (
                        <XCircle className="size-5 shrink-0 text-destructive" aria-label="오답" />
                      )
                    ) : null}
                  </div>
                  {r && !r.correct ? (
                    <CardDescription>
                      정답: {q.choices[r.correctIndex] ?? `선택지 ${r.correctIndex + 1}`}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3">
                  <RadioGroup
                    value={answers[q.id] ?? ""}
                    onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                    disabled={Boolean(graded)}
                    className="gap-3"
                  >
                    {q.choices.map((c, i) => {
                      const id = `${q.id}-${i}`;
                      return (
                        <div key={id} className="flex items-center gap-3 rounded-lg border p-3">
                          <RadioGroupItem value={String(i)} id={id} />
                          <Label htmlFor={id} className="flex-1 cursor-pointer text-sm font-normal leading-snug">
                            {c}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {r?.explanation ? (
                    <>
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">해설: </span>
                        {r.explanation}
                      </p>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex flex-wrap gap-2">
        <Button onClick={submit} disabled={loading || Boolean(graded)}>
          {loading ? "채점 중…" : "채점하기"}
        </Button>
        <Button type="button" variant="outline" onClick={reset} disabled={loading}>
          다시 풀기
        </Button>
      </div>
    </div>
  );
}
