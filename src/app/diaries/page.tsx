import DiariesList from "./_components/diaries-list";
import { Suspense } from "react";
import DiarySkeleton from "@/components/diary-skeleton";
import { getCurrentUser } from "@/lib/auth";

const DiariesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  await getCurrentUser();
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
        <span className="text-primary text-shadow-sm text-shadow-primary-foreground/30">
          わたしの
        </span>{" "}
        <span className="text-3xl text-accent text-shadow-sm text-shadow-orange-500/30">
          推し活
        </span>{" "}
        日記
      </h1>
      <Suspense fallback={<DiarySkeleton />}>
        <DiariesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default DiariesPage;
