import DiariesPagination from "./diaries-pagination";
import { Badge } from "@/components/ui/badge";
import { DateFormatForHappenedOn } from "@/lib/date";
import type { DiaryListItem } from "@/types/diary";
import { Heart, MessageCircle } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 motion-safe:animate-fade-up">
        {diaries.length === 0 ? (
          <p>まだ日記がありません</p>
        ) : (
          diaries.map((diary, index) => (
            <Link key={diary.id} href={`/diaries/${diary.id}`}>
              <article className="w-72 bg-card text-card-foreground border border-border rounded-2xl shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                <div className="relative w-full h-48">
                  <Image
                    src={
                      diary.cover_image
                        ? `/storage/${diary.cover_image.path}`
                        : `/placeholder.png`
                    }
                    alt="cover image"
                    fill
                    sizes="288px"
                    priority={index < 3} // 先頭3カードだけ先読み
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between h-32 p-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {DateFormatForHappenedOn(diary.happened_on)}
                      </span>
                      <Badge variant="secondary" className="text-red-500">
                        {diary.artist.name}
                      </Badge>
                      {/* <span className="text-red-500">{diary.artist.name}</span> */}
                    </div>
                    <p className="text-sm line-clamp-2 lg:line-clamp-3 mb-2">
                      {diary.body}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded ${diary.is_public ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}
                    >
                      {diary.is_public ? "公開" : "非公開"}
                    </span>
                    <div className="flex items-center gap-1 text-accent">
                      <Heart className="size-5" />
                      <span>{diary.likes_count}</span>
                      <MessageCircle className="size-5" />
                      <span>{diary.comments_count}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>
      <DiariesPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default DiariesList;