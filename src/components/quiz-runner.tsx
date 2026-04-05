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
import { Separator } from "@/components/ui/separator";
import type { PublicProblemSet } from "@/lib/types/problem";

type SingleGradeResponse = {
  correct: boolean;
  correctIndex: number;
  explanation?: string;
};

type QuestionOutcome = SingleGradeResponse & { picked: number };

export function QuizRunner({ initialSet }: { initialSet: PublicProblemSet }) {
  const { questions } = initialSet;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [outcomes, setOutcomes] = useState<Record<string, QuestionOutcome>>({});
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"running" | "summary">("running");

  const q = questions[currentIndex];
  const outcome = q ? outcomes[q.id] : undefined;
  const verifiedCount = Object.keys(outcomes).length;

  const score = useMemo(() => {
    let c = 0;
    for (const o of Object.values(outcomes)) {
      if (o.correct) c += 1;
    }
    return { correct: c, total: verifiedCount };
  }, [outcomes, verifiedCount]);

  async function verifyCurrent() {
    if (!q) return;
    const raw = selection[q.id];
    if (raw === undefined || raw === "") {
      toast.warning("답을 선택해 주세요.");
      return;
    }
    const choiceIndex = Number(raw);
    setLoading(true);
    try {
      const res = await fetch(`/api/sets/${encodeURIComponent(initialSet.slug)}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, choiceIndex }),
      });
      if (!res.ok) {
        toast.error("정답 확인에 실패했습니다.");
        return;
      }
      const json = (await res.json()) as SingleGradeResponse;
      setOutcomes((prev) => ({
        ...prev,
        [q.id]: { ...json, picked: choiceIndex },
      }));
      toast[json.correct ? "success" : "message"](json.correct ? "정답입니다." : "오답입니다.");
    } finally {
      setLoading(false);
    }
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function showSummary() {
    setPhase("summary");
  }

  function resetAll() {
    setCurrentIndex(0);
    setSelection({});
    setOutcomes({});
    setPhase("running");
  }

  if (phase === "summary") {
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
          <Badge>
            결과 {score.correct} / {questions.length}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>퀴즈를 모두 풀었습니다</CardTitle>
            <CardDescription>
              맞힌 문항 {score.correct}개 · 전체 {questions.length}문항
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button type="button" onClick={resetAll}>
              처음부터 다시 풀기
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">문항별 결과</h2>
          {questions.map((item, idx) => {
            const o = outcomes[item.id];
            if (!o) return null;
            return (
              <Card
                key={item.id}
                className={o.correct ? "border-green-500/40" : "border-destructive/40"}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {idx + 1}. {item.stem}
                    </CardTitle>
                    {o.correct ? (
                      <CheckCircle2 className="size-5 shrink-0 text-green-600" aria-label="정답" />
                    ) : (
                      <XCircle className="size-5 shrink-0 text-destructive" aria-label="오답" />
                    )}
                  </div>
                  {!o.correct ? (
                    <CardDescription>
                      정답: {item.choices[o.correctIndex] ?? `선택지 ${o.correctIndex + 1}`}
                    </CardDescription>
                  ) : null}
                </CardHeader>
                {o.explanation ? (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">해설: </span>
                      {o.explanation}
                    </p>
                  </CardContent>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!q) {
    return null;
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
        <Badge variant="outline">
          문제 {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      {initialSet.passage ? (
        <Card className="border-dashed bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">공통 지문</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{initialSet.passage}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className={outcome ? (outcome.correct ? "border-green-500/40" : "border-destructive/40") : ""}>
        <CardHeader>
          {q.passage ? (
            <div className="mb-4 rounded-lg border bg-muted/40 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                지문
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{q.passage}</p>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-medium">
              {currentIndex + 1}. {q.stem}
            </CardTitle>
            {outcome ? (
              outcome.correct ? (
                <CheckCircle2 className="size-5 shrink-0 text-green-600" aria-label="정답" />
              ) : (
                <XCircle className="size-5 shrink-0 text-destructive" aria-label="오답" />
              )
            ) : null}
          </div>
          {outcome && !outcome.correct ? (
            <CardDescription>
              정답: {q.choices[outcome.correctIndex] ?? `선택지 ${outcome.correctIndex + 1}`}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={outcome ? String(outcome.picked) : (selection[q.id] ?? "")}
            onValueChange={(v) => {
              if (outcome) return;
              setSelection((prev) => ({ ...prev, [q.id]: v }));
            }}
            disabled={Boolean(outcome)}
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

          {outcome?.explanation ? (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">해설: </span>
                {outcome.explanation}
              </p>
            </>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            {!outcome ? (
              <Button onClick={verifyCurrent} disabled={loading}>
                {loading ? "확인 중…" : "정답 확인"}
              </Button>
            ) : currentIndex < questions.length - 1 ? (
              <Button type="button" onClick={goNext}>
                다음 문제
              </Button>
            ) : (
              <Button type="button" onClick={showSummary}>
                전체 결과 보기
              </Button>
            )}
            <Button type="button" variant="outline" onClick={resetAll} disabled={loading}>
              처음부터
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
