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
            <code className="rounded bg-muted px-1 py-0.5 text-xs">subject</code>는 아래 과목 이름과
            같으면 됩니다(공백 개수·전각 공백 차이는 무시). R2에는 버킷 루트의{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">index.json</code>·
            <code className="rounded bg-muted px-1 py-0.5 text-xs">sets/</code> 또는 저장소와 같은{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">content/r2-seed/</code> 경로를
            쓸 수 있습니다.
          </p>
        </div>
        <SubjectPicker />
      </main>
    </>
  );
}
