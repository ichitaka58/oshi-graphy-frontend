"use client";

import { toggleUserBlock } from "@/app/users/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { unstable_rethrow } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BlockUsersListItem = ({ initialBlocks }: { initialBlocks: User[] }) => {
  const [busy, setBusy] = useState<boolean>(false);
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleUnBlock = async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await toggleUserBlock(id, true);
      if (!result.success) {
        toast.error("ブロック解除に失敗しました", { position: "top-center" });
        return;
      }
      // ブロック一覧の中からブロック解除したユーザーを取り除く
      setBlocks((prev) => prev.filter(user => String(user.id) !== id))
      toast.success("ブロックを解除しました", { position: "top-center" });
    } catch (error) {
      unstable_rethrow(error);
      toast.error("通信エラーが発生しました", { position: "top-center" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {blocks.length === 0 ? (
        <p className="text-center text-muted-foreground">ブロックしているユーザーはいません</p>
      ) : (
        blocks.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center py-2 pr-2 hover:bg-muted group"
          >
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={user.icon_url} alt={`${user.name}icon`} />
                <AvatarFallback>OG</AvatarFallback>
              </Avatar>
              <p>{user.name}</p>
            </div>
            <button
              type="button"
              onClick={() => handleUnBlock(String(user.id))}
              disabled={busy}
              className="text-muted-foreground/50 text-xs opacity-0 group-hover:opacity-80 cursor-pointer"
            >
              解除
            </button>
          </li>
        ))
      )}
    </>
  );
};

export default BlockUsersListItem;
