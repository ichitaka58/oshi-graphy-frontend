import AppPagination from "@/components/app-pagination";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BlockUsersListItem from "./block-users-list-item";

const BlockUsersList = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = 1 } = await searchParams;
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/users/user-blocks?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );
  if (res.status === 401) {
    redirect("/login");
  }
  if (!res.ok) {
    throw new Error("データの取得に失敗しました");
  }
  const fetchData = await res.json();
  const blocks: User[] = fetchData.blocks.data;
  const lastPage: number = fetchData.blocks.last_page;
  const currentPage: number = fetchData.blocks.current_page;

  return (
    <>
      <ul className="pl-4">
        <BlockUsersListItem key={currentPage} initialBlocks={blocks} />
      </ul>
      <AppPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default BlockUsersList;
