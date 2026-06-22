import DiariesList from "./_components/diaries-list";
import { Suspense } from "react";
import DiariesSkeleton from "./_components/diaries-skeleton";

const DiariesPage =({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h1 className="text-center mb-4 text-2xl text-primary-foreground font-extrabold">
        My Diaries
      </h1>
      <Suspense fallback={<DiariesSkeleton />}>
        <DiariesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default DiariesPage;
