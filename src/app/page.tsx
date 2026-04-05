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
            Cloudflare R2에 저장된 객관식 문제를 풀고, 서버에서 채점합니다. 정답 인덱스는 API에서만
            사용됩니다.
          </p>
        </div>
        <SetList />
      </main>
    </>
  );
}
