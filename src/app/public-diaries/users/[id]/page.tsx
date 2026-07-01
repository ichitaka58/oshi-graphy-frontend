import { Suspense } from "react";
import UserPublicDiariesList from "../_components/user-public-diaries-list";
import UserPublicDiarySkeleton from "../_components/user-public-diary-skeleton";

const UserPublicDiariesPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  return (
    <div className="max-w-4xl mx-auto pt-6">
      <Suspense fallback={<UserPublicDiarySkeleton />}>
        <UserPublicDiariesList params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default UserPublicDiariesPage;
