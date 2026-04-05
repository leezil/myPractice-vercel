import { NextResponse } from "next/server";
import { getStoredProblemSet } from "@/lib/problems-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

type GradeBody = {
  answers: Record<string, number>;
};

type SingleGradeBody = {
  questionId: string;
  choiceIndex: number;
};

function isSingleGradeBody(
  body: unknown,
): body is SingleGradeBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.questionId === "string" &&
    typeof b.choiceIndex === "number"
  );
}

export async function POST(req: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const stored = await getStoredProblemSet(slug);
  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (isSingleGradeBody(body)) {
    const q = stored.questions.find((x) => x.id === body.questionId);
    if (!q) {
      return NextResponse.json({ error: "Unknown question" }, { status: 404 });
    }
    /** 클라이언트가 섞인 UI가 아니라, 저장소 `choices` 배열 기준 인덱스를 보냄 */
    const picked = body.choiceIndex;
    const valid =
      Number.isInteger(picked) &&
      picked >= 0 &&
      picked < q.choices.length;
    const ok = valid && picked === q.correctIndex;
    return NextResponse.json({
      correct: ok,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    });
  }

  const batch = body as GradeBody;
  if (!batch.answers || typeof batch.answers !== "object") {
    return NextResponse.json({ error: "answers required" }, { status: 400 });
  }

  const results: Record<
    string,
    { correct: boolean; correctIndex: number; explanation?: string }
  > = {};
  let correct = 0;
  let total = 0;

  for (const q of stored.questions) {
    total += 1;
    const picked = batch.answers[q.id];
    const ok =
      typeof picked === "number" &&
      Number.isInteger(picked) &&
      picked >= 0 &&
      picked < q.choices.length &&
      picked === q.correctIndex;
    if (ok) correct += 1;
    results[q.id] = {
      correct: ok,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    };
  }

  return NextResponse.json({
    score: { correct, total },
    results,
  });
}
