import { DiaryDetailItem } from "@/types/diary";
import { Image } from "@/types/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BackToListButton from "./back-to-list-button";
import { DateFormatForHappenedOn, DateFormatForUpdatedAt } from "@/lib/date";
import DiaryActionsMenu from "./diary-actions-menu";
import { DiaryCarousel } from "@/components/diary-carousel";
import { Heart, MessageCircle } from "lucide-react";
import CommentList from "./comment-list";
import { Comment } from "@/types/comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const DiaryDetail = async ({params}: {params: Promise<{id: string}>}) => {
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
    const diary: DiaryDetailItem = data.diary;
    const comments: Comment[] = data.comments;
    const images: Image[] = diary.images;

  return (
    <div>
      <section className="flex justify-between text-sm py-2 pr-2 mb-4">
        <div className="flex items-center gap-1 text-muted-foreground">
          {/* <Link href="/diaries"> */}
          <BackToListButton />
          {/* </Link> */}
          <div className="flex gap-1">
            <div>{DateFormatForHappenedOn(diary.happened_on)}</div>
            <div className="text-primary-foreground">{diary.artist.name}</div>
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
          <DiaryCarousel images={images} />
        </section>
        <section className="p-4 bg-card">
          <div className="text-sm mb-2 text-primary-foreground">
            {diary.body}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              更新日時: {DateFormatForUpdatedAt(diary.updated_at)}
            </div>
            <div className="flex items-center gap-1 pr-4 text-accent">
              <Heart className="size-5" />
              <div>{diary.likes_count}</div>
            </div>
          </div>
        </section>
        <section className="px-2 text-sm my-4 py-4 bg-card">
          <div className="flex gap-1 items-center">
            <h2 className="text-secondary-foreground">コメント</h2>
            <MessageCircle size={16} className="text-accent" />
            <span className="text-accent">{diary.comments_count}</span>
          </div>
          {/* コメントリスト */}
          <CommentList comments={comments} />
        </section>
      </div>
    </div>
  )
}

export default DiaryDetail;