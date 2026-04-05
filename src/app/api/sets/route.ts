import { NextResponse } from "next/server";
import { isR2Configured } from "@/lib/r2";
import { listProblemSetSummaries } from "@/lib/problems-store";

export const runtime = "nodejs";

export async function GET() {
  if (!isR2Configured()) {
    return NextResponse.json(
      {
        configured: false,
        sets: [] as Awaited<ReturnType<typeof listProblemSetSummaries>>,
        message:
          "Cloudflare R2 환경 변수가 설정되지 않았습니다. Vercel에 R2 키를 등록한 뒤 index.json을 업로드하세요.",
      },
      { status: 200 },
    );
  }
  const sets = await listProblemSetSummaries();
  return NextResponse.json({ configured: true, sets });
}
