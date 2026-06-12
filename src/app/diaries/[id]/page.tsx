import { DateFormatForHappenedOn, DateFormatForUpdatedAt } from "@/lib/date";
import type { Comment } from "@/types/comment";
import type { DiaryDetail } from "@/types/diary";
import type { Image } from "@/types/image";
import { ChevronLeft, Heart } from "lucide-react";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { DiaryCarousel } from "@/components/DiaryCarousel";
import Link from "next/link";
import DiaryActionsMenu from "./_components/diary-actions-menu";
import { redirect } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const DiaryDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }

  const data = await res.json();
  const diary: DiaryDetail = data.diary;
  const comments: Comment[] = data.comments;
  const images: Image[] = diary.images;

  return (
    <div>
      <section className="flex justify-between text-sm py-2 pr-2 mb-4">
        <div className="flex items-center gap-1">
          <Link href="/diaries">
            <ChevronLeft />
          </Link>
          <div className="flex gap-1">
            <div>{DateFormatForHappenedOn(diary.happened_on)}</div>
            <div>{diary.artist.name}</div>
          </div>
          <div
            className={`text-[11px] px-2 py-0.5 rounded ${diary.is_public ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}
          >
            {diary.is_public ? "公 開" : "非公開"}
          </div>
        </div>
        <div>
          <DiaryActionsMenu id={id} />
        </div>
      </section>
      <div className="w-72 mx-auto">
        <section className="mb-4">
          <DiaryCarousel
            images={images}
            apiUrl={process.env.LARAVEL_API_URL!}
          />
        </section>
        <section className="p-4 bg-white">
          <div className="text-sm mb-2">{diary.body}</div>
          <div className="flex justify-between">
            <div className="text-xs">
              更新日時: {DateFormatForUpdatedAt(diary.updated_at)}
            </div>
            <div className="flex gap-1 pr-4">
              <Heart className="size-5" />
              <div>{diary.likes_count}</div>
            </div>
          </div>
        </section>
        <section className="px-2 text-sm">
          {comments.length === 0 ? (
            <p>まだコメントはありません</p>
          ) : (
            comments.map((comment) => {
              const isReply: boolean = comment.depth > 0;
              return (
                <div
                  key={comment.id}
                  className={`${isReply ? "ml-2" : "mt-2"}`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <div>{comment.user.name}</div>
                    <div>{dayjs(comment.created_at).fromNow()}</div>
                    <Heart className="size-4" />
                    <div>{comment.likes_count}</div>
                  </div>
                  <div>{comment.body}</div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default DiaryDetail;
