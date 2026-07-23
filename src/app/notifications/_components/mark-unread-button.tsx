"use client";

import { toast } from "sonner";
import { markUnread } from "../actions";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useUnreadCount } from "@/contexts/unread-count-context";

const MarkUnreadButton = ({
  id,
  readAt,
}: {
  id: string;
  readAt: string | null;
}) => {
  const router = useRouter();
  // 未読件数を再取得するための関数をContextから取り出す
  const { refetch } = useUnreadCount();

  const handleClick = async () => {
    if (readAt === null) return;
    try {
      const result = await markUnread(id);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      router.refresh(); // このページ内の通知一覧の見た目(既読スタイル)を更新
      await refetch(); // Headerの未読件数バッジを更新
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    }
  };

  return (
    <button type="button" onClick={handleClick} className="cursor-pointer">
      未読
    </button>
  );
};

export default MarkUnreadButton;
