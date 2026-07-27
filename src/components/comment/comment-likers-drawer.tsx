"use client";

import { useState } from "react";
import { getLikersForComment } from "./actions";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { User } from "@/types/user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

const CommentLikersDrawer = ({
  commentId,
  count,
}: {
  commentId: number;
  count: number;
}) => {
  const [likers, setLikers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [busy, setBusy] = useState<boolean>(false);

  const handleOpenChange = async (open: boolean) => {
    if (!open) return;
    const result = await getLikersForComment(commentId, 1);
    if (!result.success) {
      toast.error(result.message, { position: "top-center" });
      return;
    }
    setLikers(result.likers);
    setPage(1);
    setLastPage(result.lastPage);
  };

  const handleLoadMore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const nextPage = page + 1;
      const result = await getLikersForComment(commentId, nextPage);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setLikers((prev) => [...prev, ...result.likers]);
      setPage(nextPage);
      setLastPage(result.lastPage);
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer direction="bottom" autoFocus onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button type="button" className="text-accent/80 cursor-pointer">
          {count}
        </button>
      </DrawerTrigger>
      <DrawerContent className="min-w-72 max-w-92 mx-auto px-6">
        <DrawerHeader>
          <DrawerTitle>いいねユーザー一覧 : {count}人</DrawerTitle>
          {/* sr-only: 視覚的には隠しつつ、スクリーンリーダーには読ませる */}
          <DrawerDescription className="sr-only">
            このコメントにいいねしたユーザーの一覧です。
          </DrawerDescription>
        </DrawerHeader>
        {likers.map((liker) => (
          <div key={liker.id} className="hover:bg-muted">
            <Link
              href={`/users/${liker.id}`}
              className="flex items-center gap-2 mb-2"
            >
              <Avatar>
                <AvatarImage src={liker.icon_url} alt={`${liker.name}icon`} />
                <AvatarFallback>OG</AvatarFallback>
              </Avatar>
              <p>{liker.name}</p>
            </Link>
          </div>
        ))}
        {page < lastPage && (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={busy}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            - 続きを見る-
          </button>
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CommentLikersDrawer;
