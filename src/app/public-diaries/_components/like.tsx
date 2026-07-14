"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { likeDiary } from "../actions";
import { toast } from "sonner";
import { LikePath } from "@/types/like";

type Props = {
  likesCount: number;
  likedByMe: boolean;
  id: string;
  path: LikePath; // revalidatePathに渡すpath
};

const Like = ({ likesCount, likedByMe, id, path }: Props) => {
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
      <button type="button" onClick={handleLike} disabled={busy} className="disabled:cursor-not-allowed">
        <Heart
          className={cn(
            "size-5 transition-colors",
            liked ? "fill-accent" : "fill-none",
          )}
        />
      </button>
      <div>{count}</div>
    </div>
  );
};

export default Like;
