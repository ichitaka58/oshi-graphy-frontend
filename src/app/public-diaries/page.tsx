import { Suspense } from "react";
import PublicDiariesList from "./_components/public-diaries-list";
import DiarySkeleton from "@/components/diary-skeleton";

const PublicDiariesPage = ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
        All Diaries
      </h1>
      <Suspense fallback={<DiarySkeleton />}>
        <PublicDiariesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PublicDiariesPage;
