import BackButton from "@/components/back-button";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import BlockUsersList from "./_components/block-users-list";

const UserBlocksPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (Number(id) !== user.id) {
    notFound();
  }

  return (
    <div>
      <BackButton />
      <div className="px-6">
        <div className="max-w-md w-full mx-auto px-4 pt-4 pb-8 bg-card text-card-foreground">
          <h1 className="font-semibold text-lg text-center mb-4">
            ブロックユーザー一覧
          </h1>
          <BlockUsersList searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
};

export default UserBlocksPage;
