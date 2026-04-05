import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2";
import { getStoredProblemSet } from "@/lib/problems-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

type GradeBody = {
  answers: Record<string, number>;
};

export async function POST(req: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug || !isR2Configured()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: GradeBody;
  try {
    body = (await req.json()) as GradeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "answers required" }, { status: 400 });
  }

  const stored = await getStoredProblemSet(slug);
  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const results: Record<
    string,
    { correct: boolean; correctIndex: number; explanation?: string }
  > = {};
  let correct = 0;
  let total = 0;

  for (const q of stored.questions) {
    total += 1;
    const picked = body.answers[q.id];
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
