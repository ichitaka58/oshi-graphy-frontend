import DiaryCardList from "@/components/diary-card-list";
import DiaryPagination from "@/components/diary-pagination";
import { PublicDiaryListItem } from "@/types/diary";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const UserPublicDiariesList = async ({
  params,
  searchParams,
}: {
  params: Promise<{id: string}>
  searchParams: Promise<{ page?: string }>;
}) => {
  const { id } = await params;
  const { page = "1" } = await searchParams;

  const token = (await cookies()).get("token")?.value;
  
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/public-diaries/users/${id}?page=${page}`,
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
  const diaries: PublicDiaryListItem[] = fetchData.diaries.data;
  const lastPage: number = fetchData.diaries.last_page;
  const currentPage: number = fetchData.diaries.current_page;
  const user: User = fetchData.user;

  return (
    <>
      <h1 className="text-center text-2xl text-foreground font-extrabold">
        {user.name} さんの日記
      </h1>
      <p className="mb-4 text-center text-muted-foreground text-sm">
        <Link href={`/users/${id}`} className="underline">プロフィール</Link>を見る
      </p>
      {/* 日記一覧を表示する共通コンポーネント */}
      <DiaryCardList diaries={diaries} pathName="public-diaries" />
      <DiaryPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default UserPublicDiariesList;
