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
  source?: "r2" | "local";
  r2Configured?: boolean;
};

type SetListProps = {
  /** 과목 페이지에서만 넘깁니다. `index.json`의 `subject`가 이 과목 제목과 같아야 합니다. */
  subjectSlug?: string;
  subjectTitle?: string;
};

export function SetList({ subjectSlug, subjectTitle }: SetListProps) {
  const [data, setData] = useState<ApiList | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = subjectSlug
          ? `?subject=${encodeURIComponent(subjectSlug)}`
          : "";
        const res = await fetch(`/api/sets${q}`, { cache: "no-store" });
        const json = (await res.json()) as ApiList;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("목록을 불러오지 못했습니다.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [subjectSlug]);

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
          <CardTitle>표시할 문제가 없습니다</CardTitle>
          <CardDescription>
            {data.message ??
              "content/r2-seed를 추가하거나 Vercel에 R2 환경 변수를 설정하세요."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">선택 1 — 임시 문제만 쓰기</p>
          <p className="mb-4">
            Git에 <code className="rounded bg-muted px-1 py-0.5 text-xs">content/r2-seed/</code> 가
            포함되어 있으면 R2 없이도 데모 세트가 보입니다. (커밋 후 배포)
          </p>
          <p className="mb-2 font-medium text-foreground">선택 2 — R2 연결</p>
          <ul className="list-inside list-disc space-y-1">
            <li>CLOUDFLARE_R2_ACCOUNT_ID</li>
            <li>CLOUDFLARE_R2_ACCESS_KEY_ID</li>
            <li>CLOUDFLARE_R2_SECRET_ACCESS_KEY</li>
            <li>CLOUDFLARE_R2_BUCKET_NAME</li>
          </ul>
          <p className="mt-4">
            R2에는 <code className="rounded bg-muted px-1 py-0.5 text-xs">content/r2-seed/</code> 와
            같은 구조로 업로드하면 됩니다.
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
            {subjectTitle
              ? `「${subjectTitle}」 과목으로 등록된 세트가 없습니다. index.json의 subject 필드를 과목 이름과 똑같이 맞추세요.`
              : data.r2Configured
                ? "R2 버킷에 index.json과 sets/*.json을 업로드한 뒤 다시 확인하세요."
                : "content/r2-seed/index.json을 추가하거나 R2를 연결하세요."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.source === "local" ? (
        <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="mr-2 align-middle">
            임시 데이터
          </Badge>
          저장소의 <code className="rounded bg-muted px-1 text-xs">content/r2-seed/</code> 를 사용 중입니다.
          R2 환경 변수를 넣으면 버킷 데이터로 전환됩니다.
        </p>
      ) : null}
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
    </div>
  );
}
