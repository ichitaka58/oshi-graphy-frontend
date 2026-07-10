import { Suspense } from "react";
import PublicDiaryDetail from "../_components/public-diary-detail";
import PublicDiaryDetailSkeleton from "../_components/public-diary-detail-skeleton";
import { getCurrentUser } from "@/lib/auth";

const PublicDiaryDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await getCurrentUser();
  return (
    <Suspense fallback={<PublicDiaryDetailSkeleton />}>
      <PublicDiaryDetail params={params} />
    </Suspense>
  );
};

export default PublicDiaryDetailPage;