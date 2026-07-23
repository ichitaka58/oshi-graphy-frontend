"use client";

import { Heart, MessageSquareText, UserRoundPlus } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { Notification } from "@/types/notification";
import { markRead } from "../actions";
import { unstable_rethrow, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import NotificationDeleteDialog from "./notification-delete-dialog";
import { useUnreadCount } from "@/contexts/unread-count-context";
import MarkUnreadButton from "./mark-unread-button";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const NotificationItem = ({ n }: { n: Notification }) => {
  const router = useRouter();
  // 未読件数を再取得するための関数をContextから取り出す
  const { refetch } = useUnreadCount();
  const generateUrl = () => {
    if (n.data.type === "like") {
      if (n.data.target === "comment") {
        return `/public-diaries/${n.data.diary_id}#comment-${n.data.comment_id}`;
      } else {
        return `/public-diaries/${n.data.diary_id}`;
      }
    } else if (n.data.type === "comment" || n.data.type === "reply") {
      return `/public-diaries/${n.data.diary_id}#comment-${n.data.comment_id}`;
    } else {
      return `/users/${n.data.actor_user_id}`;
    }
  };
  const url = generateUrl();

  // 通知をクリックして既読にし、アクション元に遷移する
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (n.read_at === null) {
        const result = await markRead(n.id);
        if (!result.success) {
          toast.error(result.message, { position: "top-center" });
          return;
        }
        // 既読化に成功したのでHeaderの未読件数バッジを最新化する。
        // router.pushで別ページに移動する前に呼んでおく(router.refreshとは違い
        // ルーティング/キャッシュに触れないただのstate更新なので、遷移と競合しない)
        await refetch();
      }
      router.push(url);
    } catch (error) {
      // Next.js特有のエラー（redirectなど）を再throwする
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    }
  };

  return (
    <li
      key={n.id}
      className="flex gap-2 items-center pb-2 hover:bg-muted group"
    >
      {n.data.type === "like" ? (
        <Heart
          className={`size-6 ${n.read_at === null ? "text-accent" : "text-accent/50"}`}
        />
      ) : n.data.type === "follow" ? (
        <UserRoundPlus
          className={`size-6 ${n.read_at === null ? "text-primary drop-shadow-xs drop-shadow-amber-500" : "text-primary/50 drop-shadow-xs drop-shadow-amber-200"}`}
        />
      ) : (
        <MessageSquareText
          className={`size-6 ${n.read_at === null ? "text-secondary-foreground/70" : "text-secondary-foreground/30"}`}
        />
      )}
      <div className="flex-1">
        <Link href={url} onClick={handleClick}>
          <p
            className={`text-sm ${n.read_at === null ? "text-foreground underline" : "text-foreground/50"}`}
          >
            {n.data.message}
          </p>
        </Link>
        <p
          className={`text-xs ${n.read_at === null ? "text-muted-foreground" : "text-muted-foreground/50"}`}
        >
          {dayjs(n.created_at).fromNow()}
        </p>
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground/50 opacity-0 group-hover:opacity-80">
        {/* 削除ボタン＆ダイアログ */}
        <NotificationDeleteDialog id={n.id} />
        {/* 未読にするボタン */}
        {n.read_at !== null && (
          <MarkUnreadButton id={n.id} readAt={n.read_at} />
        )}
      </div>
    </li>
  );
};

export default NotificationItem;
