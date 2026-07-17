"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { likeComment } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DiaryDetailPath } from "@/types/like";
import CommentLikersDrawer from "./comment-likers-drawer";

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
      {/* <div className="text-accent/80">{count}</div> */}
      {ownerId === loginUserId ? (
        <CommentLikersDrawer commentId={commentId} count={count} />
      ) : (
        <div className="text-accent/80">{count}</div>
      )}
    </>
  );
};

export default CommentLike;
