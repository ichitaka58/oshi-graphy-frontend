"use client";

import { Message } from "@/types/message";
import { DateFormatForUpdatedAt } from "@/lib/date";
import { useState } from "react";
import { getMoreMessages } from "../../actions";
import { unstable_rethrow } from "next/navigation";
import { toast } from "sonner";

const MessageThread = ({
  latestMessages,
  currentUserId,
  conversationId,
  lastPage,
}: {
  latestMessages: Message[];
  currentUserId: number;
  conversationId: number;
  lastPage: number;
}) => {
  const [busy, setBusy] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [newLastPage, setNewLastPage] = useState<number>(lastPage);
  // ２ページ目以降をステートに入れる
  const [olderMessages, setOlderMessages] = useState<Message[]>([]);
  // 同じメッセージが２回表示されないようにする
  const latestIds = new Set(latestMessages.map((m) => m.id));
  const messages = [...latestMessages, ...olderMessages.filter((m) => !latestIds.has(m.id))];

  // ２ページ目以降を取得する処理
  const handleLoadMore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const nextPage = page + 1;
      const result = await getMoreMessages(conversationId, nextPage);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setOlderMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        return [...prev, ...result.moreMessages.filter((m) => !ids.has(m.id))];
      });
      setPage(nextPage);
      setNewLastPage(result.lastPage);
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-secondary p-4 rounded flex-1 max-h-[70dvh] overflow-y-auto flex flex-col-reverse">
      <div className="mb-auto">
        {page < Math.max(lastPage, newLastPage) && (
          <div className="text-center pb-4">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={busy}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              - もっと読む -
            </button>
          </div>
        )}
        <ul className="space-y-2">
          {messages.length === 0 ? (
            <li>メッセージがありません</li>
          ) : (
            messages.toReversed().map((m) => (
              <li
                key={m.id}
                className={`flex items-center ${currentUserId === m.sender_id ? "justify-end" : "justify-start"}`}
              >
                <div className="w-1/2">
                  <span className="sr-only">
                    {currentUserId === m.sender_id ? "あなた" : "相手"}
                  </span>
                  <p
                    className={`p-2 text-xs rounded-lg whitespace-pre-wrap wrap-break-word ${currentUserId === m.sender_id ? "bg-primary/70" : "bg-card"}`}
                  >
                    {m.body}
                  </p>
                  <p className="text-[11px] text-right">
                    {DateFormatForUpdatedAt(m.created_at)}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default MessageThread;
