"use client";

import { Heart } from "lucide-react";
import CommentBodyText from "./comment-body-text";
import type { Comment } from "@/types/comment";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const CommentList = ({ comments }: { comments: Comment[] }) => {
  const [openReplyIds, setOpenReplyIds] = useState<Set<number>>(new Set());

  const toggleReply = (id: number) => {
    setOpenReplyIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="px-2">
      {comments.length === 0 ? (
        <p className="text-muted-foreground mt-4">まだコメントはありません</p>
      ) : (
        comments.map((comment) => {
          const isReply: boolean = comment.depth > 0;
          if (isReply && !openReplyIds.has(comment.root_id)) return null;
          return (
            <div
              key={comment.id}
              className={`${!isReply && "mt-2"} text-[10px]`}
              style={{ marginLeft: `${comment.depth * 8}px` }}
            >
              <div className="flex items-center gap-1">
                <div>{comment.user.name ?? "退会ユーザー"}</div>
                <div>{dayjs(comment.created_at).fromNow()}</div>
                <Heart className="size-4 text-accent" />
                <div className="text-accent">{comment.likes_count}</div>
              </div>
              {/* コメント本文の表示 */}
              <CommentBodyText text={comment.body} />
              <button type="button" className="text-secondary-foreground">
                -返信-
              </button>
              {comment.replies_count > 0 && (
                <button
                  type="button"
                  onClick={() => toggleReply(comment.id)}
                  className="ml-2 text-secondary-foreground"
                >
                  {openReplyIds.has(comment.id)
                    ? "-返信を隠す-"
                    : `-返信を見る(${comment.replies_count})-`}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CommentList;
