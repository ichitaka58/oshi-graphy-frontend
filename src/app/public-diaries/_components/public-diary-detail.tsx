import BackToListButton from "@/components/back-to-list-button";
import CommentList from "@/components/comment/comment-list";
import { DiaryCarousel } from "@/app/diaries/[id]/_components/diary-carousel";
import { Badge } from "@/components/ui/badge";
import { DateFormatForHappenedOn, DateFormatForUpdatedAt } from "@/lib/date";
import { PublicDiaryDetailItem } from "@/types/diary";
import { Image } from "@/types/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Heart } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Comment } from "@/types/comment";
import CommentFormDrawer from "@/components/comment/comment-form-drawer";
import { getCurrentUser } from "@/lib/auth";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const PublicDiaryDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/public-diaries/${id}`,
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

  const data = await res.json();
  const diary: PublicDiaryDetailItem = data.diary;
  const comments: Comment[] = data.comments;
  const images: Image[] = diary.images;

  // ログインユーザーを取得、CommentListに渡す
  const loginUser = await getCurrentUser();

  return (
    <div>
      <section className="flex text-sm py-2 pr-2 mb-2">
        <div className="flex items-center gap-1">
          <BackToListButton pathName="public-diaries" />
          <p>
            <span className="text-foreground font-bold">{diary.user.name}</span>
            さんの日記
          </p>
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
            <h3>コメント</h3>
            <span className="text-accent/80">({diary.comments_count})</span>
            {/* コメントフォーム */}
            <CommentFormDrawer
              diaryId={id}
              path={`/public-diaries/${id}`}
              isReply={false}
            />
          </div>
          {/* コメントリスト */}
          <CommentList
            comments={comments}
            path={`/public-diaries/${id}`}
            loginUser={loginUser}
          />
        </section>
      </div>
    </div>
  );
};

export default PublicDiaryDetail;
