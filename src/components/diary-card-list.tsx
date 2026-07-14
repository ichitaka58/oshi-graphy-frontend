"use client";

import { DateFormatForHappenedOn } from "@/lib/date";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { DiaryListItem, PublicDiaryListItem } from "@/types/diary";
import { useRouter } from "next/navigation";
import Like from "@/app/public-diaries/_components/like";

type DiaryCardListProps = {
  diaries: DiaryListItem[];
  pathName: "diaries" | "public-diaries";
};

const DiaryCardList = ({ diaries, pathName }: DiaryCardListProps) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {diaries.length === 0 ? (
        <p>まだ日記がありません</p>
      ) : (
        diaries.map((diary, index) => (
          <div
            key={diary.id}
            onClick={() => router.push(`/${pathName}/${diary.id}`)}
          >
            <article className="w-72 bg-card text-card-foreground border border-border rounded-2xl shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-102 hover:shadow-xl">
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
                    <Badge variant="default">{diary.artist.name}</Badge>
                  </div>
                  <p className="text-sm line-clamp-2 lg:line-clamp-3 mb-2">
                    {diary.body}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  {pathName === "diaries" ? (
                    // 自分の日記の場合、公開設定を表示
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded ${diary.is_public ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {diary.is_public ? "公開" : "非公開"}
                    </span>
                  ) : (
                    // みんなの日記、ユーザー別日記の場合、ユーザー名を表示
                    <Link
                      href={`/public-diaries/users/${diary.user_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:underline decoration-muted-foreground"
                    >
                      <span className="text-[11px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {(diary as unknown as PublicDiaryListItem).user.name}
                      </span>
                    </Link>
                  )}

                  <div className="flex items-center gap-1 text-accent">
                    {/* いいねアイコン、いいね数 */}
                    <Like
                      likesCount={diary.likes_count}
                      likedByMe={diary.liked_by_me}
                      id={String(diary.id)}
                      path={`/${pathName}`}
                    />
                    {/* コメントアイコン、コメント数 */}
                    <MessageCircle className="size-5" />
                    <span>{diary.comments_count}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ))
      )}
    </div>
  );
};

export default DiaryCardList;
