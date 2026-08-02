"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { User } from "@/types/user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { LikersResult } from "@/types/like";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  description: string;
  fetchLikers: (page: number) => Promise<LikersResult>;
  triggerClassName?: string;
};

const LikersDrawer = ({
  count,
  description,
  fetchLikers,
  triggerClassName,
}: Props) => {
  const [likers, setLikers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [busy, setBusy] = useState<boolean>(false);

  const handleOpenChange = async (open: boolean) => {
    if (!open || busy) return;
    setBusy(true);
    try {
      const result = await fetchLikers(1);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setLikers(result.likers);
      setPage(1);
      setLastPage(result.lastPage);
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  const handleLoadMore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const nextPage = page + 1;
      const result = await fetchLikers(nextPage);
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
    // autoFocus 開いた時にフォーカスをdrawer内に移す アクセシビリティ目的
    <Drawer direction="bottom" autoFocus onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className={cn("cursor-pointer", triggerClassName)}
        >
          {count}
        </button>
      </DrawerTrigger>
      <DrawerContent className="min-w-72 max-w-92 mx-auto px-6">
        <DrawerHeader>
          <DrawerTitle>いいねユーザー一覧 : {count}人</DrawerTitle>
          {/* sr-only: 視覚的には隠しつつ、スクリーンリーダーには読ませる */}
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {likers.map((liker) => (
          <div key={liker.id} className="hover:bg-muted">
            <Link
              href={`/users/${liker.id}`}
              className="flex items-center gap-2 mb-2"
            >
              <Avatar>
                <AvatarImage
                  src={liker.icon_path ? `/storage/${liker.icon_path}` : "/images/icon_placeholder.png"}
                  alt={`${liker.name}icon`}
                />
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

export default LikersDrawer;
