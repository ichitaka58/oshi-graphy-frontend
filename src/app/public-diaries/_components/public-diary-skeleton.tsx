import DiarySkeleton from "@/components/diary-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const PublicDiarySkeleton = () => {
  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-center gap-2">
        <div className="flex gap-2">
          <Skeleton className="w-4 h-8" /> {/* 年ラベル */}
          <Skeleton className="w-20 h-8" /> {/* 年のセレクトボックス */}
          <Skeleton className="w-4 h-8" /> {/* 月ラベル */}
          <Skeleton className="w-16 h-8" /> {/* 月のセレクトボックス */}
        </div>
        <div className="sm:flex gap-2">
          <Skeleton className="w-24 h-8" /> {/* アーティストラベル */}
          <Skeleton className="w-full sm:w-56 h-8" /> {/* アーティストのセレクトボックス */}
        </div>
        <Skeleton className="w-full sm:w-12 h-8" /> {/* 検索ボタン */}
      </div>
      <DiarySkeleton />
    </>
  );
}

export default PublicDiarySkeleton;