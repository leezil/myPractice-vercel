import { SiteHeader } from "@/components/site-header";
import { SubjectPicker } from "@/components/subject-picker";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">과목 선택</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            수업 과목을 고르면 해당 과목에 연결된 문제 세트만 보입니다. 데이터의{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">subject</code> 값이 아래 과목 이름과
            같아야 합니다. R2 또는 <code className="rounded bg-muted px-1 py-0.5 text-xs">content/r2-seed/</code>
            에 JSON을 올려 두면 됩니다.
          </p>
        </div>
        <SubjectPicker />
      </main>
    </>
  );
}
