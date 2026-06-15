import { NextResponse } from "next/server";
import { getStoredProblemSet } from "@/lib/problems-store";
import {
  getCorrectIndices,
  gradeChoiceIndices,
} from "@/lib/question-grading";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

type GradeBody = {
  answers: Record<string, number>;
};

type SingleGradeBody = {
  questionId: string;
  choiceIndex?: number;
  choiceIndices?: number[];
};

function isSingleGradeBody(body: unknown): body is SingleGradeBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (typeof b.questionId !== "string") return false;
  if (typeof b.choiceIndex === "number") return true;
  if (Array.isArray(b.choiceIndices)) {
    return b.choiceIndices.every((x) => typeof x === "number");
  }
  return false;
}

function validatePicked(
  q: { choices: string[] },
  picked: number[],
): boolean {
  return picked.every(
    (i) => Number.isInteger(i) && i >= 0 && i < q.choices.length,
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

    const correctIndices = getCorrectIndices(q);
    const picked =
      body.choiceIndices !== undefined
        ? body.choiceIndices
        : typeof body.choiceIndex === "number"
          ? [body.choiceIndex]
          : [];

    if (!validatePicked(q, picked)) {
      return NextResponse.json({ error: "Invalid choice indices" }, { status: 400 });
    }

    const ok = gradeChoiceIndices(q, picked);
    return NextResponse.json({
      correct: ok,
      correctIndices,
      ...(typeof body.choiceIndex === "number" && correctIndices.length === 1
        ? { correctIndex: correctIndices[0] }
        : {}),
      explanation: q.explanation,
    });
  }

  const batch = body as GradeBody;
  if (!batch.answers || typeof batch.answers !== "object") {
    return NextResponse.json({ error: "answers required" }, { status: 400 });
  }

  const results: Record<
    string,
    {
      correct: boolean;
      correctIndices: number[];
      correctIndex?: number;
      explanation?: string;
    }
  > = {};
  let correct = 0;
  let total = 0;

  for (const q of stored.questions) {
    total += 1;
    const picked = batch.answers[q.id];
    const correctIndices = getCorrectIndices(q);
    const ok =
      typeof picked === "number" &&
      Number.isInteger(picked) &&
      picked >= 0 &&
      picked < q.choices.length &&
      correctIndices.length === 1 &&
      picked === correctIndices[0];
    if (ok) correct += 1;
    results[q.id] = {
      correct: ok,
      correctIndices,
      ...(correctIndices.length === 1 ? { correctIndex: correctIndices[0] } : {}),
      explanation: q.explanation,
    };
  }

  return NextResponse.json({
    score: { correct, total },
    results,
  });
}
