"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProblemSetSummary } from "@/lib/types/problem";

type ApiList = {
  configured: boolean;
  sets: ProblemSetSummary[];
  message?: string;
};

export function SetList() {
  const [data, setData] = useState<ApiList | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/sets", { cache: "no-store" });
        const json = (await res.json()) as ApiList;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("목록을 불러오지 못했습니다.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle>오류</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        불러오는 중…
      </div>
    );
  }

  if (!data.configured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>R2 연결 필요</CardTitle>
          <CardDescription>
            {data.message ??
              "Vercel 환경 변수에 Cloudflare R2 자격 증명을 추가하고, 버킷 루트에 index.json을 올려주세요."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">필요한 환경 변수</p>
          <ul className="list-inside list-disc space-y-1">
            <li>CLOUDFLARE_R2_ACCOUNT_ID</li>
            <li>CLOUDFLARE_R2_ACCESS_KEY_ID</li>
            <li>CLOUDFLARE_R2_SECRET_ACCESS_KEY</li>
            <li>CLOUDFLARE_R2_BUCKET_NAME</li>
          </ul>
          <p className="mt-4">
            샘플 JSON은 저장소의 <code className="rounded bg-muted px-1 py-0.5 text-xs">content/r2-seed/</code>{" "}
            를 R2에 그대로 업로드하면 됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (data.sets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>등록된 문제 세트가 없습니다</CardTitle>
          <CardDescription>
            R2 버킷에 index.json과 sets/*.json을 업로드한 뒤 다시 확인하세요.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {data.sets.map((s) => (
        <li key={s.slug}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{s.subject}</Badge>
                <span className="text-xs text-muted-foreground">
                  문항 {s.questionCount}개
                </span>
              </div>
              <CardTitle className="text-lg leading-snug">{s.title}</CardTitle>
              {s.description ? (
                <CardDescription className="line-clamp-2">{s.description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardFooter>
              <Link
                href={`/sets/${encodeURIComponent(s.slug)}`}
                className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
              >
                풀기
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
