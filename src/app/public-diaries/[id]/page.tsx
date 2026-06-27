import { Suspense } from "react";
import PublicDiaryDetail from "../_components/public-diary-detail";
import PublicDiaryDetailSkeleton from "../_components/public-diary-detail-skeleton";

const PublicDiaryDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense fallback={<PublicDiaryDetailSkeleton />}>
      <PublicDiaryDetail params={params} />
    </Suspense>
  );
};

export default PublicDiaryDetailPage;