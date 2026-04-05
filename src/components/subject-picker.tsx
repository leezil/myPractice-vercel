import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { COURSE_SUBJECTS } from "@/lib/subjects";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SubjectPicker() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {COURSE_SUBJECTS.map((course) => (
        <li key={course.slug}>
          <Link href={`/subjects/${course.slug}`} className="block h-full">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base font-semibold leading-snug">
                  {course.title}
                </CardTitle>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardDescription>이 과목 문제 세트 보기</CardDescription>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
