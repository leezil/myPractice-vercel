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
import { cn } from "@/lib/utils";
import type { PublicProblemSet } from "@/lib/types/problem";

/**
 * 보기(선택지)만 무작위 순열로 섞음. 정답이 데이터에서 몇 번이든(0,1,2…) 가능한 모든 화면 위치에 균등하게 나올 수 있음.
 * 채점 API에는 반드시 원본 배열 기준 인덱스를 보냄(화면 줄 번호 그대로 보내지 않음).
 */
function shuffleChoices(choices: string[]): {
  choices: string[];
  /** 화면에서 `d`번째 줄 = 데이터상 원본 `choices[displayToOriginal[d]]` */
  displayToOriginal: number[];
  /** 데이터상 원본 인덱스 `o`가 화면에서 몇 번째인지 */
  originalToDisplay: number[];
} {
  const n = choices.length;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const shuffled = order.map((orig) => choices[orig]);
  const displayToOriginal = [...order];
  const originalToDisplay = new Array<number>(n);
  for (let d = 0; d < n; d++) {
    originalToDisplay[displayToOriginal[d]] = d;
  }
  return {
    choices: shuffled,
    displayToOriginal,
    originalToDisplay,
  };
}

function buildShuffleMap(set: PublicProblemSet): Record<string, ReturnType<typeof shuffleChoices>> {
  const map: Record<string, ReturnType<typeof shuffleChoices>> = {};
  for (const question of set.questions) {
    map[question.id] = shuffleChoices(question.choices);
  }
  return map;
}

type SingleGradeResponse = {
  correct: boolean;
  correctIndex: number;
  explanation?: string;
};

type QuestionOutcome = SingleGradeResponse & { picked: number };

export function QuizRunner({ initialSet }: { initialSet: PublicProblemSet }) {
  const { questions } = initialSet;
  const questionsKey = questions.map((qq) => qq.id).join("|");
  const [shuffleEpoch, setShuffleEpoch] = useState(0);
  const shuffleMap = useMemo(
    () => buildShuffleMap(initialSet),
    [initialSet.slug, questionsKey, shuffleEpoch],
  );

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
    const displayIdx = Number(raw);
    const sh = shuffleMap[q.id];
    /** 서버·JSON의 correctIndex와 같은 축: 원본 choices 배열의 인덱스 */
    const originalChoiceIndex = sh.displayToOriginal[displayIdx];
    if (originalChoiceIndex === undefined) {
      toast.error("선택이 올바르지 않습니다.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sets/${encodeURIComponent(initialSet.slug)}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: q.id,
          choiceIndex: originalChoiceIndex,
        }),
      });
      if (!res.ok) {
        toast.error("정답 확인에 실패했습니다.");
        return;
      }
      const json = (await res.json()) as SingleGradeResponse;
      setOutcomes((prev) => ({
        ...prev,
        [q.id]: { ...json, picked: originalChoiceIndex },
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
    setShuffleEpoch((e) => e + 1);
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
            value={
              outcome
                ? String(shuffleMap[q.id].originalToDisplay[outcome.picked])
                : (selection[q.id] ?? "")
            }
            onValueChange={(v) => {
              if (outcome) return;
              setSelection((prev) => ({ ...prev, [q.id]: v }));
            }}
            disabled={Boolean(outcome)}
            className="gap-3"
          >
            {shuffleMap[q.id].choices.map((c, displayIdx) => {
              const id = `${q.id}-d${displayIdx}`;
              const sh = shuffleMap[q.id];
              const o = outcome;
              const origAtRow = sh.displayToOriginal[displayIdx];
              const isAnswerRow = o != null && origAtRow === o.correctIndex;
              const isWrongPick =
                o != null && origAtRow === o.picked && !o.correct;
              return (
                <div
                  key={id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                    isAnswerRow &&
                      "border-emerald-600/55 bg-emerald-500/[0.14] dark:border-emerald-500/45 dark:bg-emerald-500/10",
                    isWrongPick &&
                      "border-red-600/55 bg-red-500/[0.12] dark:border-red-500/45 dark:bg-red-500/10",
                  )}
                >
                  <RadioGroupItem value={String(displayIdx)} id={id} />
                  <Label
                    htmlFor={id}
                    className={cn(
                      "flex-1 cursor-pointer text-sm font-normal leading-snug",
                      isAnswerRow && "text-emerald-950 dark:text-emerald-100",
                      isWrongPick && "text-red-950 dark:text-red-100",
                    )}
                  >
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
