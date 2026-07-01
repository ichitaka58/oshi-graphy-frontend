import DiaryPagination from "@/components/diary-pagination";
import DiaryCardList from "@/components/diary-card-list";
import { PublicDiaryListItem } from "@/types/diary";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PublicDiariesFilterForm from "./public-diaries-filter-form";

const PublicDiariesList = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    year?: string;
    month?: string;
    artist_id?: string;
  }>;
}) => {
  const { page = "1", year, month, artist_id } = await searchParams;
  const params = new URLSearchParams({ page });
  if (year && year !== "all") params.set("year", year);
  if (month && month !== "all") params.set("month", month);
  if (artist_id) params.set("artist_id", artist_id);

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/public-diaries?${params}`,
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
  const years: number[] = fetchData.years;
  const months: number[] = fetchData.months;
  const artistId: number | null = fetchData.artistId || null; // artistId=0ならnullにする
  const artistName: string | null = fetchData.artistName;

  return (
    <>
      {/* 年、月、アーティストによる検索分 */}
      <PublicDiariesFilterForm
        years={years}
        months={months}
        year={year}
        month={month}
        artistId={artistId}
        artistName={artistName}
      />
      {/* 日記一覧を表示する共通コンポーネント */}
      <DiaryCardList
        diaries={diaries}
        pathName="public-diaries"
      />
      <DiaryPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default PublicDiariesList;
