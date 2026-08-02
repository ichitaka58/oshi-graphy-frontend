"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { User } from "@/types/user";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { getFollowers } from "../../actions";
import { unstable_rethrow } from "next/navigation";

const FollowersListDrawer = ({
  userId,
  followersCount,
}: {
  userId: string;
  followersCount: number;
}) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [busy, setBusy] = useState<boolean>(false);

  const handleOpenChange = async (open: boolean) => {
    if (!open) return;
    const result = await getFollowers(userId, 1);
    if (!result.success) {
      toast.error(result.message, { position: "top-center" });
      return;
    }
    setFollowers(result.followers);
    setPage(1);
    setLastPage(result.lastPage);
  };

  const handleLoadMore = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const nextPage = page + 1;
      const result = await getFollowers(userId, nextPage);
      if (!result.success) {
        toast.error(result.message, { position: "top-center" });
        return;
      }
      setFollowers((prev) => [...prev, ...result.followers]);
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
        <span>
          フォロワー:{" "}
          <button type="button" className="cursor-pointer">
            {followersCount}人
          </button>
        </span>
      </DrawerTrigger>
      <DrawerContent className="min-w-72 max-w-92 mx-auto px-6">
        <DrawerHeader>
          <DrawerTitle>フォロワー一覧 : {followersCount}人</DrawerTitle>
          <DrawerDescription className="sr-only">
            このユーザーのフォロワーの一覧です。
          </DrawerDescription>
        </DrawerHeader>
        {followers.map((follower) => (
          <div key={follower.id} className="hover:bg-muted">
            <Link
              href={`/users/${follower.id}`}
              className="flex items-center gap-2 mb-2"
            >
              <Avatar>
                <AvatarImage
                  src={follower.icon_path ? `/storage/${follower.icon_path}` : "/images/icon_placeholder.png"}
                  alt={`${follower.name}icon`}
                />
                <AvatarFallback>OG</AvatarFallback>
              </Avatar>
              <p>{follower.name}</p>
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

export default FollowersListDrawer;
