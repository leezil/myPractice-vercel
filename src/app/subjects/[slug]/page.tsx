import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SetList } from "@/components/set-list";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { getSubjectBySlug } from "@/lib/subjects";

type PageProps = { params: Promise<{ slug: string }> };

export default async function SubjectPage({ params }: PageProps) {
  const { slug } = await params;
  const course = getSubjectBySlug(slug);
  if (!course) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-fit -ml-2 gap-1",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          과목 선택
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">문제 세트를 고른 뒤 풀기를 누르세요.</p>
        </div>
        <SetList subjectSlug={course.slug} subjectTitle={course.title} />
      </main>
    </>
  );
}
