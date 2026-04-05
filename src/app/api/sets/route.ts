import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2";
import {
  getProblemDataSource,
  listProblemSetSummaries,
} from "@/lib/problems-store";

export const runtime = "nodejs";

export async function GET() {
  const sets = await listProblemSetSummaries();
  const source = getProblemDataSource();
  const r2Configured = isR2Configured();

  if (!r2Configured && sets.length === 0) {
    return NextResponse.json(
      {
        configured: false,
        source: "local" as const,
        r2Configured: false,
        sets: [],
        message:
          "R2가 연결되어 있지 않고, 저장소의 content/r2-seed/index.json도 없거나 비어 있습니다. 임시로는 content/r2-seed/에 샘플을 두거나, Vercel에 R2 환경 변수를 넣으세요.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    configured: true,
    source,
    r2Configured,
    sets,
  });
}
