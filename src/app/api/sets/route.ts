import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2";
import {
  getProblemDataSource,
  listProblemSetSummaries,
} from "@/lib/problems-store";
import { subjectLabelsEquivalent } from "@/lib/subject-match";
import { getSubjectBySlug } from "@/lib/subjects";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectSlug = searchParams.get("subject");

  const allSets = await listProblemSetSummaries();
  const source = getProblemDataSource();
  const r2Configured = isR2Configured();

  if (!r2Configured && allSets.length === 0) {
    return NextResponse.json(
      {
        configured: false,
        source: "local" as const,
        r2Configured: false,
        sets: [] as typeof allSets,
        message:
          "R2가 연결되어 있지 않고, 저장소의 content/r2-seed/index.json도 없거나 비어 있습니다. 임시로는 content/r2-seed/에 샘플을 두거나, Vercel에 R2 환경 변수를 넣으세요.",
      },
      { status: 200 },
    );
  }

  let sets = allSets;
  if (subjectSlug) {
    const course = getSubjectBySlug(subjectSlug);
    if (!course) {
      return NextResponse.json({ error: "알 수 없는 과목입니다." }, { status: 400 });
    }
    sets = allSets.filter((s) =>
      subjectLabelsEquivalent(s.subject, course.title),
    );
  }

  return NextResponse.json({
    configured: true,
    source,
    r2Configured,
    sets,
  });
}
