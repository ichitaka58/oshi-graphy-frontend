import { Skeleton } from "@/components/ui/skeleton";

const DiariesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-72 border border-border rounded-2xl shadow-md overflow-hidden"
        >
          <Skeleton className="w-full h-48" />
          <div className="flex flex-col justify-between h-32 p-3">
            <div>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-20" /> {/* 日付 */}
                <Skeleton className="h-4 w-16" /> {/* アーティスト */}
              </div>
              <Skeleton className="mb-2 h-4 w-full" /> {/* 本文1行目 */}
              <Skeleton className="mb-2 h-4 w-3/4" /> {/* 本文2行目 */}
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-10" /> {/* 公開設定 */}
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-6" /> {/* いいね */}
                <Skeleton className="h-4 w-6" /> {/* コメント */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiariesSkeleton;
