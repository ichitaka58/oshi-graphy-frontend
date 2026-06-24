import { DateFormatForHappenedOn } from "@/lib/date";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { DiaryListItem } from "@/types/diary";

type DiaryCardListProps = {
  diaries: DiaryListItem[];
  renderStatus: (diary: DiaryListItem) => React.ReactNode;
}

const DiaryCardList = ({diaries, renderStatus}: DiaryCardListProps) => {
  return (
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
                    <Badge variant="default">{diary.artist.name}</Badge>
                  </div>
                  <p className="text-sm line-clamp-2 lg:line-clamp-3 mb-2">
                    {diary.body}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  {/* 公開設定かユーザー名か、を関数のpropsで渡す */}
                  {renderStatus(diary)} 
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
  );
}

export default DiaryCardList;