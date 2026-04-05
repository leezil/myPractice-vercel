import { SiteHeader } from "@/components/site-header";
import { SetList } from "@/components/set-list";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">문제 세트</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            R2에 올린 객관식 문제를 풀 수 있고, R2를 아직 안 쓰면 저장소의{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">content/r2-seed/</code> 데모를
            사용합니다. 채점은 서버에서만 정답을 확인합니다.
          </p>
        </div>
        <SetList />
      </main>
    </>
  );
}
