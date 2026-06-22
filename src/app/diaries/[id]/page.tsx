import DiaryDetail from "./_components/diary-detail";
import { Suspense } from "react";
import DiaryDetailSkeleton from "./_components/diary-detail-skeleton";


const DiaryDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {

  return (
    <Suspense fallback={<DiaryDetailSkeleton />}>
      <DiaryDetail params={params} />
    </Suspense>
  );
};

export default DiaryDetailPage;
