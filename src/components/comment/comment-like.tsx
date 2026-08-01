"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { getLikersForComment, likeComment } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DiaryDetailPath } from "@/types/like";
import LikersDrawer from "../likers-drawer";

type Props = {
  likedByMe: boolean;
  likesCount: number;
  commentId: number;
  path: DiaryDetailPath;
  ownerId: number;
  loginUserId: number;
};

const CommentLike = ({
  likedByMe,
  likesCount,
  commentId,
  path,
  ownerId,
  loginUserId,
}: Props) => {
  const [liked, setLiked] = useState<boolean>(likedByMe);
  const [count, setCount] = useState<number>(likesCount);
  const [busy, setBusy] = useState<boolean>(false);

  const handleCommentLike = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await likeComment(commentId, liked, path);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCommentLike}
        disabled={busy}
        className="disabled:cursor-not-allowed"
      >
        <Heart
          className={cn(
            "size-4 text-accent/80 transition-colors",
            liked ? "fill-accent" : "fill-none",
          )}
        />
      </button>
      {ownerId === loginUserId ? (
        <LikersDrawer
          count={count}
          description="このコメントにいいねしたユーザーの一覧です。"
          fetchLikers={(page) => getLikersForComment(commentId, page)}
          triggerClassName="text-accent/80"
        />
      ) : (
        <div className="text-accent/80">{count}</div>
      )}
    </>
  );
};

export default CommentLike;
