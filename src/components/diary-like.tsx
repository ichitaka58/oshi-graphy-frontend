"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { likeDiary } from "./diary-like-actions";
import { toast } from "sonner";
import { LikePath } from "@/types/like";
import DiaryLikersDrawer from "./diary-likers-drawer";

type Props = {
  likesCount: number;
  likedByMe: boolean;
  id: string;
  path: LikePath; // revalidatePathに渡すpath
  variant: "list" | "detail"; // Drawerを出すか出さないか分岐に使用
  ownerId?: number;
  loginUserId?: number;
};

const DiaryLike = ({
  likesCount,
  likedByMe,
  id,
  path,
  variant,
  ownerId,
  loginUserId,
}: Props) => {
  const [liked, setLiked] = useState<boolean>(likedByMe);
  const [count, setCount] = useState<number>(likesCount);
  const [busy, setBusy] = useState<boolean>(false);

  const handleLike = async (e: React.MouseEvent) => {
    // 親要素（カード）のonClickによる詳細ページへの遷移を防ぐ
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const result = await likeDiary(id, liked, path);
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
    <div className="flex items-center gap-1 text-accent">
      <button
        type="button"
        onClick={handleLike}
        disabled={busy}
        className="disabled:cursor-not-allowed"
      >
        <Heart
          className={cn(
            "size-5 transition-colors",
            liked ? "fill-accent" : "fill-none",
          )}
        />
      </button>
      {/* いいね数をクリックしたらいいねしたユーザー一覧が表示 */}
      {variant === "detail" && ownerId === loginUserId ? (
        <DiaryLikersDrawer id={id} count={count} />
      ) : (
        <div>{count}</div>
      )}
    </div>
  );
};

export default DiaryLike;
