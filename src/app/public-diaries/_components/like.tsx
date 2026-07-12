"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { likeDiary } from "../actions";
import { toast } from "sonner";

type Props = {
  likesCount: number;
  likedByMe: boolean;
  id: string;
};

const Like = ({ likesCount, likedByMe, id }: Props) => {
  const [liked, setLiked] = useState<boolean>(likedByMe);
  const [count, setCount] = useState<number>(likesCount);
  const [busy, setBusy] = useState<boolean>(false);

  const handleLike = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await likeDiary(id, liked);
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
    <div className="flex items-center gap-1 pr-4 text-accent">
      <button onClick={handleLike}>
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
