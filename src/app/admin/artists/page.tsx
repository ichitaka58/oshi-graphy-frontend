import { getCurrentUser } from "@/lib/auth";
import { forbidden } from "next/navigation";
import BackButton from "@/components/back-button";
import ArtistsListFetcher from "./_components/artists-list-fetcher";
import { Suspense } from "react";
import ArtistsListSkeleton from "./_components/artists-list-skeleton";

const AdminArtistsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const loginUser = await getCurrentUser();
  if (!loginUser.is_admin) {
    forbidden();
  }
  const { page = "1" } = await searchParams;

  return (
    <div>
      <BackButton />
      <div className="max-w-xl mx-auto pt-6 px-4">
        <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
          登録済みアーティスト一覧
        </h1>
        <div className="w-full p-4 bg-card text-card-foreground">
          <Suspense fallback={<ArtistsListSkeleton />}>
            <ArtistsListFetcher page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminArtistsPage;
