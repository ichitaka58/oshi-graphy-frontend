"use client";

import CommentBodyText from "./comment-body-text";
import type { Comment } from "@/types/comment";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import CommentFormDrawer from "./comment-form-drawer";
import { User } from "@/types/user";
import CommentDeleteMenu from "./comment-delete-menu";
import CommentLike from "./comment-like";
import { DiaryDetailPath } from "@/types/like";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const CommentList = ({
  comments,
  path, // pathはpublic-diariesの詳細ページかdiariesの詳細ページか
  loginUser,
}: {
  comments: Comment[];
  path: DiaryDetailPath;
  loginUser: User;
}) => {
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
              className={`${!isReply && "mt-2"} text-[10px] group hover:bg-secondary`}
              style={{ marginLeft: `${comment.depth * 8}px` }}
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <div>{comment.user.name ?? "退会ユーザー"}</div>
                  <div>{dayjs(comment.created_at).fromNow()}</div>
                  {/* <Heart className="size-4 text-accent/80" />
                  <div className="text-accent/80">{comment.likes_count}</div> */}
                  <CommentLike
                    likedByMe={comment.liked_by_me}
                    likesCount={comment.likes_count}
                    commentId={comment.id}
                    path={path}
                  />
                </div>
                {comment.user_id === loginUser.id && (
                  // 削除ボタン AlertDialog起動
                  <CommentDeleteMenu commentId={comment.id} path={path} />
                )}
              </div>

              {/* コメント本文の表示 */}
              <CommentBodyText text={comment.body} />
              {/* コメント返信用のフォーム */}
              <CommentFormDrawer
                diaryId={String(comment.diary_id)}
                path={path}
                isReply={true}
                parentId={comment.id}
                commentUserName={comment.user.name}
              />
              {comment.replies_count > 0 && (
                <button
                  type="button"
                  onClick={() => toggleReply(comment.id)}
                  className="ml-2"
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
