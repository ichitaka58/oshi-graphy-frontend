import { getCurrentUser } from "@/lib/auth";
import NotificationsList from "./_components/notifications-list";
import MarkAllReadButton from "./_components/mark-all-read-button";

const NotificationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  await getCurrentUser();
  return (
    <div className="max-w-xl mx-auto pt-6 px-6">
      <h1 className="text-center mb-4 text-2xl text-foreground font-extrabold">
        通知一覧
      </h1>
      <MarkAllReadButton />
      <NotificationsList searchParams={searchParams} />
    </div>
  );
};

export default NotificationsPage;