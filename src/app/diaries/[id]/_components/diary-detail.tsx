import { DiaryDetailItem } from "@/types/diary";
import { Image } from "@/types/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BackToListButton from "./back-to-list-button";
import { DateFormatForHappenedOn, DateFormatForUpdatedAt } from "@/lib/date";
import DiaryActionsMenu from "./diary-actions-menu";
import { DiaryCarousel } from "./diary-carousel";
import { Heart, MessageCircle } from "lucide-react";
import CommentList from "./comment-list";
import { Comment } from "@/types/comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-center gap-1">
          <BackToListButton pathName="diaries" />
          <div
            className={`text-[11px] px-2 py-0.5 rounded ${diary.is_public ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {diary.is_public ? "公開中" : "非公開"}
          </div>
        </div>
        <div>
          <DiaryActionsMenu id={id} />
        </div>
      </section>
      <div className="w-72 mx-auto">
        <h2 className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span>{DateFormatForHappenedOn(diary.happened_on)}</span>
          <Badge variant="default">{diary.artist.name}</Badge>
        </h2>
        <section className="mb-2">
          <DiaryCarousel images={images} />
        </section>
        <section className="p-4 bg-secondary text-secondary-foreground">
          <div className="text-sm mb-2">{diary.body}</div>
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
        <section className="px-2 text-sm my-4 py-4 bg-muted text-muted-foreground">
          <div className="flex gap-1 items-center">
            <h2>コメント</h2>
            <MessageCircle size={14} className="text-accent/80" />
            <span className="text-accent/80">{diary.comments_count}</span>
          </div>
          {/* コメントリスト */}
          <CommentList comments={comments} />
        </section>
      </div>
    </div>
  );
}

export default DiaryDetail;