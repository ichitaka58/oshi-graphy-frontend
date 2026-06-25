import DiaryCardList from "@/components/diary-card-list";
import DiaryPagination from "@/components/diary-pagination";
import type { DiaryListItem } from "@/types/diary";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DiariesList = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/diaries?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }

  const fetchData = await res.json();
  const diaries: DiaryListItem[] = fetchData.diaries.data;
  const lastPage: number = fetchData.diaries.last_page;
  const currentPage: number = fetchData.diaries.current_page;

  return (
    <>
      {/* 日記一覧を表示する共通コンポーネント */}
      <DiaryCardList
        diaries={diaries}
        pathName="diaries"
        renderStatus={(diary) => (
          <span
            className={`text-[11px] px-2 py-0.5 rounded ${diary.is_public ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {diary.is_public ? "公開" : "非公開"}
          </span>
        )}
      />
      <DiaryPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default DiariesList;
