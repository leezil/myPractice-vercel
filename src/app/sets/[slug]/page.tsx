import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { QuizRunner } from "@/components/quiz-runner";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getStoredProblemSet, toPublicSet } from "@/lib/problems-store";
import { isR2Configured } from "@/lib/r2";

type PageProps = { params: Promise<{ slug: string }> };

export default async function SetPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isR2Configured()) {
    redirect("/");
  }
  const stored = await getStoredProblemSet(slug);
  if (!stored) {
    notFound();
  }
  const publicSet = toPublicSet(stored);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6 -ml-2 inline-flex gap-1",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          목록으로
        </Link>
        <QuizRunner initialSet={publicSet} />
      </main>
    </>
  );
}
