import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FinalReview } from "@/components/final-review";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button-variants";
import { getSubjectFinalReview, hasFinalReview } from "@/lib/final-review";
import { getSubjectBySlug } from "@/lib/subjects";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export default async function FinalReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getSubjectBySlug(slug);
  if (!course || !hasFinalReview(slug)) {
    notFound();
  }

  const review = getSubjectFinalReview(slug);
  if (!review?.sets.length) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        <Link
          href={`/subjects/${slug}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit -ml-2 gap-1",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {course.title}
        </Link>
        <FinalReview subjectTitle={course.title} {...review} />
      </main>
    </>
  );
}
