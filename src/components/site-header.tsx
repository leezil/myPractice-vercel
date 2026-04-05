import Link from "next/link";
import { BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">시험 대비 문제풀이</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            문제 목록
          </Link>
        </div>
      </div>
    </header>
  );
}
