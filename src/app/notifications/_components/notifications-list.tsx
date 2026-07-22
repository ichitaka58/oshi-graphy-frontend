import DiaryPagination from "@/components/diary-pagination";
import { Notification } from "@/types/notification";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationItem from "./notification-item";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const NotificationsList = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = "1" } = await searchParams;
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(
    `${process.env.LARAVEL_API_URL}/api/notifications?page=${page}`,
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
  const notifications: Notification[] = fetchData.notifications.data;
  const lastPage = fetchData.notifications.last_page;
  const currentPage = fetchData.notifications.current_page;

  return (
    <>
      <ul className="divide-y py-4 space-y-4">
        {notifications.length === 0 ? (
          <li>通知はありません</li>
        ) : (
          notifications.map((notification) => (
            <NotificationItem n={notification} key={notification.id} />
          ))
        )}
      </ul>
      <DiaryPagination currentPage={currentPage} lastPage={lastPage} />
    </>
  );
};

export default NotificationsList;
