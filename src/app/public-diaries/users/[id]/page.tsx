import { Suspense } from "react";
import UserPublicDiariesList from "../_components/user-public-diaries-list";
import UserPublicDiarySkeleton from "../_components/user-public-diary-skeleton";
import BackButton from "@/components/back-button";
import { getCurrentUser } from "@/lib/auth";

const UserPublicDiariesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  await getCurrentUser();
  return (
    <>
      <div className="text-sm py-2">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<UserPublicDiarySkeleton />}>
          <UserPublicDiariesList params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
};

export default UserPublicDiariesPage;
