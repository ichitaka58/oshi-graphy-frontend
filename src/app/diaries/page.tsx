import DiariesPagination from "@/components/diaries-pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { DateFormatForHappenedOn } from "@/lib/date";
import type { DiaryListItem } from "@/types/diary";
import { Heart, MessageCircle } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Diaries = async ({
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
    <div className="max-w-4xl mx-auto pt-6">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {diaries.map((diary) => (
          <Card key={diary.id} className="">
            <div className="absolute inset-0 z-30 aspect-video" />
            <Image
              src="/placeholder.png"
              alt="cover image"
              width={400}
              height={225}
              className="w-full object-cover h-40"
              // className="relative z-20 aspect-video w-full object-cover h-40"
            />
            <CardHeader className="flex items-center justify-between pb-0">
              <div className="text-gray-600 text-xs">
                {new Intl.DateTimeFormat("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(diary.happened_on))}
              </div>
              <div className="text-red-500">{diary.artist.name}</div>
            </CardHeader>
            <CardContent className="w-full pt-0">
              <p className="text-sm line-clamp-2 lg:line-clamp-3 mb-2">
                {diary.body}
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <div>{diary.is_public ? "公開" : "非公開"}</div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Heart className="size-5" />
                  <span>{diary.likes_count}</span>
                </div>
                <div>コメント({diary.comments_count})</div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 motion-safe:animate-fade-up">
        {diaries.map((diary) => (
          <Link key={diary.id} href={`/diaries/${diary.id}`}>
            <article className="w-72 bg-slate-50 dark:text-gray-800 border border-gray-600 dark:border-gray-200 rounded-2xl shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <img
                src={
                  diary.cover_image
                    ? `${process.env.LARAVEL_API_URL}/storage/${diary.cover_image?.path}`
                    : `/placeholder.png`
                }
                alt="cover image"
                className="w-full h-48 object-cover"
              />
              <div className="flex flex-col justify-between h-32 p-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{DateFormatForHappenedOn(diary.happened_on)}</span>
                    <span className="text-red-500">{diary.artist.name}</span>
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
                  <div className="flex items-center gap-1">
                    <Heart className="size-5" />
                    <span>{diary.likes_count}</span>
                    <MessageCircle className="size-5" />
                    <span>{diary.comments_count}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      <DiariesPagination currentPage={currentPage} lastPage={lastPage} />
    </div>
  );
};

export default Diaries;
