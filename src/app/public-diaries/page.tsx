import { Suspense } from "react";
import PublicDiariesList from "./_components/public-diaries-list";
import PublicDiarySkeleton from "./_components/public-diary-skeleton";
import { getCurrentUser } from "@/lib/auth";

const PublicDiariesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  await getCurrentUser();
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
        All Diaries
      </h1>
      <Suspense fallback={<PublicDiarySkeleton />}>
        <PublicDiariesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PublicDiariesPage;
