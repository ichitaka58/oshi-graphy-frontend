"use client";

import { useState } from "react";
import { getLikers } from "./diary-like-actions";
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

const DiaryLikersDrawer = ({ id, count }: { id: string; count: number }) => {
  const [likers, setLikers] = useState<User[]>([]);

  const handleOpenChange = async (open: boolean) => {
    if(!open) return;
    const result = await getLikers(id);
    if (!result.success) {
      toast.error(result.message, { position: "top-center" });
      return;
    }
    setLikers(result.likers);
  }

  return (
    <Drawer direction="bottom" autoFocus onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button type="button" className="cursor-pointer">{count}</button>
      </DrawerTrigger>
      <DrawerContent className="min-w-72 max-w-92 mx-auto px-6">
        <DrawerHeader>
          <DrawerTitle>いいねユーザー一覧 : {count}人</DrawerTitle>
          {/* sr-only: 視覚的には隠しつつ、スクリーンリーダーには読ませる */}
          <DrawerDescription className="sr-only">
            この投稿にいいねしたユーザーの一覧です。
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
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DiaryLikersDrawer;
