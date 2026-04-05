import { NextResponse } from "next/server";
import { getStoredProblemSet, toPublicSet } from "@/lib/problems-store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const stored = await getStoredProblemSet(slug);
  if (!stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ set: toPublicSet(stored) });
}
