import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Ellipsis } from "lucide-react";

const DiaryDetailSkeleton = () => {
  return (
    <div>
      <div className="flex justify-between py-2 pr-2 mb-4">
        <div className="flex items-center gap-1">
          <ChevronLeft className="text-muted" /> {/* 戻るボタン */}
          <div className="flex gap-1">
            <Skeleton className="w-24 h-4" /> {/* 日付 */}
            <Skeleton className="w-14 h-4" /> {/* アーティスト名 */}
          </div>
          <Skeleton className="w-10 h-4" /> {/* 公開設定 */}
        </div>
        <Ellipsis className="text-muted" /> {/* ３点リーダ */}
      </div>
      <div className="w-72 mx-auto">
        {/* カルーセル部分 */}
        <div className="mb-2">
          <Skeleton className="w-72 h-72" /> {/* 写真部分 */}
          <div className="flex justify-center mt-2 pb-2">
            <Skeleton className="w-16 h-1.5" /> {/* インジケーター部分 */}
          </div>
        </div>
        {/* 日記本文、日時等 */}
        <div className="p-4 bg-card">
          <div className="mb-2">
            <Skeleton className="w-full h-4 mb-2" /> {/* 本文1行目 */}
            <Skeleton className="w-full h-4 mb-2" /> {/* 本文2行目 */}
            <Skeleton className="w-full h-4 mb-2" /> {/* 本文3行目 */}
            <Skeleton className="w-1/2 h-4 mb-2" /> {/* 本文4行目 */}
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="w-40 h-4" /> {/* 更新日時 */}
            <Skeleton className="w-6 h-4" /> {/* いいね */}
          </div>
        </div>
        {/* コメント部分 */}
        <div className="px-2 my-4 py-4 bg-card">
          <div className="flex gap-1 items-center">
            <Skeleton className="w-14 h-4" />
            <Skeleton className="w-6 h-4" />
          </div>
          <div className="px-2 mt-2">
            {/* コメント本文表示 数行分 */}
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-full h-4 mb-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiaryDetailSkeleton;